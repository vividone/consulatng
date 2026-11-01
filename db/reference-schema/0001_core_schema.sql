-- =============================================================================
-- Consulat operations platform — core schema
-- =============================================================================
--
-- The spine, in one line:
--   client → expatriate → matter → stage → documents → obligations → fees
--
-- Two ideas carry most of the weight here:
--
-- 1. PIPELINES ARE DATA, NOT CODE. A service line is a row in `matter_types`,
--    and its stages, document checklist and fee items are rows in the three
--    `matter_type_*` tables. Consulat can add "Golden Visa" or re-order the
--    e-CERPAC checklist from the admin UI without a deploy. The alternative —
--    stages as a TypeScript enum — is less code today and a change request
--    every time the Nigeria Immigration Service moves a goalpost.
--
-- 2. TEMPLATES ARE COPIED, NOT REFERENCED. When a matter is opened, the
--    checklist is copied from the template into `matter_documents`. Editing a
--    template must never retroactively alter a matter that has already been
--    submitted — an audit trail that changes under you is not an audit trail.
--    `matter_type_document_id` records the provenance, and is nullable so a
--    one-off document can be added to a single matter.
--
-- Deliberately NOT in this migration: invoicing, telephony callbacks, and
-- training registrations. Each is a separate concern with its own migration,
-- and all three depend on decisions nobody has made yet.
--
-- Written against the four published stages (consultation → documentation →
-- submission and follow-up → approval and ongoing support). Process mapping
-- with the operations team will change the details; that is what the admin UI
-- is for.
-- =============================================================================

-- No pgcrypto: gen_random_uuid() has been core Postgres since 13, and
-- Supabase runs 15+.

-- -----------------------------------------------------------------------------
-- Staff and access
-- -----------------------------------------------------------------------------

create type staff_role as enum ('admin', 'manager', 'officer', 'accounts');

-- Mirrors auth.users. Supabase owns authentication; this holds the
-- business-level attributes (role, active) that drive RLS and assignment.
create table profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null,
  email       text not null,
  role        staff_role not null default 'officer',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Used by every RLS policy below. SECURITY DEFINER so the policy can read
-- `profiles` without recursing into profiles' own policy.
create or replace function is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and is_active
  );
$$;

create or replace function has_role(required staff_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and is_active and role = any(required)
  );
$$;

-- -----------------------------------------------------------------------------
-- Pipeline configuration — the customisable part
-- -----------------------------------------------------------------------------

create table matter_types (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  -- Prefix for generated matter references, e.g. 'EQ' → EQ-2026-0041.
  ref_prefix  text not null,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint ref_prefix_shape check (ref_prefix ~ '^[A-Z]{2,5}$')
);

create table matter_type_stages (
  id             uuid primary key default gen_random_uuid(),
  matter_type_id uuid not null references matter_types (id) on delete cascade,
  slug           text not null,
  name           text not null,
  description    text,
  sort_order     integer not null,
  -- Target working days in this stage. Drives the "overdue" view; null means
  -- no commitment, which is honest for stages that wait on a ministry.
  sla_days       integer,
  -- A matter sitting in a terminal stage is finished. More than one is
  -- allowed on purpose: "Approved" and "Withdrawn" both end a matter.
  is_terminal    boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (matter_type_id, slug),
  unique (matter_type_id, sort_order) deferrable initially deferred
);

create type fee_kind as enum ('professional', 'government', 'disbursement');

-- Fee items are templates. Separating professional fees from government
-- charges and disbursements is a billing requirement from the proposal, not a
-- nicety: corporate clients expect to see what went to the ministry.
create table matter_type_fee_items (
  id             uuid primary key default gen_random_uuid(),
  matter_type_id uuid not null references matter_types (id) on delete cascade,
  name           text not null,
  kind           fee_kind not null,
  default_amount numeric(14, 2),
  currency       char(3) not null default 'NGN',
  -- Added automatically when a matter of this type is opened.
  is_default     boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table matter_type_documents (
  id             uuid primary key default gen_random_uuid(),
  matter_type_id uuid not null references matter_types (id) on delete cascade,
  -- Which stage needs it. Null means "any time before approval".
  stage_id       uuid references matter_type_stages (id) on delete set null,
  name           text not null,
  description    text,
  is_required    boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Clients and people
-- -----------------------------------------------------------------------------

create type client_status as enum ('prospect', 'active', 'dormant', 'closed');

create table clients (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  -- CAC registration number. Not unique: prospects are often created before
  -- it is known, and null is the common case at that point.
  rc_number   text,
  status      client_status not null default 'prospect',
  address     text,
  -- Shared-drive folder for this client, so a matter links straight through
  -- to its documents. Populated by the Challenge 2 storage work.
  drive_folder_id text,
  account_manager_id uuid references profiles (id) on delete set null,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table client_contacts (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references clients (id) on delete cascade,
  full_name  text not null,
  job_title  text,
  email      text,
  phone      text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- At most one primary contact per client.
create unique index client_contacts_one_primary
  on client_contacts (client_id)
  where is_primary;

create table expatriates (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references clients (id) on delete cascade,
  full_name       text not null,
  nationality     text,
  passport_number text,
  date_of_birth   date,
  job_title       text,
  email           text,
  phone           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index expatriates_client_idx on expatriates (client_id);

-- -----------------------------------------------------------------------------
-- Matters
-- -----------------------------------------------------------------------------

create type matter_status as enum ('open', 'on_hold', 'completed', 'withdrawn');

create table matters (
  id               uuid primary key default gen_random_uuid(),
  -- Human reference, e.g. EQ-2026-0041. Assigned by trigger below.
  reference        text not null unique,
  client_id        uuid not null references clients (id) on delete restrict,
  -- Null for company-level matters such as a Business Permit, which attach to
  -- the client rather than to a named person.
  expatriate_id    uuid references expatriates (id) on delete restrict,
  matter_type_id   uuid not null references matter_types (id) on delete restrict,
  current_stage_id uuid references matter_type_stages (id) on delete restrict,
  status           matter_status not null default 'open',
  assigned_to      uuid references profiles (id) on delete set null,
  title            text,
  opened_at        timestamptz not null default now(),
  target_date      date,
  closed_at        timestamptz,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  -- A closed matter has a closing date; an open one does not.
  constraint closed_has_date check (
    (status in ('completed', 'withdrawn')) = (closed_at is not null)
  )
);

create index matters_client_idx on matters (client_id);
create index matters_expatriate_idx on matters (expatriate_id);
create index matters_assigned_idx on matters (assigned_to) where status = 'open';
create index matters_stage_idx on matters (current_stage_id);

-- Every stage transition, append-only. This is what makes "where is my
-- application" answerable without asking the person who handled it.
create table matter_stage_events (
  id            uuid primary key default gen_random_uuid(),
  matter_id     uuid not null references matters (id) on delete cascade,
  from_stage_id uuid references matter_type_stages (id) on delete set null,
  to_stage_id   uuid not null references matter_type_stages (id) on delete restrict,
  moved_by      uuid references profiles (id) on delete set null,
  moved_at      timestamptz not null default now(),
  note          text
);

create index matter_stage_events_matter_idx
  on matter_stage_events (matter_id, moved_at desc);

create type document_status as enum (
  'pending', 'received', 'submitted', 'approved', 'rejected', 'waived'
);

create table matter_documents (
  id          uuid primary key default gen_random_uuid(),
  matter_id   uuid not null references matters (id) on delete cascade,
  -- Provenance: which template row this came from. Null for a one-off.
  -- `set null` rather than cascade — deleting a template must not delete the
  -- record that a document was collected.
  matter_type_document_id uuid references matter_type_documents (id) on delete set null,
  name        text not null,
  description text,
  is_required boolean not null default true,
  status      document_status not null default 'pending',
  -- File lives in the client's shared drive, not in Postgres.
  drive_file_id text,
  received_at timestamptz,
  note        text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index matter_documents_matter_idx on matter_documents (matter_id);

-- -----------------------------------------------------------------------------
-- Obligations — the compliance engine
-- -----------------------------------------------------------------------------
--
-- The proposal calls this the highest-value component, because it protects
-- revenue Consulat already holds. Two shapes, one table:
--
--   'expiry'    — a permit runs out on a date. One-off; renewing it creates a
--                 new matter, which in turn creates the next expiry.
--   'recurring' — monthly returns. Rolls forward on completion, forever.
--
-- `recurrence_interval` is null for an expiry and set for a recurring one;
-- the check constraint keeps the two from being confused.

create type obligation_kind as enum ('expiry', 'recurring');
create type obligation_status as enum ('pending', 'completed', 'cancelled');

create table obligations (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references clients (id) on delete cascade,
  expatriate_id uuid references expatriates (id) on delete cascade,
  -- The matter that created this obligation, for traceability.
  source_matter_id uuid references matters (id) on delete set null,
  kind          obligation_kind not null,
  name          text not null,
  due_on        date not null,
  recurrence_interval interval,
  -- Days before `due_on` to start warning. Multiple entries give escalating
  -- reminders: {60, 30, 7} warns at two months, one month and a week.
  reminder_lead_days integer[] not null default '{60,30,7}',
  status        obligation_status not null default 'pending',
  completed_at  timestamptz,
  last_notified_on date,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint recurrence_matches_kind check (
    (kind = 'recurring') = (recurrence_interval is not null)
  )
);

-- The query behind the dashboard: what is due, soonest first.
create index obligations_due_idx
  on obligations (due_on)
  where status = 'pending';

create index obligations_client_idx on obligations (client_id);

-- -----------------------------------------------------------------------------
-- Audit log
-- -----------------------------------------------------------------------------

create table audit_log (
  id          bigserial primary key,
  actor_id    uuid references profiles (id) on delete set null,
  action      text not null,
  entity_type text not null,
  entity_id   uuid,
  detail      jsonb,
  occurred_at timestamptz not null default now()
);

create index audit_log_entity_idx on audit_log (entity_type, entity_id, occurred_at desc);

-- -----------------------------------------------------------------------------
-- Triggers
-- -----------------------------------------------------------------------------

create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'profiles', 'matter_types', 'matter_type_stages', 'matter_type_fee_items',
    'matter_type_documents', 'clients', 'client_contacts', 'expatriates',
    'matters', 'matter_documents', 'obligations'
  ]
  loop
    execute format(
      'create trigger %I_touch before update on %I
         for each row execute function touch_updated_at()',
      t, t
    );
  end loop;
end;
$$;

-- Matter references: <PREFIX>-<YEAR>-<4-digit sequence within that year>.
-- Generated in a trigger rather than the application so that two officers
-- opening a matter at the same moment cannot collide. The advisory lock
-- serialises only matters sharing a prefix and year.
create or replace function assign_matter_reference()
returns trigger
language plpgsql
as $$
declare
  prefix text;
  yr     text := to_char(now(), 'YYYY');
  seq    integer;
begin
  if new.reference is not null and new.reference <> '' then
    return new;
  end if;

  select ref_prefix into prefix from matter_types where id = new.matter_type_id;

  perform pg_advisory_xact_lock(hashtext(prefix || yr));

  select coalesce(max(substring(reference from '\d+$')::integer), 0) + 1
    into seq
    from matters
   where reference like prefix || '-' || yr || '-%';

  new.reference := format('%s-%s-%s', prefix, yr, lpad(seq::text, 4, '0'));
  return new;
end;
$$;

create trigger matters_assign_reference
  before insert on matters
  for each row execute function assign_matter_reference();

-- A matter's stage must belong to that matter's type. Without this, a
-- mis-wired form could park an e-Visa matter in a Business Permit stage and
-- every pipeline count would quietly be wrong.
create or replace function check_stage_belongs_to_type()
returns trigger
language plpgsql
as $$
begin
  if new.current_stage_id is null then
    return new;
  end if;

  if not exists (
    select 1 from matter_type_stages
    where id = new.current_stage_id and matter_type_id = new.matter_type_id
  ) then
    raise exception
      'Stage % does not belong to matter type %',
      new.current_stage_id, new.matter_type_id;
  end if;

  return new;
end;
$$;

create trigger matters_check_stage
  before insert or update of current_stage_id, matter_type_id on matters
  for each row execute function check_stage_belongs_to_type();

-- Record every stage change without the application having to remember to.
create or replace function log_stage_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and new.current_stage_id is not distinct from old.current_stage_id then
    return new;
  end if;

  if new.current_stage_id is null then
    return new;
  end if;

  insert into matter_stage_events (matter_id, from_stage_id, to_stage_id, moved_by)
  values (
    new.id,
    case when tg_op = 'UPDATE' then old.current_stage_id end,
    new.current_stage_id,
    auth.uid()
  );

  return new;
end;
$$;

create trigger matters_log_stage_change
  after insert or update of current_stage_id on matters
  for each row execute function log_stage_change();

-- -----------------------------------------------------------------------------
-- Row-level security
-- -----------------------------------------------------------------------------
--
-- Every table is staff-only. The client-facing portal in the proposal's
-- Stage 3 will add policies keyed on a client_id claim; the structure here
-- anticipates that (everything hangs off `clients`) without building it.

alter table profiles              enable row level security;
alter table matter_types          enable row level security;
alter table matter_type_stages    enable row level security;
alter table matter_type_fee_items enable row level security;
alter table matter_type_documents enable row level security;
alter table clients               enable row level security;
alter table client_contacts       enable row level security;
alter table expatriates           enable row level security;
alter table matters               enable row level security;
alter table matter_stage_events   enable row level security;
alter table matter_documents      enable row level security;
alter table obligations           enable row level security;
alter table audit_log             enable row level security;

-- Anyone on staff reads everything. A five-person firm where the officer
-- handling a matter cannot see the client record is a firm that works around
-- its own software.
do $$
declare t text;
begin
  foreach t in array array[
    'matter_types', 'matter_type_stages', 'matter_type_fee_items',
    'matter_type_documents', 'clients', 'client_contacts', 'expatriates',
    'matters', 'matter_documents', 'obligations'
  ]
  loop
    execute format(
      'create policy %I_staff_read on %I for select using (is_active_staff())',
      t, t
    );
    execute format(
      'create policy %I_staff_write on %I for insert with check (is_active_staff())',
      t, t
    );
    execute format(
      'create policy %I_staff_update on %I for update using (is_active_staff())',
      t, t
    );
  end loop;
end;
$$;

-- Deletion is narrower than reading. Operational records are corrected by
-- changing status, not by removal; only an admin can actually destroy one.
do $$
declare t text;
begin
  foreach t in array array[
    'matter_types', 'matter_type_stages', 'matter_type_fee_items',
    'matter_type_documents', 'clients', 'client_contacts', 'expatriates',
    'matters', 'matter_documents', 'obligations'
  ]
  loop
    execute format(
      'create policy %I_admin_delete on %I for delete using (has_role(array[''admin'']::staff_role[]))',
      t, t
    );
  end loop;
end;
$$;

-- Stage history and the audit log are append-only for everyone, including
-- admins: select and insert policies only, no update or delete. A trail that
-- can be edited proves nothing. Note the trigger writes these rows, so the
-- insert policy covers it under the acting user's identity.
create policy matter_stage_events_staff_read on matter_stage_events
  for select using (is_active_staff());
create policy matter_stage_events_insert on matter_stage_events
  for insert with check (is_active_staff());

create policy profiles_read_self_and_staff on profiles
  for select using (is_active_staff() or id = auth.uid());
create policy profiles_admin_write on profiles
  for all using (has_role(array['admin']::staff_role[]))
  with check (has_role(array['admin']::staff_role[]));

create policy audit_log_staff_read on audit_log
  for select using (is_active_staff());
create policy audit_log_insert on audit_log
  for insert with check (is_active_staff());

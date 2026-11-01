-- =============================================================================
-- Seed: the five service lines and their pipelines
-- =============================================================================
--
-- Scope note, because it matters for how this is read:
--
-- The STAGES below are Consulat's own published process ("consultation →
-- documentation → submission and follow-up → approval and ongoing support",
-- from the services pages), specialised per service line using the activities
-- each page already lists. They are a defensible starting point.
--
-- The DOCUMENT CHECKLISTS are deliberately almost empty. What the Nigeria
-- Immigration Service and the Federal Ministry of Interior actually require
-- for each application is domain knowledge held by the people who file them,
-- and inventing a plausible-looking checklist here would be worse than
-- leaving it blank — it would look authoritative and be wrong. Process
-- mapping fills these in, through the admin UI, which is the whole point of
-- keeping them in data.
--
-- The FEE ITEMS carry no amounts for the same reason. The three-way split
-- (professional / government / disbursement) is specified in the proposal;
-- the figures are not ours to guess.
--
-- SLA days are left null throughout. A commitment nobody has agreed to is
-- not a commitment.
-- =============================================================================

insert into matter_types (slug, name, description, ref_prefix, sort_order) values
  ('business-permit', 'Business Permit',
   'Legal authorisation for a foreign-owned or foreign-affiliated company to operate in Nigeria. Largely one-off, but underpins every quota application that follows for that company.',
   'BP', 1),
  ('expatriate-quota', 'Expatriate Quota',
   'Approvals allowing an organisation to employ foreign nationals in Nigeria, including establishment and additional quota, renewals and monthly returns.',
   'EQ', 2),
  ('e-cerpac', 'e-CERPAC',
   'Combined Expatriate Residence Permit and Aliens Card — new applications, regularisation, migration and renewal. Driven by expiry dates held against each named expatriate.',
   'CER', 3),
  ('e-visas', 'e-Visas',
   'Entry visas: business visa, temporary work permit, tourist visa and visa on arrival. Short-cycle and higher volume, governed by a travel date rather than an expiry.',
   'EV', 4),
  ('training', 'Training',
   'Training sessions delivered rather than permits obtained. No expiry, and a different billing basis to the immigration lines.',
   'TRN', 5);

-- -----------------------------------------------------------------------------
-- Stages
-- -----------------------------------------------------------------------------

with stage_data (type_slug, slug, name, description, sort_order, is_terminal) as (
  values
    -- Business Permit
    ('business-permit', 'consultation',  'Eligibility Assessment', 'Establish whether the company qualifies and what the application will require.', 1, false),
    ('business-permit', 'documentation', 'Documentation',          'Collect and prepare the corporate documents for submission.',                    2, false),
    ('business-permit', 'submission',    'Ministry Submission',    'File with the Federal Ministry of Interior.',                                    3, false),
    ('business-permit', 'follow-up',     'Follow-Up & Liaison',    'Track the application and respond to queries from the Ministry.',                4, false),
    ('business-permit', 'approved',      'Permit Issued',          'Permit collected and released to the client.',                                   5, true),
    ('business-permit', 'withdrawn',     'Withdrawn',              'Closed without an approval.',                                                    6, true),

    -- Expatriate Quota
    ('expatriate-quota', 'consultation',  'Consultation',          'Establish the quota positions required and the basis for them.',  1, false),
    ('expatriate-quota', 'documentation', 'Documentation',         'Prepare the quota application and supporting corporate records.', 2, false),
    ('expatriate-quota', 'submission',    'Submission',            'File the establishment, additional quota or renewal application.',3, false),
    ('expatriate-quota', 'follow-up',     'Follow-Up & Liaison',   'Track progress, attend immigration visits, manage the portal.',   4, false),
    ('expatriate-quota', 'approved',      'Approved',              'Quota granted; monthly returns obligation begins.',               5, true),
    ('expatriate-quota', 'withdrawn',     'Withdrawn',             'Closed without an approval.',                                     6, true),

    -- e-CERPAC
    ('e-cerpac', 'consultation',  'Assessment',          'Establish which route applies: new, regularisation, migration or renewal.', 1, false),
    ('e-cerpac', 'documentation', 'Documentation',       'Collect the expatriate''s documents and complete the application.',          2, false),
    ('e-cerpac', 'submission',    'Submission',          'File with the Nigeria Immigration Service.',                                 3, false),
    ('e-cerpac', 'biometrics',    'Biometric Capture',   'Expatriate attends for biometric capture.',                                  4, false),
    ('e-cerpac', 'follow-up',     'Follow-Up',           'Track the card through to issuance.',                                        5, false),
    ('e-cerpac', 'issued',        'Card Issued',         'Card collected and released; expiry obligation recorded.',                   6, true),
    ('e-cerpac', 'withdrawn',     'Withdrawn',           'Closed without an issuance.',                                                7, true),

    -- e-Visas
    ('e-visas', 'consultation',  'Category Assessment', 'Establish the correct visa category for the purpose and travel dates.', 1, false),
    ('e-visas', 'documentation', 'Documentation',       'Collect passport details, invitation letters and supporting documents.', 2, false),
    ('e-visas', 'submission',    'Application Filed',   'Application submitted on the relevant portal.',                          3, false),
    ('e-visas', 'follow-up',     'Follow-Up',           'Track the decision and respond to queries.',                             4, false),
    ('e-visas', 'issued',        'Visa Issued',         'Visa granted and released to the traveller.',                            5, true),
    ('e-visas', 'refused',       'Refused / Withdrawn', 'Closed without an issuance.',                                            6, true),

    -- Training
    ('training', 'enquiry',   'Enquiry',        'Initial discussion of the training need.',                   1, false),
    ('training', 'scoping',   'Scoping',        'Agree objectives, audience, format and dates.',              2, false),
    ('training', 'scheduled', 'Scheduled',      'Session confirmed and in the calendar.',                     3, false),
    ('training', 'delivered', 'Delivered',      'Session run; attendance recorded.',                          4, false),
    ('training', 'closed',    'Closed',         'Delivered and invoiced, or cancelled.',                      5, true)
)
insert into matter_type_stages (matter_type_id, slug, name, description, sort_order, is_terminal)
select mt.id, s.slug, s.name, s.description, s.sort_order, s.is_terminal
from stage_data s
join matter_types mt on mt.slug = s.type_slug;

-- -----------------------------------------------------------------------------
-- Fee item templates
-- -----------------------------------------------------------------------------
--
-- Amounts intentionally null — see the note at the top. Each line is added to
-- a new matter automatically so that an invoice cannot be raised having
-- silently forgotten the government charge.

with fee_data (type_slug, name, kind, sort_order) as (
  values
    ('business-permit',  'Professional fee',            'professional',  1),
    ('business-permit',  'Ministry of Interior charge', 'government',    2),
    ('business-permit',  'Disbursements',               'disbursement',  3),

    ('expatriate-quota', 'Professional fee',            'professional',  1),
    ('expatriate-quota', 'Ministry of Interior charge', 'government',    2),
    ('expatriate-quota', 'Disbursements',               'disbursement',  3),

    ('e-cerpac',         'Professional fee',            'professional',  1),
    ('e-cerpac',         'NIS charge',                  'government',    2),
    ('e-cerpac',         'Disbursements',               'disbursement',  3),

    ('e-visas',          'Professional fee',            'professional',  1),
    ('e-visas',          'Visa fee',                    'government',    2),
    ('e-visas',          'Disbursements',               'disbursement',  3),

    -- Training bills on a different basis: no government charge exists.
    ('training',         'Training fee',                'professional',  1),
    ('training',         'Materials and expenses',      'disbursement',  2)
)
insert into matter_type_fee_items (matter_type_id, name, kind, sort_order)
select mt.id, f.name, f.kind::fee_kind, f.sort_order
from fee_data f
join matter_types mt on mt.slug = f.type_slug;

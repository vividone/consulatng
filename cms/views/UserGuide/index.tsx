import type { AdminViewServerProps } from "payload";

import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import { getVisibleEntities } from "@payloadcms/ui/shared";
import React from "react";

import "./index.scss";

/**
 * Staff guide, served at /backoffice/user-guide.
 *
 * Lives inside the admin rather than as a separate document so it cannot
 * drift out of reach: the people who need it are already signed in here,
 * and a link in the sidebar beats a PDF in somebody's inbox.
 *
 * Rendered through DefaultTemplate so it keeps the normal sidebar and
 * header. A custom view gets no template by default — Payload only applies
 * one automatically when a view overrides a built-in route — so without
 * this wrapper the page would appear with no navigation and no way back.
 *
 * Access: Payload's admin root resolves the session before any view runs
 * and redirects an unauthenticated visitor to the login screen, so this is
 * already staff-only. The explicit check below is belt and braces, and also
 * covers a signed-in user whose account has had admin access withdrawn.
 */
export default function UserGuideView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { locale, permissions, req } = initPageResult;

  if (!req.user || !permissions?.canAccessAdmin) {
    return (
      <Gutter>
        <h1>Not available</h1>
        <p>You need to be signed in to the back office to read this guide.</p>
      </Gutter>
    );
  }

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={req.user}
      visibleEntities={getVisibleEntities({ req })}
    >
      <Gutter className="user-guide">
        <header className="user-guide__header">
          <h1>Editing the Consulat website</h1>
          <p className="user-guide__lede">
            How to change the words, pictures and services on the public site
            at consulatng.net — and the few things that still need a developer.
          </p>
        </header>

        <div className="user-guide__layout">
          <nav className="user-guide__toc" aria-label="Contents">
            <h2>Contents</h2>
            <ol>
              <li><a href="#layout">How it is organised</a></li>
              <li><a href="#live">Saving and going live</a></li>
              <li><a href="#details">Contact details</a></li>
              <li><a href="#pages">Page wording</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#blog">Blog posts</a></li>
              <li><a href="#lists">Team, FAQs &amp; logos</a></li>
              <li><a href="#images">Pictures</a></li>
              <li><a href="#who">Who can change what</a></li>
              <li><a href="#limits">What needs a developer</a></li>
              <li><a href="#trouble">If something looks wrong</a></li>
            </ol>
          </nav>

          <div className="user-guide__body">
            <section id="layout">
              <h2 className="user-guide__h">How it is organised</h2>
              <p>
                The menu on the left has four groups. Which one you need
                depends on what kind of thing you are changing.
              </p>
              <div className="user-guide__map">
                <div>
                  <h4>Pages</h4>
                  <p>The wording on one specific page.</p>
                  <ul>
                    <li>Home, About, Services, FAQ, Contact</li>
                  </ul>
                </div>
                <div>
                  <h4>Content</h4>
                  <p>Things there are many of, shown in lists.</p>
                  <ul>
                    <li>Posts, Services, FAQs</li>
                    <li>Team Members, Testimonials, Client Logos</li>
                    <li>Media — every uploaded picture</li>
                  </ul>
                </div>
                <div>
                  <h4>Settings</h4>
                  <p>Details used across the whole site.</p>
                  <ul>
                    <li>
                      Site Settings — phone, email, address, hours, social
                      links, booking link
                    </li>
                  </ul>
                </div>
                <div>
                  <h4>Access</h4>
                  <p>Who is allowed to sign in.</p>
                  <ul>
                    <li>Staff — administrators only</li>
                  </ul>
                </div>
              </div>
              <p>
                A useful rule: if it appears on <em>one</em> page, look in{" "}
                <strong>Pages</strong>. If it appears in a list, or on several
                pages, look in <strong>Content</strong> or{" "}
                <strong>Settings</strong>.
              </p>
            </section>

            <section id="live">
              <h2 className="user-guide__h">Saving and going live</h2>
              <div className="user-guide__note user-guide__note--warn">
                <span>Read this once, carefully</span>
                <p>
                  For everything <strong>except blog posts</strong>, pressing{" "}
                  <strong>Save</strong> puts the change on the public website
                  straight away. There is no approval step and no preview.
                  Within a few seconds the live page has changed.
                </p>
              </div>
              <p>
                Blog posts are the exception. They have a{" "}
                <strong>Draft</strong> state: you can work on one over several
                days and nothing appears publicly until you press{" "}
                <strong>Publish</strong>. Your typing is saved automatically as
                you go.
              </p>
              <p>
                So draft blog posts freely, but treat an edit to a page, a
                service or the contact details as something that happens
                immediately. If you want a second pair of eyes, get them before
                you press Save.
              </p>
            </section>

            <section id="details">
              <h2 className="user-guide__h">Contact details</h2>
              <p>
                Phone, email, WhatsApp number, office address, opening hours,
                social links and the booking link all live in{" "}
                <strong>Settings → Site Settings</strong>, split across tabs.
              </p>
              <p>
                Change it there and it updates <em>everywhere at once</em> — the
                footer on every page, the contact page, the WhatsApp button, and
                the business details search engines read. There is no second
                copy to forget about. The map on the contact page is generated
                from the same address, so correcting the address also moves the
                map.
              </p>
              <div className="user-guide__note">
                <span>Administrators only</span>
                <p>
                  Site Settings can only be changed by someone with the Admin
                  role.
                </p>
              </div>
            </section>

            <section id="pages">
              <h2 className="user-guide__h">Page wording</h2>
              <p>
                Each page under <strong>Pages</strong> is split into tabs that
                run in the same order as the bands you see scrolling down the
                real page.
              </p>
              <ol className="user-guide__steps">
                <li>
                  Open the live page in another browser tab and find the section
                  you want to change.
                </li>
                <li>
                  In the back office, open the matching page under{" "}
                  <strong>Pages</strong>.
                </li>
                <li>
                  Click through the tabs until the wording matches. Hero is the
                  banner at the top, then each section below it.
                </li>
                <li>
                  Edit the text and press <strong>Save</strong>.
                </li>
                <li>Reload the live page to check it.</li>
              </ol>
              <h3>The SEO tab</h3>
              <p>
                Every page has one. <strong>SEO Title</strong> is the line shown
                in a Google result and in the browser tab.{" "}
                <strong>SEO Description</strong> is the grey text underneath it
                — aim for about 150 characters, as Google cuts off much more.
              </p>
              <h3>Numbers on the home page</h3>
              <p>
                The three counters in the home page banner are under{" "}
                <strong>Home Page → Hero → Statistics</strong>. Please keep them
                accurate; they are a claim about the business.
              </p>
            </section>

            <section id="services">
              <h2 className="user-guide__h">Services</h2>
              <p>
                Each entry under <strong>Content → Services</strong> is one
                service and its whole page. Editing one changes the service
                page, the cards on the home and services pages, the header menu
                and the footer links, all together.
              </p>
              <h3>Adding a new service</h3>
              <ol className="user-guide__steps">
                <li>
                  Go to <strong>Content → Services</strong> and click{" "}
                  <strong>Create New</strong>.
                </li>
                <li>
                  Fill in the title, a short title for menus, and the web
                  address.
                </li>
                <li>
                  Set <strong>Order</strong> — lower numbers come first,
                  starting at 0.
                </li>
                <li>
                  Choose a <strong>Menu Icon</strong> and add a{" "}
                  <strong>Card Image</strong>.
                </li>
                <li>
                  Work through the tabs, then press <strong>Save</strong>.
                </li>
              </ol>
              <p>
                You do not need every tab. <strong>What We Cover</strong> and{" "}
                <strong>Highlights</strong> are alternatives — most services use
                the first, Training uses the second. Leave the other empty and
                that part of the page simply does not appear.
              </p>
              <div className="user-guide__note user-guide__note--warn">
                <span>Be careful with the web address</span>
                <p>
                  The <strong>Slug</strong> field is the page&rsquo;s address:{" "}
                  <code>business-permit</code> becomes{" "}
                  <code>/services/business-permit</code>. Changing it on an
                  existing service breaks every link that already exists — in
                  emails, documents and Google&rsquo;s results. Only change it
                  deliberately, and tell your developer so the old address can
                  be redirected.
                </p>
              </div>
            </section>

            <section id="blog">
              <h2 className="user-guide__h">Blog posts</h2>
              <ol className="user-guide__steps">
                <li>
                  Go to <strong>Content → Posts</strong> and click{" "}
                  <strong>Create New</strong>.
                </li>
                <li>
                  Add a title, then write the body in the main editing box. It
                  behaves like a word processor — headings, bold, lists, links.
                </li>
                <li>
                  Add an <strong>Excerpt</strong>: the summary shown on the blog
                  listing.
                </li>
                <li>
                  Add a <strong>Cover Image</strong>. Without one the post falls
                  back to a plain brand-coloured panel.
                </li>
                <li>
                  Fill in the SEO fields, then press <strong>Publish</strong>.
                </li>
              </ol>
              <p>
                Until you press Publish the post is a draft and is not on the
                public site. Drafts save themselves as you type, so you can
                close the tab and come back. To take a published post down,
                change its status back to draft and save.
              </p>
            </section>

            <section id="lists">
              <h2 className="user-guide__h">Team, FAQs, testimonials and logos</h2>
              <p>
                These all work the same way: a list you add to, edit and
                reorder.
              </p>
              <div className="user-guide__tablewrap">
                <table>
                  <thead>
                    <tr>
                      <th>What</th>
                      <th>Where it appears</th>
                      <th>Worth knowing</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Team Members</strong>
                      </td>
                      <td>About page</td>
                      <td>Photo, role and a short biography.</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>FAQs</strong>
                      </td>
                      <td>FAQ page</td>
                      <td>
                        Plain text answers only — these are also fed to Google
                        so they can appear directly in search results.
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Testimonials</strong>
                      </td>
                      <td>Home page</td>
                      <td>Quote, name, role, country and the country flag.</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Client Logos</strong>
                      </td>
                      <td>Home page, scrolling band</td>
                      <td>
                        Logos read best as transparent PNGs. The company name is
                        used as the description for screen readers.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Each has an <strong>Order</strong> field controlling the
                sequence. Lower numbers appear first. If two share a number the
                result is unpredictable, so give each a distinct one.
              </p>
            </section>

            <section id="images">
              <h2 className="user-guide__h">Pictures</h2>
              <p>
                Every picture lives in <strong>Content → Media</strong>, but you
                can upload directly from the field you are filling in.
              </p>
              <h3>Description text is required</h3>
              <p>
                Every upload asks for a short description of what the picture
                shows. This is not bureaucracy: it is what a blind
                visitor&rsquo;s screen reader says aloud, and what Google reads.
                Write what you would say describing the photo over the phone —
                &ldquo;Consulat team member at her desk&rdquo;, not
                &ldquo;image1&rdquo;.
              </p>
              <h3>Size and format</h3>
              <ul>
                <li>
                  Upload the largest clean version you have; smaller copies are
                  generated automatically for phones and tablets.
                </li>
                <li>
                  Photographs: JPEG. Logos and anything with a transparent
                  background: PNG.
                </li>
                <li>Avoid files over about 5&nbsp;MB.</li>
              </ul>
              <p>
                To replace a picture, upload the new one and select it in the
                field. Deleting the old one is optional — and if you do, first
                make sure nothing else is using it.
              </p>
            </section>

            <section id="who">
              <h2 className="user-guide__h">Who can change what</h2>
              <div className="user-guide__tablewrap">
                <table>
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Pages &amp; Content</th>
                      <th>Site Settings</th>
                      <th>Staff accounts</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Admin</strong>
                      </td>
                      <td>Yes</td>
                      <td>Yes</td>
                      <td>Yes</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Manager</strong>
                      </td>
                      <td>Yes</td>
                      <td>No</td>
                      <td>No</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Officer</strong>
                      </td>
                      <td>Yes</td>
                      <td>No</td>
                      <td>No</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Accounts</strong>
                      </td>
                      <td>Yes</td>
                      <td>No</td>
                      <td>No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Everyone who can sign in can edit pages and content. Only an{" "}
                <strong>Admin</strong> can change contact details or add and
                remove staff accounts. When somebody leaves, delete their
                account the same day.
              </p>
            </section>

            <section id="limits">
              <h2 className="user-guide__h">What needs a developer</h2>
              <p>
                Some things are deliberately not editable here, because a
                mistake would break the site rather than reword it.
              </p>
              <div className="user-guide__tablewrap">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Why</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>The main navigation menu</td>
                      <td>
                        Each entry points at a page that has to exist. A typo
                        makes a dead link in the header of every page.
                      </td>
                    </tr>
                    <tr>
                      <td>Company name, tagline and web address</td>
                      <td>
                        Used in the logo, in page addresses and in the business
                        listing search engines read.
                      </td>
                    </tr>
                    <tr>
                      <td>Privacy Policy and Terms</td>
                      <td>
                        These quote the registered company name and office
                        address automatically, so they stay correct when the
                        address changes. They are also awaiting review by
                        Consulat&rsquo;s lawyers.
                      </td>
                    </tr>
                    <tr>
                      <td>Page layout, colours and fonts</td>
                      <td>
                        The back office changes words and pictures; the shape of
                        the page is part of the design.
                      </td>
                    </tr>
                    <tr>
                      <td>The enquiry form fields</td>
                      <td>
                        The form is wired to the inbox that receives enquiries.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="trouble">
              <h2 className="user-guide__h">If something looks wrong</h2>
              <h3>My change has not appeared</h3>
              <ol className="user-guide__steps">
                <li>
                  Check you pressed <strong>Save</strong> — and, for a blog
                  post, <strong>Publish</strong>.
                </li>
                <li>
                  Reload the live page properly: <code>Ctrl</code>+
                  <code>Shift</code>+<code>R</code> on Windows,{" "}
                  <code>Cmd</code>+<code>Shift</code>+<code>R</code> on a Mac.
                  Your browser may be showing a stored copy.
                </li>
                <li>
                  Try the page on your phone. If it is correct there, it was
                  your browser&rsquo;s stored copy.
                </li>
                <li>
                  Still wrong after a minute or two? Report it — saving
                  repeatedly will not help.
                </li>
              </ol>
              <h3>It will not let me save</h3>
              <p>
                A required field somewhere is empty. The back office marks it in
                red — check every tab, not just the one you are looking at,
                because the problem is often on a tab you did not open.
              </p>
              <h3>I have deleted something by mistake</h3>
              <p>
                Blog posts keep their previous versions and can be recovered.
                Most other things cannot. Tell your developer straight away
                rather than trying to recreate it — the sooner it is reported,
                the easier it is to restore from a backup.
              </p>
              <div className="user-guide__note">
                <span>When reporting a problem</span>
                <p>
                  Say which page, what you expected, and what you actually saw.
                  A screenshot and the time it happened are usually enough to
                  find it immediately.
                </p>
              </div>
            </section>
          </div>
        </div>
      </Gutter>
    </DefaultTemplate>
  );
}

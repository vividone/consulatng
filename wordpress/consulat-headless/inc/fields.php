<?php
/**
 * Secure Custom Fields field groups, registered in code.
 *
 * Registering in PHP rather than clicking them together in the admin UI is
 * deliberate: the content model stays in version control, travels with the
 * repo, and can be code-reviewed. The client edits *content*, never schema.
 *
 * `'show_in_rest' => 1` on every group is what exposes the values under the
 * `acf` key of the REST response. Without it the frontend sees nothing —
 * this is the single most common headless-SCF misconfiguration.
 *
 * Field keys are stable identifiers. Renaming a `name` breaks the frontend
 * Zod schema in lib/wp.ts; renaming a `key` orphans existing saved content.
 * Change neither without updating both sides.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

add_action('acf/init', static function (): void {
    if (!function_exists('acf_add_local_field_group')) {
        return; // SCF inactive; the admin notice in the bootstrap covers this.
    }

    /* ---------------------------------------------------------------------
     * Testimonials
     * Mirrors the TESTIMONIALS const in components/home/Testimonials.tsx
     * ------------------------------------------------------------------ */
    acf_add_local_field_group([
        'key'          => 'group_consulat_testimonial',
        'title'        => 'Testimonial Details',
        'show_in_rest' => 1,
        'menu_order'   => 0,
        'position'     => 'normal',
        'location'     => [[[
            'param'    => 'post_type',
            'operator' => '==',
            'value'    => 'consulat_testimonial',
        ]]],
        'fields' => [
            [
                'key'          => 'field_testimonial_quote',
                'label'        => 'Quote',
                'name'         => 'quote',
                'type'         => 'textarea',
                'required'     => 1,
                'rows'         => 4,
                'instructions' => 'The testimonial itself. No surrounding quotation marks — the design adds them.',
            ],
            [
                'key'      => 'field_testimonial_name',
                'label'    => 'Person’s name',
                'name'     => 'person_name',
                'type'     => 'text',
                'required' => 1,
                'wrapper'  => ['width' => '50'],
            ],
            [
                'key'      => 'field_testimonial_role',
                'label'    => 'Role / job title',
                'name'     => 'role',
                'type'     => 'text',
                'required' => 1,
                'wrapper'  => ['width' => '50'],
            ],
            [
                'key'      => 'field_testimonial_country',
                'label'    => 'Country',
                'name'     => 'country',
                'type'     => 'text',
                'required' => 1,
                'wrapper'  => ['width' => '50'],
            ],
            [
                'key'          => 'field_testimonial_flag',
                'label'        => 'Flag emoji',
                'name'         => 'flag',
                'type'         => 'text',
                'required'     => 1,
                'wrapper'      => ['width' => '50'],
                'instructions' => 'A single flag emoji, e.g. 🇮🇳. Copy one from emojipedia.org if needed.',
            ],
        ],
    ]);

    /* ---------------------------------------------------------------------
     * Team members
     * Mirrors the TEAM const in app/about/page.tsx. Bio is a repeater rather
     * than a WYSIWYG so the frontend keeps receiving string[] and renders
     * each paragraph itself — matching the existing TeamMember type.
     * ------------------------------------------------------------------ */
    acf_add_local_field_group([
        'key'          => 'group_consulat_team',
        'title'        => 'Team Member Details',
        'show_in_rest' => 1,
        'location'     => [[[
            'param'    => 'post_type',
            'operator' => '==',
            'value'    => 'consulat_team',
        ]]],
        'fields' => [
            [
                'key'          => 'field_team_role',
                'label'        => 'Role',
                'name'         => 'role',
                'type'         => 'text',
                'required'     => 1,
                'instructions' => 'e.g. "Director, Business Development"',
            ],
            [
                'key'          => 'field_team_bio',
                'label'        => 'Biography',
                'name'         => 'bio',
                'type'         => 'repeater',
                'layout'       => 'block',
                'button_label' => 'Add paragraph',
                'instructions' => 'One row per paragraph. Shown in the profile modal.',
                'sub_fields'   => [[
                    'key'   => 'field_team_bio_text',
                    'label' => 'Paragraph',
                    'name'  => 'text',
                    'type'  => 'textarea',
                    'rows'  => 4,
                ]],
            ],
        ],
    ]);

    /* ---------------------------------------------------------------------
     * Page copy
     *
     * Location is `post_type == page` with a "Page type" selector driving
     * conditional visibility. This avoids hardcoding page IDs (unknowable at
     * code time) while keeping each page's form free of irrelevant fields.
     * ------------------------------------------------------------------ */
    acf_add_local_field_group([
        'key'          => 'group_consulat_page',
        'title'        => 'Page Content',
        'show_in_rest' => 1,
        'location'     => [[[
            'param'    => 'post_type',
            'operator' => '==',
            'value'    => 'page',
        ]]],
        'fields' => [
            [
                'key'          => 'field_page_kind',
                'label'        => 'Page type',
                'name'         => 'page_kind',
                'type'         => 'select',
                'required'     => 1,
                'default_value' => 'generic',
                'choices'      => [
                    'service' => 'Service page',
                    'generic' => 'Generic page',
                ],
                'instructions' => 'Controls which fields appear below. Set this first. Must match the page slug used by the website — ask your developer before changing it.',
            ],

            // ---- Service page fields -------------------------------------
            [
                'key'               => 'field_page_hero_subtitle',
                'label'             => 'Hero subtitle',
                'name'              => 'hero_subtitle',
                'type'              => 'textarea',
                'rows'              => 3,
                'conditional_logic' => [[[
                    'field' => 'field_page_kind', 'operator' => '==', 'value' => 'service',
                ]]],
            ],
            [
                'key'               => 'field_page_intro',
                'label'             => 'Introduction paragraphs',
                'name'              => 'intro_paragraphs',
                'type'              => 'repeater',
                'layout'            => 'block',
                'button_label'      => 'Add paragraph',
                'conditional_logic' => [[[
                    'field' => 'field_page_kind', 'operator' => '==', 'value' => 'service',
                ]]],
                'sub_fields' => [[
                    'key'   => 'field_page_intro_text',
                    'label' => 'Paragraph',
                    'name'  => 'text',
                    'type'  => 'textarea',
                    'rows'  => 5,
                ]],
            ],
            [
                'key'               => 'field_page_handle',
                'label'             => 'What we handle',
                'name'              => 'what_we_handle',
                'type'              => 'repeater',
                'layout'            => 'row',
                'button_label'      => 'Add item',
                'instructions'      => 'Shown as the numbered service breakdown.',
                'conditional_logic' => [[[
                    'field' => 'field_page_kind', 'operator' => '==', 'value' => 'service',
                ]]],
                'sub_fields' => [
                    [
                        'key'      => 'field_page_handle_title',
                        'label'    => 'Title',
                        'name'     => 'title',
                        'type'     => 'text',
                        'required' => 1,
                    ],
                    [
                        'key'      => 'field_page_handle_desc',
                        'label'    => 'Description',
                        'name'     => 'description',
                        'type'     => 'textarea',
                        'rows'     => 3,
                        'required' => 1,
                    ],
                ],
            ],
            [
                'key'               => 'field_page_elig_intro',
                'label'             => 'Eligibility — intro line',
                'name'              => 'eligibility_intro',
                'type'              => 'textarea',
                'rows'              => 2,
                'conditional_logic' => [[[
                    'field' => 'field_page_kind', 'operator' => '==', 'value' => 'service',
                ]]],
            ],
            [
                'key'               => 'field_page_elig',
                'label'             => 'Eligibility — checklist',
                'name'              => 'eligibility',
                'type'              => 'repeater',
                'layout'            => 'table',
                'button_label'      => 'Add criterion',
                'conditional_logic' => [[[
                    'field' => 'field_page_kind', 'operator' => '==', 'value' => 'service',
                ]]],
                'sub_fields' => [[
                    'key'   => 'field_page_elig_item',
                    'label' => 'Criterion',
                    'name'  => 'item',
                    'type'  => 'text',
                ]],
            ],
            [
                'key'               => 'field_page_elig_outro',
                'label'             => 'Eligibility — closing line',
                'name'              => 'eligibility_outro',
                'type'              => 'textarea',
                'rows'              => 2,
                'conditional_logic' => [[[
                    'field' => 'field_page_kind', 'operator' => '==', 'value' => 'service',
                ]]],
            ],
            [
                'key'               => 'field_page_cta_heading',
                'label'             => 'Closing CTA — heading',
                'name'              => 'cta_heading',
                'type'              => 'text',
                'conditional_logic' => [[[
                    'field' => 'field_page_kind', 'operator' => '==', 'value' => 'service',
                ]]],
            ],
            [
                'key'               => 'field_page_cta_body',
                'label'             => 'Closing CTA — body',
                'name'              => 'cta_body',
                'type'              => 'textarea',
                'rows'              => 2,
                'conditional_logic' => [[[
                    'field' => 'field_page_kind', 'operator' => '==', 'value' => 'service',
                ]]],
            ],
            [
                'key'               => 'field_page_banner',
                'label'             => 'Banner image',
                'name'              => 'banner_image',
                'type'              => 'image',
                'return_format'     => 'array',
                'preview_size'      => 'medium',
                'instructions'      => 'Wide image below the page header. Aim for 1600×900 or wider.',
                'conditional_logic' => [[[
                    'field' => 'field_page_kind', 'operator' => '==', 'value' => 'service',
                ]]],
            ],
            [
                'key'               => 'field_page_cover',
                'label'             => 'Section cover image',
                'name'              => 'cover_image',
                'type'              => 'image',
                'return_format'     => 'array',
                'preview_size'      => 'medium',
                'conditional_logic' => [[[
                    'field' => 'field_page_kind', 'operator' => '==', 'value' => 'service',
                ]]],
            ],
            [
                'key'               => 'field_page_schema_desc',
                'label'             => 'Search engine service description',
                'name'              => 'schema_description',
                'type'              => 'textarea',
                'rows'              => 3,
                'instructions'      => 'Used only in structured data for Google. Plain prose, one or two sentences. Not shown on the page.',
                'conditional_logic' => [[[
                    'field' => 'field_page_kind', 'operator' => '==', 'value' => 'service',
                ]]],
            ],
        ],
    ]);

    /* ---------------------------------------------------------------------
     * Site Settings — replaces the SITE const in lib/constants.ts
     *
     * NAV_LINKS and the SERVICES slug list stay in code on purpose: those
     * slugs map to real filesystem routes under app/, so an editor renaming
     * one would 404 the route. Code owns routing; the CMS owns copy.
     * ------------------------------------------------------------------ */
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page([
            'page_title'  => 'Site Settings',
            'menu_title'  => 'Site Settings',
            'menu_slug'   => 'consulat-site-settings',
            'capability'  => 'manage_options',
            'icon_url'    => 'dashicons-admin-settings',
            'position'    => 3,
            'redirect'    => false,
            'update_button' => 'Save settings',
        ]);
    }

    acf_add_local_field_group([
        'key'          => 'group_consulat_settings',
        'title'        => 'Site Settings',
        'show_in_rest' => 1,
        'location'     => [[[
            'param'    => 'options_page',
            'operator' => '==',
            'value'    => 'consulat-site-settings',
        ]]],
        'fields' => [
            ['key' => 'field_set_tab_general', 'label' => 'General', 'type' => 'tab'],
            [
                'key'     => 'field_set_tagline',
                'label'   => 'Tagline',
                'name'    => 'tagline',
                'type'    => 'text',
                'wrapper' => ['width' => '50'],
            ],
            [
                'key'          => 'field_set_description',
                'label'        => 'Site description',
                'name'         => 'description',
                'type'         => 'textarea',
                'rows'         => 3,
                'instructions' => 'Default meta description, used where a page has none of its own.',
            ],

            ['key' => 'field_set_tab_contact', 'label' => 'Contact', 'type' => 'tab'],
            [
                'key'     => 'field_set_email',
                'label'   => 'Email address',
                'name'    => 'email',
                'type'    => 'email',
                'wrapper' => ['width' => '50'],
            ],
            [
                'key'          => 'field_set_phone',
                'label'        => 'Primary phone',
                'name'         => 'phone',
                'type'         => 'text',
                'wrapper'      => ['width' => '50'],
                'instructions' => 'Full international format, e.g. +2348141657981',
            ],
            [
                'key'     => 'field_set_phone2',
                'label'   => 'Secondary phone',
                'name'    => 'phone2',
                'type'    => 'text',
                'wrapper' => ['width' => '50'],
            ],
            [
                'key'     => 'field_set_altphone',
                'label'   => 'Landline',
                'name'    => 'altphone',
                'type'    => 'text',
                'wrapper' => ['width' => '50'],
            ],
            [
                'key'          => 'field_set_whatsapp',
                'label'        => 'WhatsApp number',
                'name'         => 'whatsapp',
                'type'         => 'text',
                'wrapper'      => ['width' => '50'],
                'instructions' => 'Digits only, no + or spaces, e.g. 2348141657981',
            ],
            [
                'key'          => 'field_set_whatsapp_msg',
                'label'        => 'WhatsApp prefilled message',
                'name'         => 'whatsapp_message',
                'type'         => 'text',
                'instructions' => 'Pre-populated into the visitor’s WhatsApp when they tap the widget.',
            ],
            [
                'key'          => 'field_set_hours',
                'label'        => 'Opening hours',
                'name'         => 'hours',
                'type'         => 'text',
                'instructions' => 'Display text, e.g. "Monday – Friday: 8:00 AM – 5:00 PM (WAT)"',
            ],

            ['key' => 'field_set_tab_address', 'label' => 'Address', 'type' => 'tab'],
            [
                'key'        => 'field_set_address',
                'label'      => 'Address',
                'name'       => 'address',
                'type'       => 'group',
                'sub_fields' => [
                    ['key' => 'field_set_addr_street',  'label' => 'Street address', 'name' => 'street_address',   'type' => 'text'],
                    ['key' => 'field_set_addr_city',    'label' => 'City / area',    'name' => 'address_locality', 'type' => 'text', 'wrapper' => ['width' => '33']],
                    ['key' => 'field_set_addr_region',  'label' => 'State',          'name' => 'address_region',   'type' => 'text', 'wrapper' => ['width' => '33']],
                    ['key' => 'field_set_addr_country', 'label' => 'Country code',   'name' => 'address_country',  'type' => 'text', 'wrapper' => ['width' => '33'], 'instructions' => 'Two letters, e.g. NG'],
                ],
            ],

            ['key' => 'field_set_tab_links', 'label' => 'Links', 'type' => 'tab'],
            [
                'key'          => 'field_set_calendar',
                'label'        => 'Booking calendar URL',
                'name'         => 'calendar_url',
                'type'         => 'url',
                'instructions' => 'Every "Book a Free Consultation" button sitewide opens this.',
            ],
            [
                'key'        => 'field_set_social',
                'label'      => 'Social profiles',
                'name'       => 'social',
                'type'       => 'group',
                'sub_fields' => [
                    ['key' => 'field_set_soc_li', 'label' => 'LinkedIn',  'name' => 'linkedin',  'type' => 'url'],
                    ['key' => 'field_set_soc_tw', 'label' => 'X/Twitter', 'name' => 'twitter',   'type' => 'url'],
                    ['key' => 'field_set_soc_ig', 'label' => 'Instagram', 'name' => 'instagram', 'type' => 'url'],
                ],
            ],
        ],
    ]);
});

/**
 * Expose the Site Settings options page over REST.
 *
 * SCF exposes field groups attached to *posts* automatically via the `acf`
 * key, but options pages have no post to hang off. This adds a tiny read-only
 * endpoint at /wp-json/consulat/v1/settings.
 */
add_action('rest_api_init', static function (): void {
    register_rest_route('consulat/v1', '/settings', [
        'methods'             => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true', // Read-only public content.
        'callback'            => static function () {
            if (!function_exists('get_fields')) {
                return new WP_Error('scf_inactive', 'Secure Custom Fields is not active.', ['status' => 503]);
            }

            $fields = get_fields('option');

            return rest_ensure_response([
                'site_name'  => get_bloginfo('name'),
                'updated_at' => get_option('consulat_settings_updated_at', ''),
                'fields'     => $fields ?: [],
            ]);
        },
    ]);
});

/**
 * Stamp a timestamp whenever the options page is saved, so the frontend can
 * use it as a real `lastModified` value in sitemap.ts rather than build time.
 */
add_action('acf/save_post', static function ($post_id): void {
    if ($post_id === 'options') {
        update_option('consulat_settings_updated_at', current_time('c'));
    }
}, 20);

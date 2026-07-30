<?php
/**
 * Custom post types for content that is a *collection* of like items.
 *
 * Modelling rule of thumb (CMS_PLAYBOOK.md §4.4): an array of objects in the
 * frontend becomes a CPT; a one-off page's copy becomes fields on a Page;
 * site-wide values become the Site Settings options page.
 *
 * Every type below sets:
 *   'show_in_rest'  => true   — required, or the frontend cannot read it
 *   'rest_base'     => explicit, so the REST path never shifts if the
 *                      post type key is ever renamed
 *   'public'        => false  — these are never browsed on the WP domain;
 *                      the Next.js site owns all public URLs
 *   'show_ui'       => true   — but still editable in wp-admin
 *
 * Blog posts are deliberately absent: WP core's `post` type already provides
 * title, excerpt, date, author, featured image and body, which is a 1:1 match
 * for the MDX frontmatter this site used previously. No custom fields needed.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', static function (): void {
    /**
     * FAQ — replaces lib/faqs.ts
     * Question is the post title; answer is the editor body.
     */
    register_post_type('consulat_faq', [
        'labels' => [
            'name'          => 'FAQs',
            'singular_name' => 'FAQ',
            'add_new_item'  => 'Add New FAQ',
            'edit_item'     => 'Edit FAQ',
            'menu_name'     => 'FAQs',
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_menu'  => true,
        'show_in_rest'  => true,
        'rest_base'     => 'faqs',
        'menu_icon'     => 'dashicons-editor-help',
        'supports'      => ['title', 'editor', 'page-attributes'],
        'hierarchical'  => false,
        'has_archive'   => false,
    ]);

    /**
     * Testimonial — replaces the TESTIMONIALS const in
     * components/home/Testimonials.tsx
     *
     * Title is used only as an admin label (the client's name); the quote and
     * attribution live in SCF fields so the frontend gets structured data
     * rather than parsed HTML.
     */
    register_post_type('consulat_testimonial', [
        'labels' => [
            'name'          => 'Testimonials',
            'singular_name' => 'Testimonial',
            'add_new_item'  => 'Add New Testimonial',
            'edit_item'     => 'Edit Testimonial',
            'menu_name'     => 'Testimonials',
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_menu'  => true,
        'show_in_rest'  => true,
        'rest_base'     => 'testimonials',
        'menu_icon'     => 'dashicons-format-quote',
        'supports'      => ['title', 'page-attributes'],
        'hierarchical'  => false,
        'has_archive'   => false,
    ]);

    /**
     * Team member — replaces the TEAM const in app/about/page.tsx
     *
     * `page-attributes` is enabled on purpose: it exposes the Order field so
     * the client can control display sequence without touching code. The
     * frontend sorts by `menu_order`.
     */
    register_post_type('consulat_team', [
        'labels' => [
            'name'          => 'Team',
            'singular_name' => 'Team Member',
            'add_new_item'  => 'Add New Team Member',
            'edit_item'     => 'Edit Team Member',
            'menu_name'     => 'Team',
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_menu'  => true,
        'show_in_rest'  => true,
        'rest_base'     => 'team',
        'menu_icon'     => 'dashicons-groups',
        'supports'      => ['title', 'thumbnail', 'page-attributes'],
        'hierarchical'  => false,
        'has_archive'   => false,
    ]);

    /**
     * Client logo — replaces the CLIENTS const in components/home/TrustBar.tsx
     *
     * The logo is the featured image. The frontend reads intrinsic width and
     * height from the REST media payload, so the client never has to supply
     * dimensions (which the hardcoded version required).
     */
    register_post_type('consulat_client', [
        'labels' => [
            'name'          => 'Client Logos',
            'singular_name' => 'Client Logo',
            'add_new_item'  => 'Add New Client Logo',
            'edit_item'     => 'Edit Client Logo',
            'menu_name'     => 'Client Logos',
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_menu'  => true,
        'show_in_rest'  => true,
        'rest_base'     => 'clients',
        'menu_icon'     => 'dashicons-awards',
        'supports'      => ['title', 'thumbnail', 'page-attributes'],
        'hierarchical'  => false,
        'has_archive'   => false,
    ]);
});

/**
 * Order CPT archives by the admin-controlled Order field, then title.
 *
 * Without this, `orderby=menu_order` has to be passed on every REST request
 * and any omission silently falls back to date order — which looks like a
 * random shuffle to the client.
 */
add_action('pre_get_posts', static function (WP_Query $query): void {
    $ordered = ['consulat_team', 'consulat_client', 'consulat_testimonial', 'consulat_faq'];

    if (!is_admin() && in_array($query->get('post_type'), $ordered, true) && !$query->get('orderby')) {
        $query->set('orderby', ['menu_order' => 'ASC', 'title' => 'ASC']);
    }
});

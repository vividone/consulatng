<?php
/**
 * On-save revalidation webhook.
 *
 * The Next.js frontend is statically generated. Without this, publishing in
 * WordPress changes nothing on the live site until the next deploy — and
 * Google goes on indexing the old copy. This is an SEO requirement, not a
 * convenience (CMS_PLAYBOOK.md §7.5).
 *
 * Both `save_post` and `acf/save_post` are hooked on purpose: editing only
 * custom field values does not always fire `save_post` with the changes
 * committed, so a field-only edit would otherwise never revalidate.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Map a WordPress post type to the Next.js cache tags it should invalidate.
 *
 * Tags must match those passed to `fetch(..., { next: { tags } })` in
 * lib/wp.ts. Keep the two in sync.
 */
function consulat_revalidate_tags_for(string $post_type, string $slug): array
{
    switch ($post_type) {
        case 'post':
            // The single post, plus the index and sitemap that list it.
            return ['posts', 'post:' . $slug];
        case 'page':
            return ['pages', 'page:' . $slug];
        case 'consulat_faq':
            return ['faqs'];
        case 'consulat_testimonial':
            return ['testimonials'];
        case 'consulat_team':
            return ['team'];
        case 'consulat_client':
            return ['clients'];
        default:
            return [];
    }
}

/**
 * POST the tag list to the frontend. Non-blocking so the editor never waits
 * on the network — a slow or unreachable frontend must not make the admin
 * feel broken.
 */
function consulat_send_revalidation(array $tags): void
{
    if ($tags === []) {
        return;
    }

    if (!defined('CONSULAT_REVALIDATE_URL') || !defined('CONSULAT_REVALIDATE_SECRET')) {
        error_log('[consulat-headless] Revalidation skipped: CONSULAT_REVALIDATE_URL / _SECRET not defined in wp-config.php.');
        return;
    }

    $response = wp_remote_post(CONSULAT_REVALIDATE_URL, [
        'timeout'  => 5,
        'blocking' => false,
        'headers'  => [
            'Content-Type'  => 'application/json',
            'X-Consulat-Secret' => CONSULAT_REVALIDATE_SECRET,
        ],
        'body' => wp_json_encode(['tags' => array_values(array_unique($tags))]),
    ]);

    if (is_wp_error($response)) {
        error_log('[consulat-headless] Revalidation request failed: ' . $response->get_error_message());
    }
}

/**
 * Fire for ordinary post/page saves.
 *
 * Guards, in order: skip revisions and autosaves, skip auto-drafts, and skip
 * post types we do not publish. A draft save still revalidates — that is
 * intentional, because unpublishing must also purge the live page.
 */
add_action('save_post', static function ($post_id, $post, $update): void {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }
    if (!$post instanceof WP_Post || $post->post_status === 'auto-draft') {
        return;
    }

    $tags = consulat_revalidate_tags_for($post->post_type, (string) $post->post_name);
    consulat_send_revalidation($tags);
}, 20, 3);

/**
 * Fire for custom-field-only saves, including the Site Settings options page.
 * Priority 20 so SCF has finished writing values before we notify.
 */
add_action('acf/save_post', static function ($post_id): void {
    if ($post_id === 'options') {
        // Settings touch the header, footer and every page's contact details.
        consulat_send_revalidation(['settings', 'pages', 'posts']);
        return;
    }

    if (!is_numeric($post_id)) {
        return;
    }

    $post = get_post((int) $post_id);
    if (!$post instanceof WP_Post) {
        return;
    }

    consulat_send_revalidation(
        consulat_revalidate_tags_for($post->post_type, (string) $post->post_name)
    );
}, 20);

/**
 * Deleting content must purge it too, or the live site keeps serving a page
 * that no longer exists in the CMS.
 */
add_action('before_delete_post', static function ($post_id, $post): void {
    if (!$post instanceof WP_Post) {
        return;
    }
    consulat_send_revalidation(
        consulat_revalidate_tags_for($post->post_type, (string) $post->post_name)
    );
}, 20, 2);

/* -------------------------------------------------------------------------
 * Manual purge, for when a cache looks stale and nobody wants to guess.
 * ---------------------------------------------------------------------- */

add_action('admin_bar_menu', static function (WP_Admin_Bar $bar): void {
    if (!current_user_can('edit_posts')) {
        return;
    }

    $bar->add_node([
        'id'    => 'consulat-purge',
        'title' => 'Refresh website',
        'href'  => wp_nonce_url(admin_url('admin-post.php?action=consulat_purge'), 'consulat_purge'),
        'meta'  => ['title' => 'Rebuild every cached page on the public website'],
    ]);
}, 100);

add_action('admin_post_consulat_purge', static function (): void {
    if (!current_user_can('edit_posts') || !check_admin_referer('consulat_purge')) {
        wp_die('Not allowed.', 403);
    }

    consulat_send_revalidation(['settings', 'pages', 'posts', 'faqs', 'testimonials', 'team', 'clients']);

    wp_safe_redirect(add_query_arg('consulat_purged', '1', wp_get_referer() ?: admin_url()));
    exit;
});

add_action('admin_notices', static function (): void {
    if (isset($_GET['consulat_purged'])) {
        echo '<div class="notice notice-success is-dismissible"><p>Website refresh requested. Public pages update within a few seconds.</p></div>';
    }
});

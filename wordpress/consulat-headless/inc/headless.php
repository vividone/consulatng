<?php
/**
 * Headless-mode behaviour and hardening.
 *
 * This install is an admin panel, not a website. Everything here either stops
 * WordPress behaving like a public site, or reduces the attack surface of a
 * WordPress on shared hosting.
 *
 * Note what is deliberately NOT here: the WAF rules, rate limiting on
 * /wp-login.php, and the Zero Trust gate in front of /wp-admin all live in
 * Cloudflare, not PHP. See CMS_PLAYBOOK.md §8 — code cannot defend the login
 * page as well as an edge network can.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

/* -------------------------------------------------------------------------
 * 1. Keep this install out of Google.
 *
 * The single most consequential line in this file. Without it the CMS domain
 * gets indexed and competes with the real site as duplicate content — the
 * client's own pages outranking each other.
 * ---------------------------------------------------------------------- */

add_action('send_headers', static function (): void {
    header('X-Robots-Tag: noindex, nofollow, noarchive', true);
});

add_filter('pre_option_blog_public', static fn() => '0');

/* -------------------------------------------------------------------------
 * 2. Send public visitors away.
 *
 * Nobody should browse cms.consulatng.net. Anyone who lands there — usually a
 * stale link or a bot — goes to the real site. Logged-in editors, REST
 * requests, cron, and the admin are all untouched.
 * ---------------------------------------------------------------------- */

add_action('template_redirect', static function (): void {
    if (is_user_logged_in() || is_admin()) {
        return;
    }
    if (defined('REST_REQUEST') && REST_REQUEST) {
        return;
    }
    if (wp_doing_cron() || wp_doing_ajax()) {
        return;
    }

    $frontend = defined('CONSULAT_FRONTEND_URL') ? CONSULAT_FRONTEND_URL : 'https://consulatng.net';
    wp_safe_redirect($frontend, 302);
    exit;
}, 0);

/* -------------------------------------------------------------------------
 * 3. Reduce attack surface.
 * ---------------------------------------------------------------------- */

// XML-RPC: a brute-force and pingback-amplification vector with no use here.
add_filter('xmlrpc_enabled', '__return_false');
add_filter('wp_headers', static function (array $headers): array {
    unset($headers['X-Pingback']);
    return $headers;
});

// Stop leaking the exact WordPress version to vulnerability scanners.
remove_action('wp_head', 'wp_generator');
add_filter('the_generator', static fn() => '');

// Disable the REST user endpoint — it enumerates valid usernames for anyone.
add_filter('rest_endpoints', static function (array $endpoints): array {
    unset($endpoints['/wp/v2/users'], $endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    return $endpoints;
});

// Generic login error text, so a wrong password can't confirm a valid username.
add_filter('login_errors', static fn() => 'Those credentials are not valid.');

// No file editing from the dashboard, even if wp-config.php forgot to say so.
if (!defined('DISALLOW_FILE_EDIT')) {
    define('DISALLOW_FILE_EDIT', true);
}

/* -------------------------------------------------------------------------
 * 4. Tidy the admin for non-technical editors.
 *
 * A headless install shows a lot of UI that does nothing: themes, widgets,
 * menus, comments. Removing it prevents "I changed the theme and the site
 * looks the same" support conversations.
 * ---------------------------------------------------------------------- */

add_action('admin_menu', static function (): void {
    remove_menu_page('themes.php');        // Appearance
    remove_menu_page('edit-comments.php'); // Comments
    remove_submenu_page('options-general.php', 'options-discussion.php');
    remove_submenu_page('options-general.php', 'options-reading.php');
}, 999);

// Comments are meaningless on a headless brochure site — close them off.
add_filter('comments_open', '__return_false', 20);
add_filter('pings_open', '__return_false', 20);
add_action('init', static function (): void {
    foreach (['post', 'page'] as $type) {
        remove_post_type_support($type, 'comments');
        remove_post_type_support($type, 'trackbacks');
    }
});

// Point "View" and "Preview" at the Next.js site instead of a dead WP URL.
add_filter('preview_post_link', static function (string $link, WP_Post $post): string {
    $frontend = defined('CONSULAT_FRONTEND_URL') ? CONSULAT_FRONTEND_URL : 'https://consulatng.net';
    $secret   = defined('CONSULAT_PREVIEW_SECRET') ? CONSULAT_PREVIEW_SECRET : '';

    if ($secret === '') {
        return $link;
    }

    return add_query_arg([
        'secret' => $secret,
        'type'   => $post->post_type,
        'slug'   => $post->post_name,
    ], trailingslashit($frontend) . 'api/preview');
}, 10, 2);

add_filter('post_type_link', 'consulat_frontend_permalink', 10, 2);
add_filter('post_link', 'consulat_frontend_permalink', 10, 2);
add_filter('page_link', static fn($link, $post_id) => consulat_frontend_permalink($link, get_post($post_id)), 10, 2);

/**
 * Rewrite WordPress permalinks to their Next.js equivalents so the admin's
 * "View post" links land somewhere real.
 */
function consulat_frontend_permalink($link, $post)
{
    if (!$post instanceof WP_Post) {
        return $link;
    }

    $frontend = defined('CONSULAT_FRONTEND_URL') ? CONSULAT_FRONTEND_URL : 'https://consulatng.net';

    switch ($post->post_type) {
        case 'post':
            return trailingslashit($frontend) . 'blog/' . $post->post_name;
        case 'page':
            return trailingslashit($frontend) . $post->post_name;
        default:
            return $link;
    }
}

/* -------------------------------------------------------------------------
 * 5. Editor guidance on the dashboard.
 *
 * Replaces the default WordPress news widgets with a short orientation panel.
 * Cheaper than answering the same questions by email.
 * ---------------------------------------------------------------------- */

add_action('wp_dashboard_setup', static function (): void {
    remove_meta_box('dashboard_primary', 'dashboard', 'side');
    remove_meta_box('dashboard_quick_press', 'dashboard', 'side');
    remove_meta_box('dashboard_activity', 'dashboard', 'normal');

    wp_add_dashboard_widget('consulat_help', 'Editing the Consulat website', static function (): void {
        $frontend = defined('CONSULAT_FRONTEND_URL') ? CONSULAT_FRONTEND_URL : 'https://consulatng.net';
        ?>
        <p>Changes you publish here appear on
           <a href="<?php echo esc_url($frontend); ?>" target="_blank" rel="noopener"><?php echo esc_html($frontend); ?></a>
           within a few seconds.</p>
        <ul style="list-style:disc;margin-left:20px">
            <li><strong>Posts</strong> — blog articles.</li>
            <li><strong>Pages</strong> — the wording on the service pages.</li>
            <li><strong>FAQs, Testimonials, Team, Client Logos</strong> — list content. Use the
                <em>Order</em> field to control the sequence.</li>
            <li><strong>Site Settings</strong> — phone numbers, address, email, social links.</li>
        </ul>
        <p>If a change doesn’t show up, use <strong>Refresh website</strong> in the top toolbar.</p>
        <p style="color:#666">Page and post <em>addresses</em> (slugs) are wired to the website’s
           code — changing one will break that page. Ask your developer first.</p>
        <?php
    });
});

<?php
/**
 * Plugin Name:  Consulat Headless
 * Description:  Content model + REST exposure + hardening for the headless
 *               Next.js frontend at consulatng.net. Registers custom post
 *               types, Secure Custom Fields field groups, a Site Settings
 *               options page, and on-save revalidation webhooks.
 * Version:      1.0.0
 * Author:        Consulat
 * Requires PHP: 7.4
 *
 * ---------------------------------------------------------------------------
 * INSTALLATION
 * ---------------------------------------------------------------------------
 * 1. Install and activate "Secure Custom Fields" (SCF) from Plugins → Add New.
 *    SCF is the WordPress.org fork of ACF and includes the Repeater,
 *    Flexible Content, Options Page and Gallery fields for free. Do NOT
 *    install ACF as well — SCF deactivates it.
 *
 * 2. Install and activate "Yoast SEO" (free tier is sufficient). It adds
 *    `yoast_head_json` to REST responses automatically; no bridge plugin.
 *
 * 3. Upload this entire `consulat-headless` folder to
 *    `wp-content/plugins/` and activate "Consulat Headless".
 *
 * 4. Add to `wp-config.php`, above the "That's all, stop editing" line:
 *
 *      define('CONSULAT_REVALIDATE_URL',    'https://consulatng.net/api/revalidate');
 *      define('CONSULAT_REVALIDATE_SECRET', '<same value as REVALIDATE_SECRET on Vercel>');
 *      define('DISALLOW_FILE_EDIT', true);
 *
 * 5. Settings → Permalinks → Save (flushes rewrite rules for the new CPTs).
 *
 * See CMS_PLAYBOOK.md §4 and §8 in the frontend repo for the full runbook,
 * including the Cloudflare WAF and Access rules that belong in front of
 * /wp-admin.
 * ---------------------------------------------------------------------------
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit; // No direct access.
}

define('CONSULAT_HEADLESS_VERSION', '1.0.0');
define('CONSULAT_HEADLESS_DIR', plugin_dir_path(__FILE__));

require_once CONSULAT_HEADLESS_DIR . 'inc/post-types.php';
require_once CONSULAT_HEADLESS_DIR . 'inc/fields.php';
require_once CONSULAT_HEADLESS_DIR . 'inc/revalidate.php';
require_once CONSULAT_HEADLESS_DIR . 'inc/headless.php';

/**
 * Surface a dashboard notice if a hard dependency or constant is missing.
 * Cheap insurance against a silent half-configured install — the most common
 * way a headless WP handoff goes wrong.
 */
add_action('admin_notices', static function (): void {
    if (!current_user_can('manage_options')) {
        return;
    }

    $problems = [];

    if (!function_exists('acf_add_local_field_group')) {
        $problems[] = 'Secure Custom Fields is not active — no custom fields will appear or be exposed to the REST API.';
    }
    if (!defined('CONSULAT_REVALIDATE_URL') || !defined('CONSULAT_REVALIDATE_SECRET')) {
        $problems[] = 'CONSULAT_REVALIDATE_URL / CONSULAT_REVALIDATE_SECRET are not defined in wp-config.php — publishing will not update the live site.';
    }

    if ($problems === []) {
        return;
    }

    echo '<div class="notice notice-error"><p><strong>Consulat Headless:</strong></p><ul style="list-style:disc;margin-left:20px">';
    foreach ($problems as $problem) {
        echo '<li>' . esc_html($problem) . '</li>';
    }
    echo '</ul></div>';
});

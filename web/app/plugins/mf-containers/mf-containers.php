<?php
/**
 * Plugin Name:       MF Containers
 * Description:       Example block written with ESNext standard and JSX support – build step required.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mf-containers
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function mf_containers_block_init() {
	register_block_type( __DIR__ . '/build/section' );

	register_block_type( __DIR__ . '/build/row' );

	register_block_type( __DIR__ . '/build/column' );
}
add_action( 'init', 'mf_containers_block_init' );


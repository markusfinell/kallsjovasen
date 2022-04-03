<?php
/**
 * Plugin Name:       MF Layouts
 * Description:       One block for creating any layout.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Markus Finell
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mf-layouts
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function mf_layouts_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'mf_layouts_block_init' );

function mf_layouts_stack_style( $block_content, $block ) {
	$is_layout = $block['blockName'] === 'mf/layouts';
	$is_stack = $block['attrs']['layoutType'] ?? 'stack' === 'stack';
	$split_after = intval( $block['attrs']['stackSplitAfter'] ?? 0 );
	$block_id = $block['attrs']['blockId'] ?? '';

	if ( $is_layout && $is_stack && $split_after ) {
		$block_content .= '<style>#block-' . $block_id . ' > :nth-child(' . $split_after . ') { margin-block-end: auto; }</style>';
	}

    return $block_content;
}

add_filter( 'render_block', 'mf_layouts_stack_style', 10, 2 );

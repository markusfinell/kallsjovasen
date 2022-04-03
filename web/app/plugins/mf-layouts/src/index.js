/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

import {
	createHigherOrderComponent
} from '@wordpress/compose';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType('mf/layouts', {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
});

const layoutClasses = ( attributes ) => {
	const classes = [
		'l-' + attributes.layoutType
	];

	for ( let key in attributes ) {
		if ( key.indexOf( attributes.layoutType ) === 0 && attributes[key] !== '' && attributes[key] !== false ) {
			const attributeKebab = key.replace( attributes.layoutType, '' ).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
			const className = attributeKebab + ('-' + attributes[key]).replace( '-true', '' );
			classes.push( className );
		}
	}

	return classes.join(' ');
}

const wrapperProps = (props, attributes) => {
	const wrapperProps = {
		...props.wrapperProps,
		style: {}
	};

	attributes = attributes || props.attributes;

	if ( attributes.mediaUrl != '' ) {
		wrapperProps.style.backgroundImage = 'url("' + attributes.mediaUrl + '")';
	}

	return wrapperProps;
};

const withStyleClasses = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		if ( props.name.indexOf('mf/layouts') === -1 ) {
			return <BlockListBlock { ...props } />;
		}

		const { attributes } = props;

		const containerProps = wrapperProps( props );
		const classes = layoutClasses( attributes );

		return <BlockListBlock { ...props } className={ classes } wrapperProps={ containerProps } />;
	};
}, 'withStyleClasses' );

wp.hooks.addFilter( 'editor.BlockListBlock', 'mf-layouts-class/with-style-classes', withStyleClasses );

const withStyleClassesFrontEnd = (props, block, attributes) => {
	if ( block.name.indexOf('mf/layouts') === -1 ) {
		return props;
	}

	const { className } = props;
	const containerProps = wrapperProps( props, attributes );
	const attsToAssign = {
		className: className + ' ' + layoutClasses( attributes ),
		style: containerProps.style
	};

	return lodash.assign({}, props, attsToAssign);
}

wp.hooks.addFilter( 'blocks.getSaveContent.extraProps', 'mf-layouts-class/with-style-classes-front-end', withStyleClassesFrontEnd );


/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import {
	InnerBlocks,
	useBlockProps,
	useSetting,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	BlockControls,
	BlockAlignmentToolbar
} from '@wordpress/block-editor';

import {
	PanelBody,
	PanelRow,
	PanelHeader,
	BaseControl,
	Button,
	ButtonGroup,
	SelectControl,
	RangeControl,
	Toolbar,
	ToolbarButton,
	DimensionControl
} from '@wordpress/components';

import {
	createHigherOrderComponent
} from '@wordpress/compose';

import {
	stretchFullWidth,
	alignNone
} from '@wordpress/icons';

import { partialRight } from 'lodash';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

const COLUMN_TEMPLATE = [
	['core/paragraph', {}]
];

const ROW_TEMPLATE = [
	['mf-containers/column', {}, COLUMN_TEMPLATE ]
];

const SECTION_TEMPLATE = [
	['mf-containers/row', {}, ROW_TEMPLATE ]
];

const containers = [
	{
		name: 'section',
		template: SECTION_TEMPLATE,
		allowedBlocks: ['mf-containers/row']
	},
	{
		name: 'row',
		template: ROW_TEMPLATE,
		allowedBlocks: ['mf-containers/column']
	},
	{
		name: 'column',
		template: COLUMN_TEMPLATE
	}
];

const breakpoints = {
	default: 'Default',
	sm: 'Mobile',
	md: 'Tablet',
	lg: 'Desktop'
};

const containerClasses = ( blockName, attributes ) => {
	const classesArray = [];

	if ( blockName === 'mf-containers/row' ) {
		if ( attributes.alignFull ) {
			classesArray.push( 'alignfull' );
		}
	}

	if ( blockName === 'mf-containers/column' ) {
		const colClasses = [];
		for ( let bp in breakpoints ) {
			const width = attributes[breakpoints[bp].toLowerCase() + 'Width'];
			const offset = attributes[breakpoints[bp].toLowerCase() + 'Offset'];

			if ( width !== 0 ) {
				colClasses.push('col-' + bp + '-' + width);
			}

			if ( offset !== 0 ) {
				colClasses.push('offset-' + bp + '-' + offset);
			}
		}

		classesArray.push(colClasses.join(' ').replace('--1', 'auto').replace('-default', ''));
	}

	return classesArray;
};

containers.forEach( container => {
	registerBlockType('mf-containers/' + container.name, {
		edit: function ({ attributes, setAttributes, clientId }) {
			const { blockId } = attributes;

			React.useEffect( () => {
				if ( ! blockId ) {
					setAttributes( { blockId: clientId } );
				}
			}, [] );

			const defaultLayout = useSetting( 'layout' ) || {};

			const onSelectMedia = (media) => {
				setAttributes({
					mediaId: media.id,
					mediaUrl: media.url
				});
			}

			const removeMedia = () => {
				setAttributes({
					mediaId: 0,
					mediaUrl: ''
				});
			}

			const columnControls = (colAttr) => {
				const control = [];

				for ( let bp in breakpoints ) {
					const attr = breakpoints[bp].toLowerCase() + colAttr;
					control.push(
						<RangeControl
							label={ breakpoints[bp]}
							value={ attributes[attr] }
							onChange={ ( width ) => {
								const newAttr = {};
								newAttr[attr] = typeof width === 'undefined' ? 0 : width;
								setAttributes(newAttr);
							} }
							min={ -1 }
							max={ 12 }
							allowReset={ true }
						/>
					);
				}

				return control;
			}

			const blockProps = useBlockProps();

			return (
				<div { ...blockProps } key={ blockId }>
					<InspectorControls>
						<PanelBody
							title={ __( 'Background image', 'mf-containers' ) }
							initialOpen={ false }
						>
							<BaseControl>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={onSelectMedia}
										value={attributes.mediaId}
										allowedTypes={ ['image'] }
										render={({open}) => (
											<Button
												className={attributes.mediaId == 0 ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview'}
												onClick={open}
											>
												{attributes.mediaId == 0 && __('Choose an image', 'mf-containers')}
												{attributes.mediaId != 0 &&
													<img src={attributes.mediaUrl} />
												}
											</Button>
										)}
									/>
								</MediaUploadCheck>
								{attributes.mediaId != 0 &&
									<MediaUploadCheck>
										<Button onClick={removeMedia} isLink isDestructive>{__('Remove image', 'mf-containers')}</Button>
									</MediaUploadCheck>
								}
							</BaseControl>
						</PanelBody>

						{ container.name === 'column' && [
							<PanelBody
								title={ __( 'Width', 'mf-containers' ) }
								initialOpen={ false }
							>
								{ columnControls('Width') }
							</PanelBody>,
							<PanelBody
								title={ __( 'Offset', 'mf-containers' ) }
								initialOpen={ false }
							>
								{ columnControls('Offset') }
							</PanelBody>
						]}
					</InspectorControls>

					<InnerBlocks
						template={ container.template }
						allowedBlocks={ container.allowedBlocks ? container.allowedBlocks : null }
						__experimentalLayout={ defaultLayout }
						orientation={ container.name === 'row' ? 'horizontal' : 'vertical' }
					/>
				</div>
			);
		},

		save: function ({ attributes }) {
			const blockProps = useBlockProps.save();
			const { blockId } = attributes;

			return (
				<div { ...blockProps } key={ blockId }>
					<InnerBlocks.Content />
				</div>
			)
		},
	});
});

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
		if ( props.name.indexOf('mf-containers') === -1 ) {
			return <BlockListBlock { ...props } />;
		}

		const containerClass = containerClasses( props.name, props.attributes );

		const containerProps = wrapperProps( props );

		return <BlockListBlock { ...props } className={ containerClass } wrapperProps={ containerProps } />;
	};
}, 'withStyleClasses' );

wp.hooks.addFilter( 'editor.BlockListBlock', 'mf-containers-column-class/with-style-classes', withStyleClasses );

const withStyleClassesFrontEnd = (props, block, attributes) => {
	if ( block.name.indexOf('mf-containers') === -1 ) {
		return props;
	}

	const { className } = props;
	const containerProps = wrapperProps( props, attributes );
	const attsToAssign = {
		className: className,
		style: containerProps.style
	};

	if (block.name === 'mf-containers/row') {
		attsToAssign.className += attributes.alignFull ? ' alignfull' : '';
	}

	if (block.name === 'mf-containers/column') {
		attsToAssign.className += ' ' + containerClasses( block.name, attributes );
	}

	return lodash.assign({}, props, attsToAssign);
}

wp.hooks.addFilter( 'blocks.getSaveContent.extraProps', 'mf-containers-column-class/with-style-classes-front-end', withStyleClassesFrontEnd );

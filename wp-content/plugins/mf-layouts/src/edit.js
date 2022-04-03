/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

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
	DimensionControl,
	CheckboxControl,
	__experimentalNumberControl as NumberControl
} from '@wordpress/components';

import {
	useState
} from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

const layouts = {
	stack: {
		title: __( 'Stack', 'mf-layouts' ),
		props: {
			gap: {
				title: __( 'Gap', 'mf-layouts' ),
				control: 'size'
			},
			recursive: {
				title: __( 'Recursive', 'mf-layouts' ),
				control: 'checkbox'
			},
			splitAfter: {
				title: __( 'Split after n elements', 'mf-layouts' ),
				control: 'number',
			}
		}
	},
	box: {
		title: __( 'Box', 'mf-layouts' ),
		props: {
			padding: {
				title: __( 'Padding', 'mf-layouts' ),
				control: 'size'
			},
			borderWidth: {
				title: __( 'Border width', 'mf-layouts' ),
				control: 'size',
			},
			invert: {
				title: __( 'Invert colors', 'mf-layouts' ),
				control: 'checkbox'
			}
		}
	},
	center: {
		title: __( 'Center', 'mf-layouts' ),
		props: {
			max: {
				title: __( 'Max width', 'mf-layouts' ),
				control: 'size'
			},
			andText: {
				title: __( 'Center text', 'mf-layouts' ),
				control: 'checkbox'
			},
			gutters: {
				title: __( 'Gutter size', 'mf-layouts' ),
				control: 'size'
			},
			intrinsic: {
				title: __( 'Intrinsic', 'mf-layouts' ),
				control: 'checkbox'
			}
		}
	},
	cluster: {
		title: __( 'Cluster', 'mf-layouts' ),
		props: {
			justify: {
				title: __( 'Justify content', 'mf-layouts' ),
				control: 'flexJustify'
			},
			align: {
				title: __( 'Align items', 'mf-layouts' ),
				control: 'flexAlign'
			},
			gap: {
				title: __( 'Gap', 'mf-layouts' ),
				control: 'size'
			}
		}
	}
};

const sizesOptions = [
	{ label: 'Extra small', value: 'xs' },
	{ label: 'Small', value: 'sm' },
	{ label: 'Base', value: '' },
	{ label: 'Large', value: 'lg' },
	{ label: 'Extra large', value: 'xl' },
	{ label: '2 XL', value: '2-xl' },
	{ label: '3 XL', value: '3-xl' },
	{ label: '4 XL', value: '4-xl' },
];

const flexJustifyOptions = [
	{ label: 'Baseline', value: 'baseline' },
	{ label: 'Center', value: 'center' },
	{ label: 'Start', value: 'start' },
	{ label: 'End', value: 'end' },
	{ label: 'Flex start', value: 'flex-start' },
	{ label: 'Flex end', value: 'flex-end' },
	{ label: 'Space around', value: 'space-around' },
	{ label: 'Space between', value: 'space-between' },
	{ label: 'Space evenly', value: 'space-evenly' }
];

const flexAlignOptions = [
	{ label: 'Baseline', value: 'baseline' },
	{ label: 'Center', value: 'center' },
	{ label: 'Flex start', value: 'flex-start' },
	{ label: 'Flex end', value: 'flex-end' },
	{ label: 'Stretch', value: 'stretch' }
];

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes, clientId }) {
	const MySelectControl = ( label, value, options, attribute ) => {
		return <SelectControl
			label={ label }
			value={ value }
			options={ options }
			onChange={ ( newVal ) => {
				const newAttributes = {};
				newAttributes[attribute] = newVal;
				setAttributes(newAttributes);
			} }
		/>;
	};

	const MyCheckboxControl = ( label, value, attribute ) => {
		return <CheckboxControl
			label={ label }
			checked={ value }
			onChange={ ( newVal ) => {
				const newAttributes = {};
				newAttributes[attribute] = newVal;
				setAttributes(newAttributes);
			} }
		/>;
	};

	const control = ( layout, prop ) => {
		const attribute = layout + prop[0].toUpperCase() + prop.slice(1);
		const value = attributes[attribute];
		const label = layouts[layout].props[prop].title;
		const control = layouts[layout].props[prop].control;
		const controls = {
			size: MySelectControl( label, value, sizesOptions, attribute ),
			checkbox: MyCheckboxControl( label, value, attribute ),
			number: <NumberControl
				label={ label }
				step={ 1 }
				value={ value }
				onChange={ ( newVal ) => {
					const newAttributes = {};
					newAttributes[attribute] = newVal;
					setAttributes(newAttributes);
				} }
			/>,
			flexJustify: <SelectControl
				label={ label }
				value={ value }
				options={ flexJustifyOptions }
				onChange={ ( newVal ) => {
					const newAttributes = {};
					newAttributes[attribute] = newVal;
					setAttributes(newAttributes);
				} }
			/>,
			flexAlign: <SelectControl
				label={ label }
				value={ value }
				options={ flexAlignOptions }
				onChange={ ( newVal ) => {
					const newAttributes = {};
					newAttributes[attribute] = newVal;
					setAttributes(newAttributes);
				} }
			/>
		};

		return controls[control];
	};

	const layoutControls = () => {
		let rows = [];
		for ( let key in layouts ) {
			if ( attributes.layoutType !== key ) continue;

			const layout = layouts[key];
			for ( let prop in layout.props ) {
				rows.push( control( key, prop ) );
			}
		}

		return rows;
	};

	const { blockId } = attributes;

	React.useEffect( () => {
		if ( ! blockId ) {
			setAttributes( { blockId: clientId } );
		}
	}, [] );

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

	const onChangeSelect = (newVal, attribute) => {
		const attributes = {};
		attributes[attribute] = newVal;
		setAttributes( attributes );
	}

	const layoutOptions = () => {
		return [
			{ label: 'Stack', value: 'stack' },
			{ label: 'Box', value: 'box' },
			{ label: 'Center', value: 'center' },
			{ label: 'Cluster', value: 'cluster' },
		]
	}

	return (
		<div {...useBlockProps()} key={ blockId }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Background image', 'mf-layouts' ) }
					initialOpen={ false }
				>
					<PanelRow>
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
										{attributes.mediaId == 0 && __('Choose an image', 'mf-layouts')}
										{attributes.mediaId != 0 &&
											<img src={attributes.mediaUrl} />
										}
									</Button>
								)}
							/>
						</MediaUploadCheck>
						{attributes.mediaId != 0 &&
							<MediaUploadCheck>
								<Button onClick={removeMedia} isLink isDestructive>{__('Remove image', 'mf-layouts')}</Button>
							</MediaUploadCheck>
						}
					</PanelRow>
				</PanelBody>

				<PanelBody
					title={ __( 'Layout settings', 'mf-layouts' ) }
					initialOpen={ false }
				>
					<PanelRow>
						<SelectControl
							label={ __( 'Layout', 'mf-layouts' ) }
							value={ attributes.layoutType }
							options={ layoutOptions() }
							onChange={ ( layout ) => onChangeSelect( layout, 'layoutType' ) }
						/>
					</PanelRow>

					{ layoutControls() }

				</PanelBody>
			</InspectorControls>

			<InnerBlocks
				template={ [['core/paragraph', {}]] }
			/>

			{ parseInt( attributes.stackSplitAfter ) > 0 && [
				<style>{ `#block-${clientId} > .block-editor-inner-blocks > .block-editor-block-list__layout > :nth-child(${attributes.stackSplitAfter}) { margin-block-end: auto; }`}</style>
			] }
		</div>
	);
}

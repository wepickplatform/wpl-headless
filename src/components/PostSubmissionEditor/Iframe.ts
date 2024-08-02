import { Node } from '@tiptap/core'

export interface IframeOptions {
	allowFullscreen: boolean
	HTMLAttributes: {
		[key: string]: any
	}
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		iframe: {
			/**
			 * Add an iframe
			 */
			setIframe: (options: { src: string }) => ReturnType
		}
	}
}

export default Node.create<IframeOptions>({
	name: 'iframe',

	group: 'block',

	atom: true,

	addOptions() {
		return {
			allowFullscreen: true,
			HTMLAttributes: {
				class: 'nc-iframe-wrapper',
			},
		}
	},

	addAttributes() {
		return {
			src: {
				default: null,
			},
			frameborder: {
				default: 0,
			},
			allowfullscreen: {
				default: this.options.allowFullscreen,
				parseHTML: () => this.options.allowFullscreen,
			},
		}
	},

	parseHTML() {
		return [
			{
				tag: 'iframe',
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			this.options.HTMLAttributes,
			['iframe', { ...HTMLAttributes, width: 640, height: 360 }],
		]
	},

	addCommands() {
		return {
			setIframe:
				(options: { src: string }) =>
				({ tr, dispatch }) => {
					const { selection } = tr
					const node = this.type.create(options)

					if (dispatch) {
						tr.replaceRangeWith(selection.from, selection.to, node)
					}

					return true
				},
		}
	},
})

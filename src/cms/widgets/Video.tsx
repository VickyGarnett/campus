import type { EditorComponentOptions } from 'netlify-cms-core'

import { videoProviders } from '@/common/Video'

/**
 * Netlify CMS richtext editor widget for Video component.
 */
export const videoEditorWidget: EditorComponentOptions = {
  id: 'Video',
  label: 'Video',
  fields: [
    {
      name: 'provider',
      label: 'Provider',
      widget: 'select',
      // @ts-expect-error Missing in upstream type.
      options: Object.entries(videoProviders).map(([value, label]) => {
        return { value, label }
      }),
      default: 'youtube',
    },
    { name: 'id', label: 'Video ID', widget: 'string' },
  ],
  pattern: /^<Video([^]*?)\/>/,
  fromBlock(match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attrs = match[1]!

    const provider = /provider="([^"]*)"/.exec(attrs)
    const id = /id="([^"]*)"/.exec(attrs)

    return {
      provider: provider ? provider[1] : undefined,
      id: id ? id[1] : undefined,
    }
  },
  toBlock(data) {
    let attrs = ''

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.provider) attrs += ` provider="${data.provider}"`
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.id) attrs += ` id="${data.id}"`

    return `<Video${attrs} />`
  },
  /**
   * This is only used in `getWidgetFor` (which we don't use).
   */
  toPreview() {
    return `Video`
  },
}

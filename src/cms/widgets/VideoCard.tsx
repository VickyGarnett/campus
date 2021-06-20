import type { EditorComponentOptions } from 'netlify-cms-core'

/**
 * Netlify CMS richtext editor widget for VideoCard component.
 */
export const videoCardEditorWidget: EditorComponentOptions = {
  id: 'VideoCard',
  label: 'VideoCard',
  fields: [
    { name: 'id', label: 'YouTube ID', widget: 'string' },
    { name: 'title', label: 'Title', widget: 'string' },
    { name: 'subtitle', label: 'Subtitle', widget: 'string' },
    { name: 'image', label: 'Image', widget: 'image' },
  ],
  pattern: /^<VideoCard([^]*?)\/>$/,
  fromBlock(match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attrs = match[1]!

    const id = /id="([^"]*)"/.exec(attrs)
    const title = /title="([^"]*)"/.exec(attrs)
    const subtitle = /subtitle="([^"]*)"/.exec(attrs)
    const image = /image="([^"]*)"/.exec(attrs)

    return {
      id: id ? id[1] : undefined,
      title: title ? title[1] : undefined,
      subtitle: subtitle ? subtitle[1] : undefined,
      image: image ? image[1] : undefined,
    }
  },
  toBlock(data) {
    let attrs = ''

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.id) attrs += ` id="${data.id}"`
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.title) attrs += ` title="${data.title}"`
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.subtitle) attrs += ` subtitle="${data.subtitle}"`
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.image) attrs += ` image="${data.image}"`

    return `<VideoCard${attrs} />`
  },
  /**
   * This is only used in `getWidgetFor` (which we don't use).
   */
  toPreview() {
    return `VideoCard`
  },
}

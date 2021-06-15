import type { EditorComponentOptions } from 'netlify-cms-core'

/**
 * Netlify CMS richtext editor widget for YouTube component.
 */
export const youTubeEditorWidget: EditorComponentOptions = {
  id: 'YouTube',
  label: 'YouTube',
  fields: [{ name: 'id', label: 'YouTube ID', widget: 'string' }],
  pattern: /^<YouTube([^]*)\/>$/,
  fromBlock(match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attrs = match[1]!

    const id = /id="(.*)"/.exec(attrs)

    return {
      id: id ? id[1] : undefined,
    }
  },
  toBlock(data) {
    let attrs = ''

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.id) attrs += ` id="${data.id}"`

    return `<YouTube${attrs} />`
  },
  /**
   * This is only used in `getWidgetFor` (which we don't use).
   */
  toPreview() {
    return `YouTube`
  },
}

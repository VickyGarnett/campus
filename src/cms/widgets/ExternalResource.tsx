import type { EditorComponentOptions } from 'netlify-cms-core'

/**
 * Netlify CMS richtext editor widget for ExternalResource component.
 */
export const externalResourceEditorWidget: EditorComponentOptions = {
  id: 'ExternalResource',
  label: 'ExternalResource',
  fields: [
    { name: 'title', label: 'Title', widget: 'string' },
    { name: 'subtitle', label: 'Subtitle', widget: 'string' },
    {
      name: 'url',
      label: 'URL',
      widget: 'string',
      // FIXME: this.props.onValidate is not a function
      // pattern: ['^[a-zA-Z][a-zA-Z\\d+\\-.]*:', 'Must be a valid URL'],
    },
  ],
  pattern: /^<ExternalResource([^]*?)\/>$/,
  fromBlock(match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attrs = match[1]!

    const title = /title="([^"]*)"/.exec(attrs)
    const subtitle = /subtitle="([^"]*)"/.exec(attrs)
    const url = /url="([^"]*)"/.exec(attrs)

    return {
      title: title ? title[1] : undefined,
      subtitle: subtitle ? subtitle[1] : undefined,
      url: url ? url[1] : undefined,
    }
  },
  toBlock(data) {
    let attrs = ''

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.title) attrs += ` title="${data.title}"`
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.subtitle) attrs += ` subtitle="${data.subtitle}"`
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.url) attrs += ` url="${data.url}"`

    return `<ExternalResource${attrs} />`
  },
  /**
   * This is only used in `getWidgetFor` (which we don't use).
   */
  toPreview() {
    return `ExternalResource`
  },
}

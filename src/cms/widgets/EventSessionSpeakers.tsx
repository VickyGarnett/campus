import type { EditorComponentOptions } from 'netlify-cms-core'
import remark from 'remark'
import withGitHubMarkdown from 'remark-gfm'
import type { Node } from 'unist'
import visit from 'unist-util-visit'
import type { VFile } from 'vfile'
import { remarkMarkAndUnravel as withUnraveledJsxChildren } from 'xdm/lib/plugin/remark-mark-and-unravel.js'
import { remarkMdx as withMdx } from 'xdm/lib/plugin/remark-mdx.js'

function withSpeakers() {
  return transformer

  function transformer(tree: Node, file: VFile) {
    const speakers: Array<any> = []

    ;(file.data as any).speakers = speakers

    visit(tree, 'mdxJsxFlowElement', onMdx)

    function onMdx(node: Node) {
      switch (node.name) {
        case 'Speaker': {
          // @ts-expect-error Attributes exist.
          const speaker = node.attributes.find(
            (attribute: any) => attribute.name === 'speaker',
          )
          speakers.push({
            speaker: speaker != null ? speaker.value : undefined,
            children: undefined,
          })
          break
        }
      }
    }
  }
}

const processor = remark()
  .use({
    settings: {
      bullet: '-',
      emphasis: '_',
      fences: true,
      incrementListMarker: true,
      listItemIndent: 'one',
      resourceLink: true,
      rule: '-',
      strong: '*',
    },
  })
  .use(withMdx)
  .use(withUnraveledJsxChildren)
  .use(withGitHubMarkdown)
  .use(withSpeakers)

/**
 * Netlify CMS richtext editor widget for EventSessionSpeakers component.
 */
export const eventSessionSpeakersEditorWidget: EditorComponentOptions = {
  id: 'EventSessionSpeakers',
  label: 'Speakers',
  fields: [
    {
      name: 'speakers',
      label: 'Speakers',
      // @ts-expect-error Missing in upstream type.
      label_singular: 'Speaker',
      widget: 'list',
      fields: [
        {
          name: 'speaker',
          label: 'Speaker',
          widget: 'relation',
          collection: 'people',
          multiple: true,
          value_field: '{{slug}}',
          search_fields: ['firstName', 'lastName'],
          display_fields: ['{{firstName}} {{lastName}}'],
        },
        {
          name: 'children',
          label: 'Custom biography',
          hint: 'Will use biography from "People" collection if not provided',
          widget: 'text',
          required: false,
        },
      ],
    },
  ],
  pattern: /^<Speakers>\n([^]*?)\n<\/Speakers>/, // NOTE: Intentionally not ending with `$`
  fromBlock(match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const children = match[1]!

    const ast = processor.parse(children)
    const file = { data: {} }
    processor.runSync(ast, file)
    // @ts-expect-error Cards are mutated in the transformer.
    const speakers = file.data.speakers

    return {
      speakers,
    }
  },
  toBlock(data) {
    const speakers = data.speakers ?? []

    const ast = {
      type: 'root',
      children: [],
    }

    return String(processor.stringify(ast))
  },
  /**
   * This is only used in `getWidgetFor` (which we don't use).
   */
  toPreview() {
    return `Speakers`
  },
}

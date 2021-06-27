import type * as Mdast from 'mdast'
import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import type { Transformer } from 'unified'
import type * as Unist from 'unist'
import visit from 'unist-util-visit'

/**
 * Remark plugin which resolves image references for the cms preview.
 *
 * When a resource is not yet saved, image data is held in memory by the cms,
 * and needs to be resolved via `getAsset`.
 */
export default function attacher(
  getAsset: PreviewTemplateComponentProps['getAsset'],
): Transformer {
  return transformer

  function transformer(tree: Unist.Node) {
    visit(tree, 'image', visitor)

    function visitor(node: Mdast.Image) {
      node.url = String(getAsset(node.url))
    }
  }
}
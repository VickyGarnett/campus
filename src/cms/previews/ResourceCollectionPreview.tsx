import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import { useState, useEffect } from 'react'
import { compile } from 'xdm'

import type {
  Collection as CollectionData,
  CollectionFrontmatter,
} from '@/api/cms/collection'
import { Preview } from '@/cms/Preview'
import { useDebouncedState } from '@/common/useDebouncedState'
import { Collection } from '@/post/Collection'

/**
 * CMS preview for collection of resources.
 *
 * TODO: Don't recompile mdx when only metadata changes.
 */
export function ResourceCollectionPreview(
  props: PreviewTemplateComponentProps,
): JSX.Element {
  const entry = useDebouncedState(props.entry, 250)
  const fieldsMetaData = useDebouncedState(props.fieldsMetaData, 250)
  const [collection, setCollection] = useState<CollectionData | null>(null)

  useEffect(() => {
    function resolveRelation(path: Array<string>, id: string) {
      const metadata = fieldsMetaData.getIn(path)
      if (metadata == null) return null
      return { id, ...metadata.toJS() }
    }

    let wasCanceled = false

    async function compileMdx() {
      try {
        const { body, ...partialFrontmatter } = entry.get('data').toJS()
        const frontmatter = partialFrontmatter as Partial<CollectionFrontmatter>

        const id = entry.get('slug')

        const resources = Array.isArray(frontmatter.resources)
          ? frontmatter.resources
              .map((id) => {
                return resolveRelation(['resources', 'post', 'resources'], id)
              })
              .filter(Boolean)
          : []

        const metadata = {
          ...frontmatter,
          resources,
        }

        const code = String(
          await compile(body, {
            outputFormat: 'function-body',
            useDynamicImport: false,
          }),
        )

        const collection = {
          id,
          code,
          data: {
            metadata,
            toc: [],
          },
        } as CollectionData

        if (!wasCanceled) {
          setCollection(collection)
        }
      } catch {
        setCollection(null)
      }

      return () => {
        wasCanceled = true
      }
    }

    compileMdx()
  }, [entry, fieldsMetaData])

  return (
    <Preview {...props}>
      {collection === null ? null : (
        <Collection collection={collection} lastUpdatedAt={null} isPreview />
      )}
    </Preview>
  )
}

import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import { useState, useEffect } from 'react'
import { compile } from 'xdm'

import type {
  Collection as CollectionData,
  CollectionFrontmatter,
} from '@/api/cms/collection'
import { Preview } from '@/cms/Preview'
import { Spinner } from '@/common/Spinner'
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
  const [collection, setCollection] = useState<
    CollectionData | null | undefined
  >(undefined)

  useEffect(() => {
    function resolveRelation(path: Array<string>, id: string) {
      const metadata = fieldsMetaData.getIn([...path, id])
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

        // TODO: preview should take care of (i) stringify Date objects, (ii) ensure values for required fields

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
      {collection == null ? (
        collection === undefined ? (
          <div className="flex items-center justify-center flex-1">
            <div className="flex flex-col items-center space-y-4">
              <Spinner className="text-primary-600" />
              <p>Trying to render preview...</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <div className="flex flex-col items-center space-y-4">
              <p>Failed to render preview.</p>
              <p>
                This usually indicates a syntax error in the Markdown content.
              </p>
            </div>
          </div>
        )
      ) : (
        <Collection collection={collection} lastUpdatedAt={null} isPreview />
      )}
    </Preview>
  )
}

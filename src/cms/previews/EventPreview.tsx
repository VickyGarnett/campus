import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import { useState, useEffect } from 'react'
import { compile } from 'xdm'

import type { Event as EventData, EventFrontmatter } from '@/api/cms/event'
import { Preview } from '@/cms/Preview'
import { Spinner } from '@/common/Spinner'
import { useDebouncedState } from '@/common/useDebouncedState'
import { Event } from '@/event/Event'

/**
 * CMS preview for event resource.
 *
 * TODO: Don't recompile mdx when only metadata changes.
 */
export function EventPreview(
  props: PreviewTemplateComponentProps,
): JSX.Element {
  const entry = useDebouncedState(props.entry, 250)
  const fieldsMetaData = useDebouncedState(props.fieldsMetaData, 250)
  const [event, setEvent] = useState<EventData | null | undefined>(undefined)

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
        const frontmatter = partialFrontmatter as Partial<EventFrontmatter>

        const id = entry.get('slug')

        const authors = Array.isArray(frontmatter.authors)
          ? frontmatter.authors
              .map((id) => {
                return resolveRelation(['authors', 'people'], id)
              })
              .filter(Boolean)
          : []

        const categories = Array.isArray(frontmatter.categories)
          ? frontmatter.categories
              .map((id) => {
                return resolveRelation(['categories', 'categories'], id)
              })
              .filter(Boolean)
          : []

        const tags = Array.isArray(frontmatter.tags)
          ? frontmatter.tags
              .map((id) => {
                return resolveRelation(['tags', 'tags'], id)
              })
              .filter(Boolean)
          : []

        const partners = Array.isArray(frontmatter.partners)
          ? frontmatter.partners
              .map((id) => {
                return resolveRelation(['partners', 'organisations'], id)
              })
              .filter(Boolean)
          : []

        const type =
          frontmatter.type != null
            ? resolveRelation(['type', 'content-types'], frontmatter.type)
            : null

        const licence =
          frontmatter.licence != null
            ? resolveRelation(['licence', 'licences'], frontmatter.licence)
            : null

        const about =
          frontmatter.about != null
            ? String(
                await compile(frontmatter.about, {
                  outputFormat: 'function-body',
                  useDynamicImport: false,
                  // FIXME: plugins like syntax highlighter
                }),
              )
            : ''

        const sessions = Array.isArray(frontmatter.sessions)
          ? await Promise.all(
              frontmatter.sessions.map(async (session) => {
                const speakers = Array.isArray(session.speakers)
                  ? await Promise.all(
                      session.speakers.map((id) => {
                        return resolveRelation(
                          ['sessions', 'speakers', 'people'],
                          id,
                        )
                      }),
                    )
                  : []

                const body =
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  session.body != null
                    ? String(
                        await compile(session.body, {
                          outputFormat: 'function-body',
                          useDynamicImport: false,
                          // FIXME: plugins like syntax highlighter
                        }),
                      )
                    : ''

                return { ...session, speakers, body: { code: body } }
              }),
            )
          : []

        // TODO: preview should take care of (i) stringify Date objects, (ii) ensure values for required fields

        const metadata = {
          ...frontmatter,
          authors,
          categories,
          tags,
          type,
          licence,
          partners,
          sessions,
          about: { code: about },
          prep: null, // TODO:
        }

        const code = String(
          await compile(body, {
            outputFormat: 'function-body',
            useDynamicImport: false,
          }),
        )

        const event = {
          id,
          code,
          data: {
            metadata,
            toc: [],
          },
        } as EventData

        if (!wasCanceled) {
          setEvent(event)
        }
      } catch {
        setEvent(null)
      }

      return () => {
        wasCanceled = true
      }
    }

    compileMdx()
  }, [entry, fieldsMetaData])

  return (
    <Preview {...props}>
      {event == null ? (
        event === undefined ? (
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
        <Event event={event} lastUpdatedAt={null} isPreview />
      )}
    </Preview>
  )
}

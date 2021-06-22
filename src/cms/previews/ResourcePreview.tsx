import withSyntaxHighlighting from '@stefanprobst/rehype-shiki'
import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import { useState, useEffect } from 'react'
import withHeadingIds from 'rehype-slug'
import withFootnotes from 'remark-footnotes'
import withGitHubMarkdown from 'remark-gfm'
import { compile } from 'xdm'

import type { Post as PostData, PostFrontmatter } from '@/api/cms/post'
import { Preview } from '@/cms/Preview'
import { Spinner } from '@/common/Spinner'
import { useDebouncedState } from '@/common/useDebouncedState'
import withHeadingLinks from '@/mdx/plugins/rehype-heading-links'
import withImageCaptions from '@/mdx/plugins/rehype-image-captions'
import withLazyLoadingImages from '@/mdx/plugins/rehype-lazy-loading-images'
import withNoReferrerLinks from '@/mdx/plugins/rehype-no-referrer-links'
import { Post } from '@/post/Post'

/**
 * CMS preview for resource.
 *
 * TODO: Don't recompile mdx when only metadata changes.
 */
export function ResourcePreview(
  props: PreviewTemplateComponentProps,
): JSX.Element {
  const entry = useDebouncedState(props.entry, 250)
  const fieldsMetaData = useDebouncedState(props.fieldsMetaData, 250)
  const [post, setPost] = useState<PostData | null | undefined>(undefined)

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
        const frontmatter = partialFrontmatter as Partial<PostFrontmatter>

        const id = entry.get('slug')

        const authors = Array.isArray(frontmatter.authors)
          ? frontmatter.authors
              .map((id) => {
                return resolveRelation(['authors', 'people'], id)
              })
              .filter(Boolean)
          : []
        const contributors = Array.isArray(frontmatter.contributors)
          ? frontmatter.contributors
              .map((id) => {
                return resolveRelation(['contributors', 'people'], id)
              })
              .filter(Boolean)
          : []
        const editors = Array.isArray(frontmatter.editors)
          ? frontmatter.editors
              .map((id) => {
                return resolveRelation(['editors', 'people'], id)
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

        const type =
          frontmatter.type != null
            ? resolveRelation(['type', 'content-types'], frontmatter.type)
            : null

        const licence =
          frontmatter.licence != null
            ? resolveRelation(['licence', 'licences'], frontmatter.licence)
            : null

        // TODO: preview should take care of (i) stringify Date objects, (ii) ensure values for required fields

        const metadata = {
          ...frontmatter,
          authors,
          contributors,
          editors,
          categories,
          tags,
          type,
          licence,
        }

        const { getHighlighter, setCDN, setOnigasmWASM } = await import(
          /* @ts-expect-error Missing module declaration. */
          'shiki/dist/index.browser.mjs'
        )
        setOnigasmWASM('https://unpkg.com/shiki@0.9.4/dist/onigasm.wasm')
        setCDN('https://unpkg.com/shiki@0.9.4/')
        const highlighter = await getHighlighter({
          theme: 'material-palenight',
          langs: [
            'css',
            'diff',
            'docker',
            'graphql',
            'java',
            'javascript',
            'js',
            'json',
            'jsx',
            'julia',
            'latex',
            'tex',
            'markdown',
            'md',
            'mdx',
            'perl',
            'php',
            'python',
            'py',
            'r',
            'shell',
            'bash',
            'sh',
            'sparql',
            'sql',
            'ssh-config',
            'svelte',
            'toml',
            'tsx',
            'turtle',
            'typescript',
            'ts',
            'vue',
            'wasm',
            'xml',
            'xsl',
            'yaml',
          ],
        })

        const code = String(
          await compile(body, {
            outputFormat: 'function-body',
            useDynamicImport: false,
            remarkPlugins: [withGitHubMarkdown, withFootnotes],
            rehypePlugins: [
              [withSyntaxHighlighting, { highlighter }],
              withHeadingIds,
              // withExtractedTableOfContents,
              withHeadingLinks,
              withNoReferrerLinks,
              withLazyLoadingImages,
              withImageCaptions,
            ],
          }),
        )

        const post = {
          id,
          code,
          data: {
            metadata,
            toc: [],
          },
        } as PostData

        if (!wasCanceled) {
          setPost(post)
        }
      } catch (error) {
        console.error(error)
        setPost(null)
      }

      return () => {
        wasCanceled = true
      }
    }

    compileMdx()
  }, [entry, fieldsMetaData])

  return (
    <Preview {...props}>
      {post == null ? (
        post === undefined ? (
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
        <Post post={post} lastUpdatedAt={null} isPreview />
      )}
    </Preview>
  )
}

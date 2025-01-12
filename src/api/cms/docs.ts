import { join } from 'path'

import type { Toc } from '@stefanprobst/rehype-extract-toc'
import withExtractedTableOfContents from '@stefanprobst/rehype-extract-toc'
import withSyntaxHighlighting from '@stefanprobst/rehype-shiki'
import withHeadingIds from 'rehype-slug'
import withFootnotes from 'remark-footnotes'
import withGitHubMarkdown from 'remark-gfm'
import { getHighlighter } from 'shiki'
import type { VFile } from 'vfile'

import type { Locale } from '@/i18n/i18n.config'
import { extractFrontmatter } from '@/mdx/extractFrontmatter'
import minify from '@/mdx/plugins/recma-minify'
import withHeadingLinks from '@/mdx/plugins/rehype-heading-links'
import withImageCaptions from '@/mdx/plugins/rehype-image-captions'
import withLazyLoadingImages from '@/mdx/plugins/rehype-lazy-loading-images'
import withNoReferrerLinks from '@/mdx/plugins/rehype-no-referrer-links'
import { readFile } from '@/mdx/readFile'
import { readFolder } from '@/mdx/readFolder'
import type { FilePath } from '@/utils/ts/aliases'

const docsFolder = join(process.cwd(), 'documentation')
const docsExtension = '.mdx'

export interface DocsId {
  /** Slug. */
  id: string
}

type ID = DocsId['id']

export interface DocsMetadata {
  title: string
  order: number
}

export interface DocsData {
  /** Metadata. */
  metadata: DocsMetadata
  /** Table of contents. */
  toc: Toc
}

export interface Docs extends DocsId {
  /** Metadata and table of contents. */
  data: DocsData
  /** Mdx compiled to function body. Must be hydrated on the client with `useMdx`. */
  code: string
}

export interface DocsPreview extends DocsId, DocsMetadata {}

/**
 * Returns all docs ids (slugs).
 */
export async function getDocsIds(_locale: Locale): Promise<Array<string>> {
  const ids = await readFolder(docsFolder, docsExtension)

  return ids
}

/**
 * Returns docs content, table of contents, and metadata.
 */
export async function getDocsById(id: ID, locale: Locale): Promise<Docs> {
  const file = await getDocsFile(id, locale)
  const metadata = await getDocsMetadata(file, locale)
  const code = String(await compileMdx(file))

  const data = {
    metadata,
    toc: (file.data as { toc: Toc }).toc,
  }

  return {
    id,
    data,
    code,
  }
}

/**
 * Returns all docs, sorted by order.
 */
export async function getDocs(locale: Locale): Promise<Array<Docs>> {
  const ids = await getDocsIds(locale)

  const docs = await Promise.all(
    ids.map(async (id) => {
      return getDocsById(id, locale)
    }),
  )

  docs.sort((a, b) => (a.data.metadata.order > b.data.metadata.order ? 1 : -1))

  return docs
}

/**
 * Returns metadata for docs.
 */
export async function getDocsPreviewById(
  id: ID,
  locale: Locale,
): Promise<DocsPreview> {
  const file = await getDocsFile(id, locale)
  const metadata = await getDocsMetadata(file, locale)

  return { id, ...metadata }
}

/**
 * Returns previews for all docs, sorted by order.
 */
export async function getDocsPreviews(
  locale: Locale,
): Promise<Array<DocsPreview>> {
  const ids = await getDocsIds(locale)

  const metadata = await Promise.all(
    ids.map(async (id) => {
      return getDocsPreviewById(id, locale)
    }),
  )

  metadata.sort((a, b) => (a.order > b.order ? 1 : -1))

  return metadata
}

/**
 * Reads docs file.
 */
async function getDocsFile(id: ID, locale: Locale): Promise<VFile> {
  const filePath = getDocsFilePath(id, locale)
  const file = await readFile(filePath)

  return file
}

/**
 * Returns file path for docs.
 */
export function getDocsFilePath(id: ID, _locale: Locale): FilePath {
  const filePath = join(docsFolder, id + docsExtension)

  return filePath
}

/**
 * Extracts docs metadata and resolves foreign-key relations.
 */
async function getDocsMetadata(
  file: VFile,
  _locale: Locale,
): Promise<DocsMetadata> {
  extractFrontmatter(file)

  const { matter: metadata } = file.data as { matter: DocsMetadata }

  return metadata
}

/**
 * Compiles markdown and mdx content to function body.
 * Must be hydrated on the client with `useMdx`.
 *
 * Treats `.md` files as markdown, and `.mdx` files as mdx.
 *
 * Supports CommonMark, GitHub Markdown, and Pandoc Footnotes.
 */
async function compileMdx(file: VFile): Promise<VFile> {
  const { compile } = await import('xdm')

  const highlighter = await getHighlighter({ theme: 'material-palenight' })

  return compile(file, {
    outputFormat: 'function-body',
    useDynamicImport: false,
    remarkPlugins: [withGitHubMarkdown, withFootnotes],
    rehypePlugins: [
      [withSyntaxHighlighting, { highlighter }],
      withHeadingIds,
      withExtractedTableOfContents,
      withHeadingLinks,
      withNoReferrerLinks,
      withLazyLoadingImages,
      withImageCaptions,
    ],
    // recmaPlugins: [minify], // FIXME:
  })
}

import { join } from 'path'

import withFootnotes from 'remark-footnotes'
import withGitHubMarkdown from 'remark-gfm'
import type { VFile } from 'vfile'
import vfile from 'vfile'

import type { Licence } from './licence'
import { getLicenceById } from './licence'
import type { Organisation, OrganisationId } from './organisation'
import { getOrganisationById } from './organisation'

import type { Category } from '@/api/cms/category'
import { getCategoryById } from '@/api/cms/category'
import type { ContentType } from '@/api/cms/contentType'
import { getContentTypeById } from '@/api/cms/contentType'
import type { Person, PersonId } from '@/api/cms/person'
import { getPersonById } from '@/api/cms/person'
import type { Tag, TagId } from '@/api/cms/tag'
import { getTagById } from '@/api/cms/tag'
import type { Locale } from '@/i18n/i18n.config'
import { extractFrontmatter } from '@/mdx/extractFrontmatter'
import withNoReferrerLinks from '@/mdx/plugins/rehype-no-referrer-links'
import { readFile } from '@/mdx/readFile'
import { readFolder } from '@/mdx/readFolder'
import type { FilePath, ISODateString, URLString } from '@/utils/ts/aliases'

const eventsFolder = join(process.cwd(), 'content', 'events')
const eventsExtension = '.mdx'

export interface EventId {
  /** Slug. */
  id: string
}

type ID = EventId['id']

export interface EventFrontmatter {
  uuid: string
  title: string
  shortTitle?: string
  eventType?: string
  lang: 'en' | 'de'
  date: ISODateString
  authors?: Array<PersonId['id']>
  // version: string
  licence: 'ccby-4.0'
  logo?: FilePath
  featuredImage?: FilePath
  tags: Array<TagId['id']>
  categories: Array<'event'> //Array<CategoryId['id']>
  abstract: string
  type: 'event' // ContentTypeId['id']

  about: string
  prep?: string

  partners?: Array<OrganisationId['id']>
  social?: {
    website?: URLString
    email?: string
    twitter?: string
    flickr?: URLString
  }
  synthesis?: FilePath
  sessions: Array<EventSessionFrontmatter>
}

export interface EventSessionFrontmatter {
  title: string
  // shortTitle?: string
  speakers: Array<PersonId['id']>
  body: string
  synthesis?: FilePath
}

export interface EventPreviewMetadata
  extends Omit<
    EventFrontmatter,
    'authors' | 'categories' | 'tags' | 'type' | 'licence' | 'partners'
  > {
  authors: Array<Person>
  categories: Array<Category>
  tags: Array<Tag>
  type: ContentType
  licence: Licence
  partners: Array<Organisation>
}

export interface EventMetadata
  extends Omit<EventPreviewMetadata, 'about' | 'prep' | 'sessions'> {
  sessions: Array<EventSessionMetadata>
  about: { code: string }
  prep: { code: string } | null
}

export interface EventSessionMetadata {
  title: string
  // shortTitle?: string
  speakers: Array<Person>
  body: { code: string }
  synthesis?: FilePath
}

export interface EventData {
  /** Metadata. */
  metadata: EventMetadata
}

export interface Event extends EventId {
  /** Metadata and table of contents. */
  data: EventData
  /** Mdx compiled to function body. Must be hydrated on the client with `useMdx`. */
  code: string
}

export interface EventPreview extends EventId, EventPreviewMetadata {}

/**
 * Returns all post ids (slugs).
 */
export async function getEventIds(_locale: Locale): Promise<Array<string>> {
  const ids = await readFolder(eventsFolder, eventsExtension)

  return ids
}

/**
 * Returns post content, table of contents, and metadata.
 */
export async function getEventById(id: ID, locale: Locale): Promise<Event> {
  const [file, matter] = await readFileAndGetEventMetadata(id, locale)

  const code = String(await compileMdx(file))

  const metadata = {
    ...matter,
    sessions: await Promise.all(
      matter.sessions.map(async (session) => {
        const speakers = await Promise.all(
          session.speakers.map((id) => {
            return getPersonById(id, locale)
          }),
        )

        const code = String(await compileMdx(vfile({ contents: session.body })))

        return {
          ...session,
          speakers,
          body: { code },
        }
      }),
    ),

    about: {
      code: String(await compileMdx(vfile({ contents: matter.about }))),
    },
    prep:
      matter.prep != null
        ? { code: String(await compileMdx(vfile({ contents: matter.prep }))) }
        : null,
  }

  const data = {
    metadata,
  }

  return {
    id,
    data,
    code,
  }
}

/**
 * Returns all posts, sorted by date.
 */
export async function getEvents(locale: Locale): Promise<Array<Event>> {
  const ids = await getEventIds(locale)

  const posts = await Promise.all(
    ids.map(async (id) => {
      return getEventById(id, locale)
    }),
  )

  posts.sort((a, b) =>
    a.data.metadata.date === b.data.metadata.date
      ? 0
      : a.data.metadata.date > b.data.metadata.date
      ? -1
      : 1,
  )

  return posts
}

/**
 * Returns metadata for post.
 */
export async function getEventPreviewById(
  id: ID,
  locale: Locale,
): Promise<EventPreview> {
  const [, metadata] = await readFileAndGetEventMetadata(id, locale)

  return { id, ...metadata }
}

/**
 * Returns metadata for all posts, sorted by date.
 */
export async function getEventPreviews(
  locale: Locale,
): Promise<Array<EventPreview>> {
  const ids = await getEventIds(locale)

  const metadata = await Promise.all(
    ids.map(async (id) => {
      return getEventPreviewById(id, locale)
    }),
  )

  metadata.sort((a, b) => (a.date === b.date ? 0 : a.date > b.date ? -1 : 1))

  return metadata
}

/**
 * Reads post file.
 */
async function getEventFile(id: ID, locale: Locale): Promise<VFile> {
  const filePath = getEventFilePath(id, locale)
  const file = await readFile(filePath)

  return file
}

/**
 * Returns file path for post.
 */
export function getEventFilePath(id: ID, _locale: Locale): FilePath {
  const filePath = join(eventsFolder, id + eventsExtension)

  return filePath
}

/**
 * Extracts post metadata and resolves foreign-key relations.
 */
async function getEventMetadata(
  file: VFile,
  locale: Locale,
): Promise<EventPreviewMetadata> {
  const matter = await getEventFrontmatter(file, locale)

  const metadata = {
    ...matter,
    authors: Array.isArray(matter.authors)
      ? await Promise.all(
          matter.authors.map((id) => {
            return getPersonById(id, locale)
          }),
        )
      : [],
    tags: Array.isArray(matter.tags)
      ? await Promise.all(
          matter.tags.map((id) => {
            return getTagById(id, locale)
          }),
        )
      : [],
    categories: Array.isArray(matter.categories)
      ? await Promise.all(
          matter.categories.map((id) => {
            return getCategoryById(id, locale)
          }),
        )
      : [],
    type: await getContentTypeById(matter.type, locale),
    licence: await getLicenceById(matter.licence, locale),
    partners: Array.isArray(matter.partners)
      ? await Promise.all(
          matter.partners.map((id) => {
            return getOrganisationById(id, locale)
          }),
        )
      : [],
  }

  return metadata
}

/**
 * Extracts post frontmatter.
 */
async function getEventFrontmatter(
  file: VFile,
  _locale: Locale,
): Promise<EventFrontmatter> {
  extractFrontmatter(file)

  const { matter } = file.data as { matter: EventFrontmatter }

  return matter
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

  // const highlighter = await getHighlighter({ theme: 'material-palenight' })

  return compile(file, {
    outputFormat: 'function-body',
    useDynamicImport: false,
    remarkPlugins: [withGitHubMarkdown, withFootnotes],
    rehypePlugins: [
      // [withSyntaxHighlighting, { highlighter }],
      withNoReferrerLinks,
      // withLazyLoadingImages,
    ],
  })
}

/**
 * Cache for event metadata.
 */
const eventCache: Record<
  Locale,
  Map<string, Promise<[VFile, EventPreviewMetadata]>>
> = {
  en: new Map(),
}

/**
 * Caches event metadata and vfile.
 *
 * VFile must be cached as well because event body is stripped of frontmatter.
 */
async function readFileAndGetEventMetadata(id: ID, locale: Locale) {
  const cache = eventCache[locale]

  if (!cache.has(id)) {
    cache.set(
      id,
      getEventFile(id, locale).then(async (file) => {
        const metadata = await getEventMetadata(file, locale)
        return [file, metadata]
      }),
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return cache.get(id)!
}

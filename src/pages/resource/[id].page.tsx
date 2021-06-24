import type { ParsedUrlQuery } from 'querystring'

import { JsonLd } from '@stefanprobst/next-page-metadata'
import cx from 'clsx'
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import Link from 'next/link'
import { Fragment } from 'react'

import type { CollectionPreview } from '@/api/cms/collection'
import type { Event as EventData } from '@/api/cms/event'
import { getEventIds, getEventById } from '@/api/cms/event'
import type { Person } from '@/api/cms/person'
import type { Post as PostData, PostPreview } from '@/api/cms/post'
import { getPostById, getPostFilePath, getPostIds } from '@/api/cms/post'
import { getCollectionPreviewsByResourceId } from '@/api/cms/queries/collection'
import { getPostPreviewsByTagId } from '@/api/cms/queries/post'
import { getLastUpdatedTimestamp } from '@/api/github'
import { Svg as CurriculumIcon } from '@/assets/icons/curriculum.svg'
import { FloatingTableOfContentsButton } from '@/common/FloatingTableOfContentsButton'
import { Icon } from '@/common/Icon'
import { PageContent } from '@/common/PageContent'
import { TableOfContents } from '@/common/TableOfContents'
import { Event } from '@/event/Event'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import { routes } from '@/navigation/routes.config'
import { ContentTypeIcon } from '@/post/ContentTypeIcon'
import { Post } from '@/post/Post'
import { getFullName } from '@/utils/getFullName'
import { pickRandom } from '@/utils/pickRandom'
import type { ISODateString } from '@/utils/ts/aliases'
import { url as siteUrl } from '~/config/site.config'

const RELATED_POSTS_COUNT = 4

export interface ResourcePageParams extends ParsedUrlQuery {
  id: string
}

export interface ResourcePageProps {
  dictionary: Dictionary
  resource: PostData | EventData
  related: Array<PostPreview>
  curricula: Array<CollectionPreview>
  lastUpdatedAt: ISODateString | null
}

/**
 * Creates page for every resource (post or event).
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<ResourcePageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const postIds = await getPostIds(locale)
        const eventIds = await getEventIds(locale)
        const ids = [...postIds, ...eventIds]

        return ids.map((id) => {
          return {
            params: { id },
            locale,
          }
        })
      }),
    )
  ).flat()

  return {
    paths,
    fallback: false,
  }
}

/**
 * Provides resource (post or event) content and metadata, and translations for resource (post or event) page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<ResourcePageParams>,
): Promise<GetStaticPropsResult<ResourcePageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const { id } = context.params as ResourcePageParams
  /**
   * FIXME: We map both posts and events to `/resource/:id`, which is not great.
   * It means we could have id clashes, and also requires this conditional
   * acrobatics (because we cannot pass `type` from `getStaticPaths`).
   *
   * Alternatively, generate rewrites in a postbuild script from /resource/some-id to /resource/events/some-id,
   * and put events in a separate src/pages/resources/events/[id].tsx.
   *
   * Better would be `/resource/:content-type/:id`, which would also make it more clear
   * where "events" fit into the data-model (currently they are both content-type and category/source).
   */
  let resource
  let related: Array<PostPreview> = []
  let curricula: Array<CollectionPreview> = []
  try {
    resource = await getPostById(id, locale)

    related = pickRandom(
      (
        await Promise.all(
          resource.data.metadata.tags.map((tag) => {
            return getPostPreviewsByTagId(tag.id, locale)
          }),
        )
      )
        .flat()
        .filter((resource) => resource.id !== id),
      RELATED_POSTS_COUNT,
    )

    curricula = await getCollectionPreviewsByResourceId(id, locale)
  } catch {
    resource = await getEventById(id, locale)
  }

  const lastUpdatedAt = await getLastUpdatedTimestamp(
    getPostFilePath(id, locale),
  )

  return {
    props: {
      dictionary,
      resource,
      related,
      curricula,
      lastUpdatedAt,
    },
  }
}

/**
 * Resource page.
 */
export default function ResourcePage(props: ResourcePageProps): JSX.Element {
  if (props.resource.data.metadata.type.id === 'event') {
    return <EventPage {...(props as EventPageProps)} />
  }

  return <PostPage {...(props as PostPageProps)} />
}

type EventPageProps = Exclude<ResourcePageProps, 'resource'> & {
  resource: EventData
}

/**
 * Event page.
 */
function EventPage(props: EventPageProps) {
  const { resource: event, lastUpdatedAt } = props
  const { metadata } = event.data

  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  return (
    <Fragment>
      <Metadata
        title={metadata.title}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <JsonLd
        // TODO:
        schema={{
          '@type': 'Article',
        }}
      />
      <Event event={event} lastUpdatedAt={lastUpdatedAt} />
    </Fragment>
  )
}

type PostPageProps = Exclude<ResourcePageProps, 'resource'> & {
  resource: PostData
}

/**
 * Post page.
 */
function PostPage(props: PostPageProps) {
  const { resource: post, related, curricula, lastUpdatedAt } = props
  const { metadata, toc } = post.data

  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  return (
    <Fragment>
      <Metadata
        title={metadata.title}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <JsonLd
        // TODO:
        schema={{
          '@type': 'Article',
        }}
      />
      <PageContent className="grid w-full max-w-screen-lg px-10 py-16 mx-auto space-y-10 2xl:space-y-0 2xl:grid-cols-content 2xl:gap-x-10 2xl:max-w-none">
        <aside
          className="sticky hidden w-full max-w-xs max-h-screen px-10 space-y-10 overflow-y-auto text-sm 2xl:justify-self-end top-24 2xl:block text-neutral-500"
          style={{
            maxHeight: 'calc(100vh - 12px - var(--page-header-height))',
          }}
        >
          <CiteAs id={post.id} metadata={metadata} />
          <Curricula curricula={curricula} />
          <ReUseConditions />
        </aside>
        <div className="min-w-0 space-y-8">
          <Post post={post} lastUpdatedAt={lastUpdatedAt} />
          <div className="w-full mx-auto space-y-8 2xl:hidden max-w-80ch">
            <CiteAs
              id={post.id}
              metadata={metadata}
              className="text-sm text-neutral-500"
            />
            <Curricula
              curricula={curricula}
              className="text-sm text-neutral-500"
            />
            <ReUseConditions className="text-sm text-neutral-500" />
          </div>
          <div className="w-full mx-auto space-y-8 max-w-80ch">
            <div className="space-y-1.5 mt-8 text-sm text-neutral-500">
              <h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">
                Related resources
              </h2>
              <ul>
                {related.map((resource) => {
                  return (
                    <li key={resource.id}>
                      <Link href={routes.resource(resource.id)}>
                        <a className="flex items-center transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                          <ContentTypeIcon
                            type={resource.type.id}
                            className="w-3 h-3 mr-1.5 text-primary-600 flex-shrink-0"
                          />
                          <span>{resource.title}</span>
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
        {metadata.toc === true && toc.length > 0 ? (
          <Fragment>
            <aside
              className="sticky hidden max-w-xs max-h-screen px-10 overflow-y-auto text-sm top-24 2xl:block text-neutral-500"
              style={{
                maxHeight: 'calc(100vh - 12px - var(--page-header-height))',
              }}
            >
              <TableOfContents
                toc={toc}
                title={
                  <h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">{`Table of contents`}</h2>
                }
                className="space-y-2"
              />
            </aside>
            <FloatingTableOfContentsButton toc={toc} />
          </Fragment>
        ) : null}
      </PageContent>
    </Fragment>
  )
}
interface CiteAsProps {
  id: PostData['id']
  metadata: PostData['data']['metadata']
  className?: string
}

/**
 * Citation.
 */
function CiteAs(props: CiteAsProps) {
  const citation = getCitation(props.id, props.metadata)

  function onClick() {
    navigator.clipboard.writeText(citation)
  }

  return (
    <div className={cx('space-y-1.5', props.className)}>
      <h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">
        Cite as
      </h2>
      <p>{citation}</p>
      <button
        onClick={onClick}
        className="px-3 py-1 text-xs font-medium transition border rounded-full border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
      >
        Copy citation
      </button>
    </div>
  )
}

/**
 * Returns citation.
 */
function getCitation(
  id: PostData['id'],
  metadata: PostData['data']['metadata'],
) {
  function createNameList(persons: Array<Person>) {
    return persons
      .map((person) => getFullName(person))
      .join(', ')
      .replace(/,(?!.*,)/gim, ' and')
  }

  const authors = createNameList([
    ...metadata.authors,
    ...(metadata.contributors ?? []),
  ])

  const editors =
    Array.isArray(metadata.editors) && metadata.editors.length > 0
      ? `Edited by ${createNameList(metadata.editors)}. `
      : ''

  const date =
    metadata.remote?.date !== undefined && metadata.remote.date.length > 0
      ? metadata.remote.date
      : metadata.date
  const year = ` (${new Date(date).getFullYear()}). `

  const title = metadata.title.slice(-1).match(/[!?]/)
    ? metadata.title + ' '
    : metadata.title + '. '

  const version = metadata.version ? `Version ${metadata.version}. ` : ''

  const publisher =
    metadata.remote?.publisher !== undefined
      ? metadata.remote.publisher + '. '
      : metadata.remote?.url !== undefined
      ? metadata.categories
          .filter((cat) => cat.id !== 'dariah')
          .map((cat) => cat.host) + '. '
      : 'DARIAH-Campus. '

  const contentType = `[${metadata.type.name}]. `

  const url =
    metadata.remote?.url !== undefined
      ? metadata.remote.url
      : String(new URL(routes.resource(id).pathname, siteUrl))

  const citation =
    authors + year + title + version + editors + publisher + contentType + url

  return citation
}

interface ReUseConditionsProps {
  className?: string
}

/**
 * Reuse conditions.
 */
function ReUseConditions(props: ReUseConditionsProps) {
  return (
    <div className={cx('space-y-1.5', props.className)}>
      <h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">
        Reuse conditions
      </h2>
      <p>
        Resources hosted on DARIAH-Campus are subjects to the{' '}
        <Link href={routes.docs('reuse-charter')}>
          <a className="transition rounded text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
            DARIAH-Campus Training Materials Reuse Charter
          </a>
        </Link>
      </p>
    </div>
  )
}

interface CurriculaProps {
  curricula: Array<CollectionPreview>
  className?: string
}

/**
 * Curricula which include this resource.
 */
function Curricula(props: CurriculaProps) {
  if (props.curricula.length === 0) return null

  return (
    <div className={cx('space-y-1.5', props.className)}>
      <h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">
        Curricula
      </h2>
      <p>This resource is part of these curricula:</p>
      <ul>
        {props.curricula.map((curriculum) => {
          return (
            <li key={curriculum.id}>
              <Link href={routes.collection(curriculum.id)}>
                <a className="flex items-center transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                  <Icon
                    icon={CurriculumIcon}
                    className="w-4 h-4 text-primary-600 mr-1.5"
                  />
                  <span>{curriculum.title}</span>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

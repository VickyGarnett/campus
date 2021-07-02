import type { ParsedUrlQuery } from 'querystring'

import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import Image from 'next/image'
import { Fragment } from 'react'

import type { Person as PersonData } from '@/api/cms/person'
import { getPersonById, getPersonIds } from '@/api/cms/person'
import type { PostPreview } from '@/api/cms/post'
import { getPostPreviewsByAuthorId } from '@/api/cms/queries/post'
import { Svg as EmailIcon } from '@/assets/icons/email.svg'
import { Svg as GlobeIcon } from '@/assets/icons/globe.svg'
import { Svg as OrcidIcon } from '@/assets/icons/orcid.svg'
import { Svg as TwitterIcon } from '@/assets/icons/twitter.svg'
import { getPageRange, paginate } from '@/cms/paginate'
import type { Page } from '@/cms/paginate'
import { Icon } from '@/common/Icon'
import { PageContent } from '@/common/PageContent'
import { Pagination } from '@/common/Pagination'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import { routes } from '@/navigation/routes.config'
import { PostsList } from '@/post/PostsList'
import { createUrl } from '@/utils/createUrl'
import { getFullName } from '@/utils/getFullName'

const pageSize = 12

export interface AuthorPageParams extends ParsedUrlQuery {
  id: string
  page: string
}

export interface AuthorPageProps {
  dictionary: Dictionary
  author: PersonData
  posts: Page<PostPreview>
}

/**
 * Creates page for every person.
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<AuthorPageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const ids = await getPersonIds(locale)
        return (
          await Promise.all(
            ids.map(async (id) => {
              const posts = await getPostPreviewsByAuthorId(id, locale)
              const pages = getPageRange(posts, pageSize)
              return pages.map((page) => {
                return {
                  params: { id, page: String(page) },
                  locale,
                }
              })
            }),
          )
        ).flat()
      }),
    )
  ).flat()

  return {
    paths,
    fallback: false,
  }
}

/**
 * Provides person metadata, metadata for posts authored by that person and
 * translations for person page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<AuthorPageParams>,
): Promise<GetStaticPropsResult<AuthorPageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const { id } = context.params as AuthorPageParams
  const author = await getPersonById(id, locale)

  const page = Number(context.params?.page)
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const posts = paginate(await getPostPreviewsByAuthorId(id, locale), pageSize)[
    page - 1
  ]!

  return {
    props: {
      dictionary,
      author,
      posts,
    },
  }
}

/**
 * Author page.
 */
export default function AuthorPage(props: AuthorPageProps): JSX.Element {
  const { author, posts } = props

  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  const fullName = getFullName(author)

  return (
    <Fragment>
      <Metadata
        title={fullName}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <PageContent className="w-full max-w-screen-xl px-10 py-16 mx-auto space-y-10">
        <div className="flex items-center justify-center space-x-4">
          {author.avatar != null ? (
            <div className="w-16 h-16 border-2 rounded-full border-primary-600">
              <Image
                src={author.avatar}
                alt=""
                className="w-16 h-16 rounded-full"
                width={64}
                height={64}
                objectFit="cover"
                layout="fixed"
              />
            </div>
          ) : null}
          <h1 className="text-4.5xl font-bold text-center">{fullName}</h1>
        </div>
        <p className="text-lg text-center text-neutral-500">
          {author.description}
        </p>
        <dl className="flex items-center justify-center space-x-4 font-medium text-neutral-500">
          {author.email !== undefined ? (
            <div>
              <dt className="sr-only">Email</dt>
              <dd>
                <a
                  href={`mailto:${author.email}`}
                  className="flex items-center space-x-1"
                >
                  <Icon icon={EmailIcon} className="w-4 h-4" />
                  <span>{author.email}</span>
                </a>
              </dd>
            </div>
          ) : null}
          {author.website !== undefined ? (
            <div>
              <dt className="sr-only">Website</dt>
              <dd>
                <a
                  href={author.website}
                  className="flex items-center space-x-1"
                >
                  <Icon icon={GlobeIcon} className="w-4 h-4" />
                  <span>{author.website}</span>
                </a>
              </dd>
            </div>
          ) : null}
          {author.twitter !== undefined ? (
            <div>
              <dt className="sr-only">Twitter</dt>
              <dd>
                <a
                  href={String(
                    createUrl({
                      path: author.twitter,
                      baseUrl: 'https://twitter.com',
                    }),
                  )}
                  className="flex items-center space-x-1"
                >
                  <Icon icon={TwitterIcon} className="w-4 h-4" />
                  <span>{author.twitter}</span>
                </a>
              </dd>
            </div>
          ) : null}
          {author.orcid !== undefined ? (
            <div>
              <dt className="sr-only">ORCID</dt>
              <dd>
                <a
                  href={String(
                    createUrl({
                      path: author.orcid,
                      baseUrl: 'https://orcid.org',
                    }),
                  )}
                  className="flex items-center space-x-1"
                >
                  <Icon icon={OrcidIcon} className="w-4 h-4" />
                  <span>{author.orcid}</span>
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
        <section className="space-y-5">
          <h2 className="sr-only">Posts</h2>
          <PostsList posts={posts.items} />
          <Pagination
            page={posts.page}
            pages={posts.pages}
            href={(page) => routes.author(author.id, page)}
          />
        </section>
      </PageContent>
    </Fragment>
  )
}

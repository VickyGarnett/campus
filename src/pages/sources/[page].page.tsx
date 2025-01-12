import type { ParsedUrlQuery } from 'querystring'

import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import Link from 'next/link'
import { Fragment } from 'react'

import type { Category } from '@/api/cms/category'
import { getCategories, getCategoryIds } from '@/api/cms/category'
import { getEventPreviews } from '@/api/cms/event'
import { getPostPreviewsByCategoryId } from '@/api/cms/queries/post'
import type { Page } from '@/cms/paginate'
import { getPageRange, paginate } from '@/cms/paginate'
import { PageContent } from '@/common/PageContent'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import { routes } from '@/navigation/routes.config'

const pageSize = 12

export interface CategoriesPageParams extends ParsedUrlQuery {
  page: string
}

export interface CategoriesPageProps {
  dictionary: Dictionary
  categories: Page<Category & { posts: number }>
}

/**
 * Creates categories pages.
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<CategoriesPageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const ids = await getCategoryIds(locale)
        const pages = getPageRange(ids, pageSize)
        return pages.map((page) => {
          return {
            params: { page: String(page) },
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
 * Provides metadata and translations for categories page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<CategoriesPageParams>,
): Promise<GetStaticPropsResult<CategoriesPageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const page = Number(context.params?.page)
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const categories = paginate(await getCategories(locale), pageSize)[page - 1]!
  const categoriesWithPostCount = (
    await Promise.all(
      categories.items.map(async (category) => {
        const resourcecsWithCategory =
          category.id === 'events'
            ? await getEventPreviews(locale)
            : await getPostPreviewsByCategoryId(category.id, locale)
        return {
          ...category,
          posts: resourcecsWithCategory.length,
        }
      }),
    )
  ).filter((category) => category.posts > 0) // FIXME: paginate after filtering - needs caching!

  return {
    props: {
      dictionary,
      categories: { ...categories, items: categoriesWithPostCount },
    },
  }
}

/**
 * Categories page.
 */
export default function CategoriesPage(
  props: CategoriesPageProps,
): JSX.Element {
  const { categories } = props

  const { t } = useI18n()
  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  return (
    <Fragment>
      <Metadata
        title={t('common.page.sources')}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <PageContent className="flex flex-col w-full max-w-screen-xl px-10 py-16 mx-auto space-y-10">
        <h1 className="text-4.5xl font-bold text-center">Sources</h1>
        <p className="text-lg text-center text-neutral-500">
          DARIAH learning resources don&apos;t all live in one place. Here you
          can explore our materials based on the context in which they were
          produced.
        </p>
        <section>
          <ul className="grid gap-8 lg:grid-cols-2">
            {categories.items.map((category) => {
              const href = routes.source(category.id)

              return (
                <li key={category.id}>
                  <article className="flex flex-col h-full overflow-hidden rounded-xl shadow-card-md">
                    {category.image !== undefined ? (
                      <Link href={href}>
                        <a
                          tabIndex={-1}
                          className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
                        >
                          <img
                            src={category.image}
                            alt=""
                            loading="lazy"
                            className="object-cover w-full h-96"
                          />
                        </a>
                      </Link>
                    ) : null}
                    <div className="flex-1 p-10 space-y-4">
                      <Link href={href}>
                        <a className="block transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                          <h2 className="text-2xl font-bold">
                            {category.name}
                          </h2>
                        </a>
                      </Link>
                      <p className="leading-7">{category.description}</p>
                    </div>
                    <footer className="flex items-center justify-between px-10 py-8 bg-neutral-100">
                      <span>{category.posts} Resources</span>
                      <Link href={href}>
                        <a
                          tabIndex={-1}
                          className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
                        >
                          Read more &rarr;
                        </a>
                      </Link>
                    </footer>
                  </article>
                </li>
              )
            })}
          </ul>
        </section>
      </PageContent>
    </Fragment>
  )
}

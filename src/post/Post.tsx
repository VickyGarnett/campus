import Image from 'next/image'
import Link from 'next/link'
import { createElement } from 'react'

import type { Post as PostData } from '@/api/cms/post'
import { Svg as AvatarIcon } from '@/assets/icons/avatar.svg'
import { Svg as FacebookIcon } from '@/assets/icons/facebook.svg'
import { Svg as PencilIcon } from '@/assets/icons/pencil.svg'
import { Svg as TwitterIcon } from '@/assets/icons/twitter.svg'
import { Icon } from '@/common/Icon'
import { useI18n } from '@/i18n/useI18n'
import { Mdx as PostContent } from '@/mdx/Mdx'
import type { ComponentMap } from '@/mdx/components'
import { useSiteMetadata } from '@/metadata/useSiteMetadata'
import { routes } from '@/navigation/routes.config'
import { EditLink } from '@/post/EditLink'
import { ExternalResource } from '@/post/ExternalResource'
import { SideNote } from '@/post/SideNote'
import { VideoCard } from '@/post/VideoCard'
import { Quiz } from '@/post/quiz/Quiz'
import { createUrl } from '@/utils/createUrl'
import { getDate } from '@/utils/getDate'
import { getFullName } from '@/utils/getFullName'
import type { ISODateString } from '@/utils/ts/aliases'

const legacyComponents: ComponentMap = {
  CTA: ExternalResource,
  Panel: function Panel(props) {
    return createElement(SideNote, { type: 'info', ...props })
  },
}

const components: ComponentMap = {
  ...legacyComponents,
  ExternalResource,
  SideNote,
  Quiz,
  VideoCard,
}

export interface PostProps {
  post: PostData
  lastUpdatedAt: ISODateString | null
  isPreview?: boolean
}

export function Post(props: PostProps): JSX.Element {
  const { post, lastUpdatedAt, isPreview } = props
  const { metadata } = post.data
  const { title, date, authors, tags = [], categories: sources = [] } = metadata

  const { formatDate } = useI18n()

  const publishDate = getDate(date)

  return (
    <article className="w-full mx-auto space-y-16 max-w-80ch">
      <header className="space-y-10">
        <h1 className="font-bold text-4.5xl text-center">{title}</h1>
        <dl className="grid gap-4 text-sm xs:grid-cols-2 text-neutral-500">
          <div className="space-y-1">
            {authors.length > 0 ? (
              <div>
                <dt className="sr-only">Authors</dt>
                <dd>
                  <ul className="space-y-2">
                    {authors.map((author) => {
                      return (
                        <li key={author.id}>
                          <div className="flex items-center space-x-2">
                            {author.avatar !== undefined ? (
                              <Image
                                src={author.avatar}
                                alt=""
                                className="w-8 h-8 rounded-full"
                                width={32}
                                height={32}
                                objectFit="cover"
                                layout="fixed"
                              />
                            ) : (
                              <Icon
                                icon={AvatarIcon}
                                className="object-cover w-8 h-8 rounded-full text-primary-600"
                              />
                            )}
                            <Link href={routes.author(author.id)}>
                              <a className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                                <span>{getFullName(author)}</span>
                              </a>
                            </Link>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </dd>
              </div>
            ) : null}
          </div>
          <div className="space-y-1 text-right">
            {publishDate != null ? (
              <div>
                <dt className="sr-only">Publish date</dt>
                <dd>
                  <time dateTime={date}>
                    {formatDate(publishDate, undefined, {
                      dateStyle: 'medium',
                    })}
                  </time>
                </dd>
              </div>
            ) : null}
            {sources.length > 0 ? (
              <div className="space-x-2">
                <dt className="inline">Sources:</dt>
                <dd className="inline">
                  <ul className="inline">
                    {sources.map((source, index) => {
                      return (
                        <li key={source.id} className="inline">
                          <Link href={routes.source(source.id)}>
                            <a className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                              <span>{source.name}</span>
                            </a>
                          </Link>
                          {index !== sources.length - 1 ? ', ' : null}
                        </li>
                      )
                    })}
                  </ul>
                </dd>
              </div>
            ) : null}
            {tags.length > 0 ? (
              <div className="space-x-2">
                <dt className="inline">Topics:</dt>
                <dd className="inline">
                  <ul className="inline">
                    {tags.map((tag, index) => {
                      return (
                        <li key={tag.id} className="inline">
                          <Link href={routes.tag(tag.id)}>
                            <a className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                              <span
                                className={index !== 0 ? 'ml-1' : undefined}
                              >
                                {tag.name}
                              </span>
                            </a>
                          </Link>
                          {index !== tags.length - 1 ? ', ' : null}
                        </li>
                      )
                    })}
                  </ul>
                </dd>
              </div>
            ) : null}
          </div>
        </dl>
      </header>
      <div className="prose max-w-none">
        {metadata.featuredImage != null ? (
          <div className="mb-8 aspect-w-16 aspect-h-9">
            {/* FIXME: next/image does not support blob */}
            {metadata.featuredImage.startsWith('blob:') ? (
              <img
                src={metadata.featuredImage}
                alt=""
                loading="lazy"
                className="object-cover"
              />
            ) : (
              <Image
                src={metadata.featuredImage}
                alt=""
                layout="fill"
                sizes="720px"
                objectFit="cover"
              />
            )}
          </div>
        ) : null}
        <PostContent {...post} components={components} />
      </div>
      <footer>
        {isPreview === true ? null : <SocialShareLinks post={post} />}
        {lastUpdatedAt != null ? (
          <p className="text-sm text-right text-neutral-500">
            <span>Last updated: </span>
            <time dateTime={lastUpdatedAt}>
              {formatDate(new Date(lastUpdatedAt), undefined, {
                dateStyle: 'medium',
              })}
            </time>
          </p>
        ) : null}
        {isPreview !== true ? (
          <EditLink
            collection="resources"
            id={post.id}
            className="transition text-sm flex justify-end items-center space-x-1.5 text-neutral-500 hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600 rounded"
          >
            <Icon icon={PencilIcon} className="w-4 h-4" />
            <span className="text-right">Suggest changes to resource</span>
          </EditLink>
        ) : null}
        <div className="space-y-1.5 mt-8 text-sm text-neutral-500">
          <h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">
            Full metadata
          </h2>
          <dl>
            <div className="flex space-x-1">
              <dt>Title:</dt>
              <dd>{title}</dd>
            </div>
            <div className="flex space-x-1">
              <dt>Authors:</dt>
              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
              <dd>{authors?.map(getFullName).join(', ')}</dd>
            </div>
            {metadata.domain != null ? (
              <div className="flex space-x-1">
                <dt>Domain:</dt>
                <dd>{metadata.domain}</dd>
              </div>
            ) : null}
            <div className="flex space-x-1">
              <dt>Language:</dt>
              <dd>{metadata.lang}</dd>
            </div>
            <div className="flex space-x-1">
              <dt>Published:</dt>
              <dd>{publishDate == null ? null : formatDate(publishDate)}</dd>
            </div>
            <div className="flex space-x-1">
              <dt>Licence:</dt>
              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
              <dd>{metadata.licence?.name}</dd>
            </div>
            <div className="flex space-x-1">
              <dt>Content type:</dt>
              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
              <dd>{metadata.type?.name}</dd>
            </div>
            <div className="flex space-x-1">
              <dt>Sources:</dt>
              <dd>
                {metadata.categories
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  ?.map((category) => category.name)
                  .join(', ')}
              </dd>
            </div>
            <div className="flex space-x-1">
              <dt>Topics:</dt>
              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
              <dd>{metadata.tags?.map((tag) => tag.name).join(', ')}</dd>
            </div>
            <div className="flex space-x-1">
              <dt>Version:</dt>
              <dd>{metadata.version}</dd>
            </div>
          </dl>
        </div>
      </footer>
    </article>
  )
}

interface SocialShareLinks {
  post: PostProps['post']
}

function SocialShareLinks(props: SocialShareLinks) {
  const { url: siteUrl, twitter } = useSiteMetadata()

  const { post } = props
  const { data, id } = post
  const { metadata } = data

  const url = String(
    createUrl({
      baseUrl: siteUrl,
      path: routes.resource(id).pathname,
    }),
  )

  return (
    <div className="flex items-center justify-center my-8 space-x-4 text-neutral-500">
      <Link
        href={String(
          createUrl({
            baseUrl: 'https://www.twitter.com',
            path: '/intent/tweet',
            query: {
              text: metadata.title,
              url,
              via: twitter,
              related:
                twitter != null
                  ? String(
                      createUrl({
                        baseUrl: 'https://www.twitter.com',
                        path: twitter,
                      }),
                    )
                  : undefined,
            },
          }),
        )}
      >
        <a className="transition rounded-full hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
          <Icon icon={TwitterIcon} />
          <span className="sr-only">Share link on Twitter</span>
        </a>
      </Link>
      <Link
        href={String(
          createUrl({
            baseUrl: 'https://www.facebook.com',
            path: '/sharer/sharer.php',
            query: {
              u: url,
              title: metadata.title,
            },
          }),
        )}
      >
        <a className="transition rounded-full hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
          <Icon icon={FacebookIcon} />
          <span className="sr-only">Share link on Facebook</span>
        </a>
      </Link>
    </div>
  )
}

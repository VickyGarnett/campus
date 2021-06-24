import '@reach/dialog/styles.css'

import type { SearchResponse } from '@algolia/client-search'
import { DialogContent, DialogOverlay } from '@reach/dialog'
import cx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FormEvent } from 'react'
import { Fragment, useState, useEffect } from 'react'

import { getSearchIndex } from '@/api/algolia'
import { Svg as CloseIcon } from '@/assets/icons/close.svg'
import { Svg as SearchIcon } from '@/assets/icons/search.svg'
import { Icon } from '@/common/Icon'
import { useDialogState } from '@/common/useDialogState'
import { routes } from '@/navigation/routes.config'
import { getFullName } from '@/utils/getFullName'
import type { ISODateString } from '@/utils/ts/aliases'

const searchIndex = getSearchIndex()

interface SearchResult {
  objectID: string
  id: string
  kind: 'resource' | 'event' | 'collection'
  title: string
  date: ISODateString
  abstract: string
  authors: Array<{ id: string; firstName: string; lastName: string }>
  tags: Array<{ id: string; name: string }>
}

export function SearchBox(): JSX.Element {
  const dialog = useDialogState()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Array<SearchResult>>([])

  useEffect(() => {
    let wasCanceled = false

    async function search() {
      const results = await searchIndex.search<SearchResult>(searchTerm, {
        hitsPerPage: 5,
      })
      if (!wasCanceled) {
        setSearchResults(results.hits)
      }
    }

    if (searchTerm.trim().length === 0) {
      setSearchResults([])
    } else {
      search()
    }

    return () => {
      wasCanceled = true
    }
  }, [searchTerm])

  useEffect(() => {
    router.events.on('routeChangeStart', dialog.close)

    return () => {
      router.events.off('routeChangeStart', dialog.close)
    }
  }, [router.events, dialog.close])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const searchTerm = formData.get('searchTerm') as string
    setSearchTerm(searchTerm)
  }

  return (
    <Fragment>
      <button
        className="text-sm inline-flex space-x-1 border border-current items-center py-1.5 px-3 transition rounded-full hover:text-primary-600 focus:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
        onClick={dialog.toggle}
      >
        <Icon icon={SearchIcon} className="" />
        <span>Search</span>
      </button>
      <DialogOverlay
        isOpen={dialog.isOpen}
        onDismiss={dialog.close}
        className="z-20"
      >
        <DialogContent
          aria-label="Search resources"
          className="flex flex-col !p-4 rounded space-y-4 !my-0 md:!my-[10vh] !w-full md:!w-3/4 lg:!w-1/2"
        >
          <button
            onClick={dialog.close}
            className="inline-flex items-center self-end p-1 transition rounded-full hover:text-primary-600 focus:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
          >
            <Icon icon={CloseIcon} className="" />
            <span className="sr-only">Close</span>
          </button>
          <form noValidate onSubmit={onSubmit}>
            <div className="flex space-x-4">
              <label className="flex flex-1 min-w-0">
                <span className="sr-only">Search term</span>
                <input
                  defaultValue={searchTerm}
                  name="searchTerm"
                  type="text"
                  className="flex-1 min-w-0 px-6 py-3 transition border rounded hover:bg-neutral-50 border-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </label>
              <button className="hover:bg-neutral-50 text-primary-600 px-3 py-1.5 text-sm space-x-1 flex items-center transition border rounded border-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                <Icon icon={SearchIcon} className="" />
                <span className="sr-only sm:not-sr-only">Search</span>
              </button>
            </div>
          </form>
          <section>
            <h2 className="sr-only">Search results</h2>
            <ul className="space-y-1">
              {searchResults.map((result, index) => {
                const kinds = {
                  resource: 'resource',
                  event: 'resource',
                  collection: 'collection',
                } as const
                const kind = kinds[result.kind]
                const href = routes[kind](result.id)

                return (
                  <li
                    key={result.id}
                    className={cx(
                      'rounded',
                      index % 2 === 0 && 'bg-neutral-50',
                    )}
                  >
                    <Link href={href}>
                      <a className="relative flex flex-col px-2 py-2 space-y-0.5 text-sm transition rounded hover:bg-neutral-100 focus:bg-neutral-1 00 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                        <dl>
                          <dt className="sr-only">Title</dt>
                          <dd className="font-medium">{result.title}</dd>
                        </dl>
                        {result.authors.length > 0 ? (
                          <dl>
                            <dt className="sr-only">Authors</dt>
                            <dd className="text-neutral-500">
                              {result.authors
                                .map((author) => getFullName(author))
                                .join(', ')}
                            </dd>
                          </dl>
                        ) : null}
                        <dl>
                          <dt className="sr-only">Tags</dt>
                          <dd className="flex flex-wrap gap-1">
                            {result.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="px-1.5 text-xs text-white bg-primary-600 py-0.5 rounded"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </dd>
                        </dl>
                      </a>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        </DialogContent>
      </DialogOverlay>
    </Fragment>
  )
}

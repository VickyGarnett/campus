import { loadEnvConfig } from '@next/env'
import type { SearchIndex } from 'algoliasearch'
import algoliasearch from 'algoliasearch'

import { getCollectionPreviews } from '@/api/cms/collection'
import { getEventPreviews } from '@/api/cms/event'
import { getPostPreviews } from '@/api/cms/post'
import { getFullName } from '@/utils/getFullName'
import { log } from '@/utils/log'
import {
  writeApiKey as _apiKey,
  appId as _appId,
  indexName as _indexName,
} from '~/config/algolia.config'

export function getSearchIndex(name = _indexName): SearchIndex {
  loadEnvConfig(process.cwd(), false)

  const appId = _appId ?? process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
  const apiKey = _apiKey ?? process.env.ALGOLIA_WRITE_API_KEY
  const indexName = name ?? process.env.NEXT_PUBLIC_ALGOLIA_INDEX

  if (appId === undefined) {
    throw new Error('No algolia app id provided.')
  }
  if (apiKey === undefined) {
    throw new Error('No algolia API key provided.')
  }
  if (indexName === undefined) {
    throw new Error('No algolia search index name provided.')
  }

  const searchClient = algoliasearch(appId, apiKey)

  return searchClient.initIndex(indexName)
}

// TODO: should we use UUID for objectID field?
async function main() {
  try {
    const index = getSearchIndex()

    const locale = 'en'

    const posts = (await getPostPreviews(locale)).map((post) => {
      const { abstract, authors, date, id, tags, title, uuid } = post

      const kind = 'resource'

      return {
        kind,
        id,
        uuid,
        objectID: `${kind}-${id}`,
        title,
        date,
        abstract,
        authors: authors.map((author) => {
          return {
            name: getFullName(author),
            id: author.id,
          }
        }),
        tags: tags.map((tag) => {
          return {
            name: tag.name,
            id: tag.id,
          }
        }),
      }
    })

    const curricula = (await getCollectionPreviews(locale)).map(
      (curriculum) => {
        const { abstract, date, id, title, uuid } = curriculum

        const kind = 'curriculum'

        return {
          kind,
          id,
          uuid,
          objectID: `${kind}-${id}`,
          title,
          date,
          abstract,
        }
      },
    )

    const events = (await getEventPreviews(locale)).map((event) => {
      const { abstract, date, id, title, authors, tags, uuid } = event

      const kind = 'event'

      return {
        kind,
        id,
        uuid,
        objectID: `${kind}-${id}`,
        title,
        date,
        abstract,
        authors: authors.map((author) => {
          return {
            name: getFullName(author),
            id: author.id,
          }
        }),
        tags: tags.map((tag) => {
          return {
            name: tag.name,
            id: tag.id,
          }
        }),
      }
    })

    index.saveObjects(posts)
    index.saveObjects(events)
    index.saveObjects(curricula)
    log.success('Successfully updated algolia index.')
  } catch (error) {
    log.warn(error.message)
  }
}

main()

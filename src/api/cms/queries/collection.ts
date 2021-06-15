import type { CollectionPreview } from '@/api/cms/collection'
import { getCollectionPreviews } from '@/api/cms/collection'
import type { Locale } from '@/i18n/i18n.config'

/**
 * Returns collections which include resource id.
 */
export async function getCollectionPreviewsByResourceId(
  id: string,
  locale: Locale,
): Promise<Array<CollectionPreview>> {
  const collectionPreviews = await getCollectionPreviews(locale)

  const collectionsByResource = collectionPreviews.filter((collection) =>
    collection.resources.some((resource) => resource.id === id),
  )

  return collectionsByResource
}

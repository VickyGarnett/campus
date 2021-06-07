import { join } from 'path'

import * as YAML from 'js-yaml'
import type { VFile } from 'vfile'

import type { Locale } from '@/i18n/i18n.config'
import { readFile } from '@/mdx/readFile'
import { readFolder } from '@/mdx/readFolder'
import type { FilePath } from '@/utils/ts/aliases'

const contentTypeFolder = join(process.cwd(), 'content', 'content-types')
const contentTypeExtension = '.yml'

export interface ContentTypeId {
  id: string
}

type ID = ContentTypeId['id']

export interface ContentTypeData {
  name: string
  description: string
}

export interface ContentType extends ContentTypeId, ContentTypeData {}

/**
 * Returns all content type ids (slugs).
 */
export async function getContentTypeIds(
  _locale: Locale,
): Promise<Array<string>> {
  const ids = await readFolder(contentTypeFolder, contentTypeExtension)

  return ids
}

/**
 * Returns content type data.
 */
export async function getContentTypeById(
  id: ID,
  locale: Locale,
): Promise<ContentType> {
  const file = await getContentTypeFile(id, locale)
  const data = await getContentTypeData(file, locale)

  return { id, ...data }
}

/**
 * Returns data for all content types, sorted by name.
 */
export async function getContentTypes(
  locale: Locale,
): Promise<Array<ContentType>> {
  const ids = await getContentTypeIds(locale)

  const data = await Promise.all(
    ids.map(async (id) => {
      return getContentTypeById(id, locale)
    }),
  )

  data.sort((a, b) => a.name.localeCompare(b.name, locale))

  return data
}

/**
 * Reads content type file.
 */
async function getContentTypeFile(id: ID, locale: Locale): Promise<VFile> {
  const filePath = getContentTypeFilePath(id, locale)
  const file = await readFile(filePath)

  return file
}

/**
 * Returns file path for content type.
 */
export function getContentTypeFilePath(id: ID, _locale: Locale): FilePath {
  const filePath = join(contentTypeFolder, id + contentTypeExtension)

  return filePath
}

/**
 * Returns content type data.
 */
async function getContentTypeData(
  file: VFile,
  _locale: Locale,
): Promise<ContentTypeData> {
  const data = YAML.load(String(file), {
    schema: YAML.CORE_SCHEMA,
  }) as ContentTypeData

  return data
}

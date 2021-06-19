import { join } from 'path'

import * as YAML from 'js-yaml'
import type { VFile } from 'vfile'

import type { Locale } from '@/i18n/i18n.config'
import { readFile } from '@/mdx/readFile'
import { readFolder } from '@/mdx/readFolder'
import type { FilePath, URLString } from '@/utils/ts/aliases'

const organisationFolder = join(process.cwd(), 'content', 'organisations')
const organisationExtension = '.yml'

export interface OrganisationId {
  id: string
}

type ID = OrganisationId['id']

export interface OrganisationData {
  name: string
  logo?: FilePath
  url?: URLString
}

export interface Organisation extends OrganisationId, OrganisationData {}

/**
 * Returns all organisation ids (slugs).
 */
export async function getOrganisationIds(
  _locale: Locale,
): Promise<Array<string>> {
  const ids = await readFolder(organisationFolder, organisationExtension)

  return ids
}

/**
 * Returns organisation data.
 */
export async function getOrganisationById(
  id: ID,
  locale: Locale,
): Promise<Organisation> {
  const file = await getOrganisationFile(id, locale)
  const data = await getOrganisationData(file, locale)

  return { id, ...data }
}

/**
 * Returns data for all organisations, sorted by name.
 */
export async function getOrganisations(
  locale: Locale,
): Promise<Array<Organisation>> {
  const ids = await getOrganisationIds(locale)

  const data = await Promise.all(
    ids.map(async (id) => {
      return getOrganisationById(id, locale)
    }),
  )

  data.sort((a, b) => a.name.localeCompare(b.name, locale))

  return data
}

/**
 * Reads organisation file.
 */
async function getOrganisationFile(id: ID, locale: Locale): Promise<VFile> {
  const filePath = getOrganisationFilePath(id, locale)
  const file = await readFile(filePath)

  return file
}

/**
 * Returns file path for organisation.
 */
export function getOrganisationFilePath(id: ID, _locale: Locale): FilePath {
  const filePath = join(organisationFolder, id + organisationExtension)

  return filePath
}

/**
 * Returns organisation data.
 */
async function getOrganisationData(
  file: VFile,
  _locale: Locale,
): Promise<OrganisationData> {
  const data = YAML.load(String(file), {
    schema: YAML.CORE_SCHEMA,
  }) as OrganisationData

  return data
}

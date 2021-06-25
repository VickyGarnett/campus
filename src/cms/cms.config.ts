import type { CmsConfig, CmsCollection } from 'netlify-cms-core'

import { categories } from '@/cms/collections/categories'
import { contentTypes } from '@/cms/collections/contentTypes'
import { events } from '@/cms/collections/events'
import { licences } from '@/cms/collections/licences'
import { organisations } from '@/cms/collections/organisations'
import { people } from '@/cms/collections/people'
import { resourceCollections } from '@/cms/collections/resourceCollections'
import { resources } from '@/cms/collections/resources'
import { tags } from '@/cms/collections/tags'
import { url } from '~/config/site.config'

/**
 * Collections.
 */
export const collections: Record<string, CmsCollection> = {
  people,
  resources,
  resourceCollections,
  events,
  organisations,
  tags,
  categories,
  contentTypes,
  licences,
}

/**
 * Netlify CMS config.
 *
 * @see https://www.netlifycms.org/docs/configuration-options/
 * @see https://www.netlifycms.org/docs/beta-features/
 */
export const config: CmsConfig = {
  site_url: url,
  logo_url: '/assets/images/logo-with-text.svg',
  load_config_file: false,
  local_backend: process.env.NEXT_PUBLIC_LOCAL_CMS === 'true',
  backend: {
    name: 'github',
    repo: 'stefanprobst/campus',
    branch: 'main',
    base_url: url,
    auth_endpoint: 'api/auth/github',
    auth_scope: 'repo', // TODO: 'public_repo'
    open_authoring: true,
    always_fork: true,
    squash_merges: true,
    commit_messages: {
      create: 'content(cms): create {{collection}} "{{slug}}"',
      update: 'content(cms): update {{collection}} "{{slug}}"',
      delete: 'content(cms): delete {{collection}} "{{slug}}"',
      uploadMedia: 'content(cms): upload "{{path}}"',
      deleteMedia: 'content(cms): delete "{{path}}"',
      openAuthoring: '{{message}}',
    },
  },
  publish_mode: 'editorial_workflow',
  media_folder: 'public/assets/images/cms',
  public_folder: '/assets/images/cms',
  editor: { preview: false },
  collections: Object.values(collections),
}

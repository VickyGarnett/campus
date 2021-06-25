import type { CmsCollection } from 'netlify-cms-core'

export const licences: CmsCollection = {
  name: 'licences',
  label: 'Licences',
  label_singular: 'Licence',
  description: 'Licences',
  identifier_field: 'name',
  format: 'yml',
  hide: true,
  create: true,
  delete: false,
  folder: 'content/licences',
  media_folder: '../../{{media_folder}}/licences',
  public_folder: '{{public_folder}}/licences',
  slug: '{{slug}}',
  // preview_path: 'licence/{{slug}}',
  sortable_fields: ['commit_date', 'name'],
  fields: [
    {
      name: 'name',
      label: 'Name',
      hint: '',
    },
    {
      name: 'url',
      label: 'URL',
      hint: '',
      pattern: ['^[a-zA-Z][a-zA-Z\\d+\\-.]*:', 'Must be a valid URL'],
    },
  ],
}

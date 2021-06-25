import type { CmsCollection } from 'netlify-cms-core'

export const contentTypes: CmsCollection = {
  name: 'content-types',
  label: 'Content types',
  label_singular: 'Content type',
  description: 'Content types',
  identifier_field: 'name',
  format: 'yml',
  hide: true,
  create: true,
  delete: false,
  folder: 'content/content-types',
  media_folder: '../../{{media_folder}}/content-types',
  public_folder: '{{public_folder}}/content-types',
  slug: '{{slug}}',
  // preview_path: 'content-type/{{slug}}',
  sortable_fields: ['commit_date', 'name'],
  fields: [
    {
      name: 'name',
      label: 'Name',
      hint: '',
    },
    {
      name: 'description',
      label: 'Description',
      hint: '',
      required: false,
      widget: 'text',
    },
  ],
}

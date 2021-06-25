import type { CmsCollection } from 'netlify-cms-core'

export const tags: CmsCollection = {
  name: 'tags',
  label: 'Tags',
  label_singular: 'Tag',
  description: 'Tags',
  identifier_field: 'name',
  format: 'yml',
  create: true,
  delete: false,
  folder: 'content/tags',
  media_folder: '../../{{media_folder}}/tags',
  public_folder: '{{public_folder}}/tags',
  slug: '{{slug}}',
  preview_path: 'tag/{{slug}}',
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
      widget: 'text',
    },
  ],
}

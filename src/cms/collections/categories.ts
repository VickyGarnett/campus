import type { CmsCollection } from 'netlify-cms-core'

export const categories: CmsCollection = {
  name: 'categories',
  label: 'Categories',
  label_singular: 'Category',
  description: 'Sources',
  identifier_field: 'name',
  format: 'yml',
  hide: true,
  create: true,
  delete: false,
  folder: 'content/categories',
  media_folder: '../../{{media_folder}}/categories',
  public_folder: '{{public_folder}}/categories',
  slug: '{{slug}}',
  preview_path: 'source/{{slug}}',
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
    {
      name: 'host',
      label: 'Host',
      hint: '',
      required: false,
    },
    {
      name: 'image',
      label: 'Image',
      hint: '',
      required: false,
      widget: 'image',
    },
  ],
}

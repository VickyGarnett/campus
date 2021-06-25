import type { CmsCollection } from 'netlify-cms-core'

export const organisations: CmsCollection = {
  name: 'organisations',
  label: 'Organisations',
  label_singular: 'Organisation',
  description: 'Organisations',
  identifier_field: 'name',
  format: 'yml',
  create: true,
  delete: false,
  folder: 'content/organisations',
  media_folder: '../../{{media_folder}}/organisations/{{slug}}',
  public_folder: '{{public_folder}}/organisations/{{slug}}',
  slug: '{{slug}}',
  // preview_path: 'organisation/{{slug}}',
  sortable_fields: ['commit_date', 'name'],
  fields: [
    {
      name: 'name',
      label: 'Name',
      hint: '',
    },
    {
      name: 'logo',
      label: 'Logo',
      hint: '',
      required: false,
      widget: 'image',
    },
    {
      name: 'url',
      label: 'URL',
      hint: '',
      required: false,
      pattern: ['^[a-zA-Z][a-zA-Z\\d+\\-.]*:', 'Must be a valid URL'],
    },
  ],
}

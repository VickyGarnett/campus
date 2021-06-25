import type { CmsCollection } from 'netlify-cms-core'

export const resources: CmsCollection = {
  name: 'resources',
  label: 'Resources',
  label_singular: 'Resource',
  description: 'Resources',
  format: 'frontmatter',
  extension: 'mdx',
  create: true,
  delete: false,
  folder: 'content/resources',
  media_folder: '../../{{media_folder}}/resources/{{slug}}',
  public_folder: '{{public_folder}}/resources/{{slug}}',
  slug: '{{slug}}',
  preview_path: 'resource/{{slug}}',
  editor: { preview: true },
  sortable_fields: ['commit_date', 'date', 'title', 'commit_author'],
  view_groups: [
    {
      label: 'Year',
      field: 'date',
      pattern: '\\d{4}',
    },
  ],
  fields: [
    {
      name: 'title',
      label: 'Title',
      hint: '',
    },
    {
      name: 'shortTitle',
      label: 'Short title',
      hint: '',
      required: false,
    },
    {
      name: 'lang',
      label: 'Language',
      hint: '',
      widget: 'select',
      options: [
        {
          label: 'English',
          value: 'en',
        },
        {
          label: 'Deutsch',
          value: 'de',
        },
      ],
      default: 'en',
    },
    {
      name: 'date',
      label: 'Publication date',
      hint: '',
      widget: 'datetime',
      date_format: 'DD/MM/YYYY',
      time_format: false,
      picker_utc: true,
      default: '',
    },
    {
      name: 'version',
      label: 'Version',
      hint: '',
      default: '1.0.0',
    },
    {
      name: 'authors',
      label: 'Authors',
      hint: '',
      widget: 'relation',
      collection: 'people',
      multiple: true,
      value_field: '{{slug}}',
      search_fields: ['firstName', 'lastName'],
      display_fields: ['{{firstName}} {{lastName}}'],
    },
    {
      name: 'editors',
      label: 'Editors',
      hint: 'Use this field if you had any editors in addition to authors',
      required: false,
      widget: 'relation',
      collection: 'people',
      multiple: true,
      value_field: '{{slug}}',
      search_fields: ['firstName', 'lastName'],
      display_fields: ['{{firstName}} {{lastName}}'],
    },
    {
      name: 'contributors',
      label: 'Contributors',
      hint: 'Use this field if you had any people who made contributions',
      required: false,
      widget: 'relation',
      collection: 'people',
      multiple: true,
      value_field: '{{slug}}',
      search_fields: ['firstName', 'lastName'],
      display_fields: ['{{firstName}} {{lastName}}'],
    },
    {
      name: 'tags',
      label: 'Topics',
      hint: '',
      widget: 'relation',
      collection: 'tags',
      multiple: true,
      value_field: '{{slug}}',
      search_fields: ['name'],
      display_fields: ['name'],
    },
    {
      name: 'categories',
      label: 'Sources',
      hint: '',
      widget: 'relation',
      collection: 'categories',
      multiple: true,
      value_field: '{{slug}}',
      search_fields: ['name'],
      display_fields: ['name'],
      default: ['dariah'],
    },
    {
      name: 'featuredImage',
      label: 'Featured image',
      hint: '',
      required: false,
      widget: 'image',
    },
    {
      name: 'abstract',
      label: 'Abstract',
      hint: 'Provide one or two sentences to briefly describe your resource',
      widget: 'text',
    },
    {
      name: 'body',
      label: 'Content',
      hint: '',
      widget: 'markdown',
      editor_components: [
        'image',
        'code-block',
        'Grid',
        'Video',
        'VideoCard',
        'SideNote',
        'ExternalResource',
        'Quiz',
      ],
    },
    {
      name: 'domain',
      label: 'Domain',
      hint: 'Please select the primary scholarly domain of this resource',
      required: false,
      widget: 'select',
      options: [
        {
          label: 'Social Sciences and Humanities',
          value: 'Social Sciences and Humanities',
        },
      ],
      default: 'Social Sciences and Humanities',
    },
    {
      name: 'targetGroup',
      label: 'Target group',
      hint: 'Please indicate the PRIMARY audience of your resource',
      required: false,
      widget: 'select',
      options: [
        {
          label: 'Data managers',
          value: 'Data managers',
        },
        {
          label: 'Domain researchers',
          value: 'Domain researchers',
        },
        {
          label: 'Data service engineers',
          value: 'Data service engineers',
        },
        {
          label: 'Data scientists/analysts',
          value: 'Data scientists/analysts',
        },
      ],
      default: 'Domain researchers',
    },
    {
      name: 'type',
      label: 'Content type',
      hint: 'This generates an icon, please select the most appropriate for your resource',
      widget: 'relation',
      collection: 'content-types',
      value_field: '{{slug}}',
      search_fields: ['name'],
      display_fields: ['name'],
      default: 'training-module',
    },
    {
      name: 'licence',
      label: 'Licence',
      hint: '',
      widget: 'relation',
      collection: 'licences',
      value_field: '{{slug}}',
      search_fields: ['name'],
      display_fields: ['name'],
      default: 'ccby-4.0',
    },
    {
      name: 'remote',
      label: 'Remote host',
      hint: '',
      required: false,
      widget: 'object',
      fields: [
        {
          name: 'publisher',
          label: 'Publisher',
          hint: '',
          required: false,
        },
        {
          name: 'date',
          label: 'Publication date',
          hint: '',
          required: false,
          widget: 'datetime',
          date_format: 'DD/MM/YYYY',
          time_format: false,
          picker_utc: true,
          default: '',
        },
        {
          name: 'url',
          label: 'URL',
          hint: '',
          required: false,
          pattern: ['^[a-zA-Z][a-zA-Z\\d+\\-.]*:', 'Must be a valid URL'],
        },
      ],
    },
    {
      name: 'toc',
      label: 'Show Table of Contents',
      hint: '',
      required: false,
      widget: 'boolean',
      default: false,
    },
  ],
}
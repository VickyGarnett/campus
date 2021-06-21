import type { CmsConfig, CmsCollection } from 'netlify-cms-core'

import { url } from '~/config/site.config'

/**
 * Collections.
 */
export const collections: Record<string, CmsCollection> = {
  resources: {
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
          'YouTube',
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
  },
  resourceCollections: {
    name: 'resourceCollections',
    label: 'Curricula',
    label_singular: 'Curriculum',
    description: 'Collections of resources',
    format: 'frontmatter',
    extension: 'mdx',
    create: true,
    delete: false,
    folder: 'content/curricula',
    media_folder: '../../{{media_folder}}/curricula/{{slug}}',
    public_folder: '{{public_folder}}/curricula/{{slug}}',
    slug: '{{slug}}',
    preview_path: 'curriculum/{{slug}}',
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
        hint: 'Title of your resource',
      },
      {
        name: 'shortTitle',
        label: 'Short title',
        required: false,
        hint: 'Used in overview page',
      },
      {
        name: 'date',
        label: 'Date',
        hint: 'Date the resource was published on DARIAH-Campus',
        widget: 'datetime',
        date_format: 'DD/MM/YYYY',
        time_format: false,
        picker_utc: true,
        default: '',
      },
      {
        name: 'resources',
        label: 'Resources',
        label_singular: 'Resource',
        hint: 'Resources contained in this collection',
        widget: 'list',
        collapsed: false,
        minimize_collapsed: false,
        summary: '{{fields.post}}',
        min: 1,
        field: {
          name: 'post',
          label: 'Resource',
          widget: 'relation',
          collection: 'resources',
          value_field: '{{slug}}',
          search_fields: ['title'],
          display_fields: ['title'],
        },
      },
      {
        name: 'abstract',
        label: 'Abstract',
        hint: 'Provide one or two sentences to briefly describe the curriculum',
        widget: 'text',
      },
      {
        name: 'body',
        label: 'Content',
        hint: 'Description of the collection',
        widget: 'markdown',
        editor_components: ['image', 'code-block', 'YouTube'],
      },
    ],
  },
  events: {
    name: 'events',
    label: 'Events',
    label_singular: 'Event',
    description: 'Events',
    format: 'frontmatter',
    extension: 'mdx',
    create: true,
    delete: false,
    folder: 'content/events',
    media_folder: '../../{{media_folder}}/events/{{slug}}',
    public_folder: '{{public_folder}}/events/{{slug}}',
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
        name: 'eventType',
        label: 'Event type',
        hint: 'E.g. Winter School',
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
        label: 'Date',
        hint: '',
        widget: 'datetime',
        date_format: 'DD/MM/YYYY',
        time_format: false,
        picker_utc: true,
        default: '',
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
        // hint: '',
        // widget: 'relation',
        // collection: 'categories',
        // multiple: true,
        // value_field: '{{slug}}',
        // search_fields: ['name'],
        // display_fields: ['name'],
        default: ['events'],
        widget: 'hidden',
      },
      {
        name: 'logo',
        label: 'Logo',
        hint: '',
        required: false,
        widget: 'image',
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
        hint: 'Provide one or two sentences to briefly describe the event',
        widget: 'text',
      },
      {
        name: 'authors',
        label: 'Persons responsible for the event',
        hint: '',
        required: false,
        widget: 'relation',
        collection: 'people',
        multiple: true,
        value_field: '{{slug}}',
        search_fields: ['firstName', 'lastName'],
        display_fields: ['{{firstName}} {{lastName}}'],
      },
      {
        name: 'body',
        label: 'Short description',
        widget: 'markdown',
        editor_components: ['image', 'code-block', 'YouTube'],
        hint: '',
      },
      {
        name: 'about',
        label: 'About',
        widget: 'markdown',
        editor_components: ['image'],
        hint: '',
      },
      {
        name: 'prep',
        label: 'Preparation notes',
        widget: 'markdown',
        editor_components: ['image', 'code-block'],
        hint: '',
        required: false,
      },
      {
        name: 'type',
        label: 'Content type',
        // hint: 'This generates an icon, please select the most appropriate for your resource',
        // widget: 'relation',
        // collection: 'content-types',
        // value_field: '{{slug}}',
        // search_fields: ['name'],
        // display_fields: ['name'],
        default: 'event',
        widget: 'hidden',
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
        name: 'partners',
        label: 'Partner organisations',
        label_singular: 'Partner organisation',
        hint: '',
        required: false,
        // widget: 'list',
        // fields: [
        //   {
        //     name: 'name',
        //     label: 'Name',
        //     hint: '',
        //   },
        //   {
        //     name: 'logo',
        //     label: 'Logo',
        //     hint: '',
        //     required: false,
        //     widget: 'image',
        //   },
        //   {
        //     name: 'url',
        //     label: 'URL',
        //     hint: '',
        //     required: false,
        //     pattern: ['^[a-zA-Z][a-zA-Z\\d+\\-.]*:', 'Must be a valid URL'],
        //   },
        // ],
        widget: 'relation',
        collection: 'organisations',
        multiple: true,
        value_field: '{{slug}}',
        search_fields: ['name'],
        display_fields: ['name'],
      },
      {
        name: 'social',
        label: 'Social',
        hint: '',
        required: false,
        widget: 'object',
        collapsed: true,
        fields: [
          {
            name: 'website',
            label: 'Website',
            hint: '',
            required: false,
            pattern: ['^[a-zA-Z][a-zA-Z\\d+\\-.]*:', 'Must be a valid URL'],
          },
          {
            name: 'email',
            label: 'Email',
            hint: '',
            required: false,
            pattern: [
              '^[^\\.\\s@:](?:[^\\s@:]*[^\\s@:\\.])?@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*$',
              'Must be a valid Email address',
            ],
          },
          {
            name: 'twitter',
            label: 'Twitter handle',
            hint: '',
            required: false,
          },
          {
            name: 'flickr',
            label: 'Flickr',
            hint: '',
            required: false,
          },
        ],
      },
      {
        name: 'synthesis',
        label: 'Synthesis',
        hint: '',
        required: false,
        widget: 'file',
        media_folder: '../../{{media_folder}}/../../documents/events/{{slug}}',
        public_folder: '{{public_folder}}/../../documents/events/{{slug}}',
      },
      {
        name: 'sessions',
        label: 'Event sessions',
        label_singular: 'Event session',
        hint: '',
        widget: 'list',
        min: 1,
        fields: [
          {
            name: 'title',
            label: 'Title',
            hint: '',
          },
          // {
          //   name: 'shortTitle',
          //   label: 'Short title',
          //   hint: '',
          //   required: false,
          // },
          {
            name: 'speakers',
            label: 'Speakers',
            hint: '',
            widget: 'relation',
            collection: 'people',
            multiple: true,
            value_field: '{{slug}}',
            search_fields: ['firstName', 'lastName'],
            display_fields: ['{{firstName}} {{lastName}}'],
          },
          {
            name: 'body',
            label: 'Content',
            hint: '',
            widget: 'markdown',
            editor_components: ['image', 'code_block', 'YouTube'],
          },
          {
            name: 'synthesis',
            label: 'Synthesis',
            hint: '',
            required: false,
            widget: 'file',
            media_folder:
              '../../{{media_folder}}/../../documents/events/{{slug}}',
            public_folder: '{{public_folder}}/../../documents/events/{{slug}}',
          },
        ],
      },
    ],
  },
  people: {
    name: 'people',
    label: 'People',
    label_singular: 'Person',
    description: 'Authors, contributors, and editors',
    identifier_field: 'lastName',
    format: 'yml',
    create: true,
    delete: false,
    folder: 'content/people',
    media_folder: '../../{{media_folder}}/people',
    public_folder: '{{public_folder}}/people',
    slug: '{{lastName}}-{{firstName}}',
    preview_path: 'author/{{slug}}',
    summary: '{{firstName}} {{lastName}}',
    sortable_fields: ['commit_date', 'lastName'],
    fields: [
      {
        name: 'firstName',
        label: 'First name',
        hint: '',
      },
      {
        name: 'lastName',
        label: 'Last name',
        hint: '',
      },
      {
        name: 'title',
        label: 'Title',
        hint: '',
        required: false,
      },
      {
        name: 'description',
        label: 'Description',
        hint: '',
        required: false,
        widget: 'text',
      },
      {
        name: 'avatar',
        label: 'Image',
        hint: '',
        required: false,
        widget: 'image',
      },
      {
        name: 'email',
        label: 'Email',
        hint: '',
        required: false,
        pattern: [
          '^[^\\.\\s@:](?:[^\\s@:]*[^\\s@:\\.])?@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*$',
          'Must be a valid Email address',
        ],
      },
      {
        name: 'twitter',
        label: 'Twitter handle',
        hint: '',
        required: false,
      },
      {
        name: 'website',
        label: 'Website',
        hint: '',
        required: false,
      },
      {
        name: 'orcid',
        label: 'ORCID',
        hint: '',
        required: false,
      },
      {
        name: 'linkedin',
        label: 'LinkedIn',
        hint: '',
        required: false,
      },
    ],
  },
  organisations: {
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
  },
  tags: {
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
  },
  categories: {
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
  },
  contentTypes: {
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
  },
  licences: {
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
  },
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
  local_backend: process.env.NODE_ENV !== 'production',
  backend: {
    name: 'github',
    repo: 'stefanprobst/campus',
    branch: 'main',
    base_url: url,
    auth_endpoint: 'api/auth/github',
    auth_scope: 'repo', // TODO: 'public_repo'
    open_authoring: true,
    // @ts-expect-error Missing in upstream types.
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

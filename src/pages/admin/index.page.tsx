import dynamic from 'next/dynamic'
import { Fragment } from 'react'

import { config } from '@/cms/cms.config'
import { Metadata } from '@/metadata/Metadata'

/**
 * Netlify CMS only runs client-side and does not correctly pre-render on the server.
 */
const NetlifyCms = dynamic(
  async () => {
    /**
     * We cannot use `netlify-cms-app/dist/esm` because Next.js does not allow
     * importing css in node modules.
     *
     * TODO: Add custom webpack config to override this in `next.config.js`.
     */
    const { default: Cms } = await import('netlify-cms-app')
    const { nanoid } = await import('nanoid')
    const { ResourcePreview } = await import('@/cms/previews/ResourcePreview')
    const { ResourceCollectionPreview } = await import(
      '@/cms/previews/ResourceCollectionPreview'
    )
    const { EventPreview } = await import('@/cms/previews/EventPreview')

    Cms.init({ config })

    /** Generate UUIDs for resources. */
    Cms.registerEventListener(
      {
        name: 'preSave',
        handler({ entry }) {
          const data = entry.get('data')
          if (
            !['resources', 'resourceCollections', 'events'].includes(
              entry.get('collection'),
            )
          ) {
            return data
          }
          if (data.get('uuid') == null) {
            return data.set('uuid', nanoid())
          }
          return data
        },
      },
      {},
    )

    /**
     * Register preview styles.
     *
     * These are created in a `postbuild` script with `postcss-cli`.
     */
    Cms.registerPreviewStyle(
      'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap',
    )
    Cms.registerPreviewStyle('/assets/cms/tailwind.css')
    Cms.registerPreviewStyle('/assets/cms/index.css')

    /** Register preview templates. */
    Cms.registerPreviewTemplate('resources', ResourcePreview)
    Cms.registerPreviewTemplate(
      'resourceCollections',
      ResourceCollectionPreview,
    )
    Cms.registerPreviewTemplate('events', EventPreview)

    return () => null
  },
  {
    loading: function Loading(props) {
      const { error, pastDelay, retry, timedOut } = props

      const message =
        error != null ? (
          <div>
            Failed to load CMS! <button onClick={retry}>Retry</button>
          </div>
        ) : timedOut === true ? (
          <div>
            Taking a long time to load CMS&hellip;{' '}
            <button onClick={retry}>Retry</button>
          </div>
        ) : pastDelay === true ? (
          <div>Loading CMS&hellip;</div>
        ) : null

      return (
        <div className="grid min-h-screen place-items-center">{message}</div>
      )
    },
    ssr: false,
  },
)

/**
 * Admin page, loads Netlify CMS client-side.
 */
export default function AdminPage(): JSX.Element {
  return (
    <Fragment>
      <Metadata noindex nofollow title="CMS" />
      <div id="nc-root" />
      <style jsx global>
        {`
          /* Temporary workaround to stop tailwind reset bleeding into richtext editor. */
          #nc-root ul {
            list-style: disc;
          }
          #nc-root ol {
            list-style: decimal;
          }
        `}
      </style>
      <NetlifyCms />
    </Fragment>
  )
}

AdminPage.Layout = Fragment

import { Fragment } from 'react'

import { googleAnalyticsId } from '@/analytics/analytics.config'
import { service } from '@/analytics/service'

/**
 * Initializes analytics service on page load in disabled state. Requires explicit opt-in to enable.
 */
export function Analytics(): JSX.Element | null {
  if (
    googleAnalyticsId === undefined ||
    process.env.NODE_ENV !== 'production'
  ) {
    return null
  }

  service.optOut()

  return (
    <Fragment>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}', {
              'transport_type': 'beacon',
              'anonymize_ip': true,
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </Fragment>
  )
}

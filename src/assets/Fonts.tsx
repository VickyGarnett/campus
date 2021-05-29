/* eslint-disable @next/next/no-page-custom-font */
import { Fragment } from 'react'

/**
 * Loads fonts assets.
 */
export function Fonts(): JSX.Element {
  return (
    <Fragment>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap"
        rel="stylesheet"
      />
    </Fragment>
  )
}

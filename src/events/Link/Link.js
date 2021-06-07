import React from 'react'
import PropTypes from 'prop-types'
import { Link as RelativeLink } from 'gatsby'
import clsx from 'clsx'
import { scrollToElement } from 'utils/scroll-to-element'

import styles from './Link.module.css'

// const isAbsoluteUrl = url => {
//   try {
//     new URL(url)
//     return true
//   } catch {
//     return false
//   }
// }
const isAbsoluteUrl = url =>
  url.startsWith('http') || url.startsWith('/static/')

const Link = ({
  activeClassName,
  activeStyle,
  children,
  className,
  href,
  rel,
  to,
  ...rest
}) => {
  if (String(to || href).startsWith('#')) {
    const hash = to || href
    return (
      <a
        className={clsx(styles.link, className)}
        href={hash}
        onClick={() => {
          if (window.location.hash === hash) {
            // we cannot simply event.preventDefault(), because that breaks the
            // slide effect on the events side nav -- so we let the browser scroll,
            // and adjust the scroll position in the next frame
            const el = document.getElementById(hash.slice(1))
            window.requestAnimationFrame(() => {
              window.scrollTo({ top: scrollToElement(el) })
              // and again, since sometimes the first wouldn't work
              window.requestAnimationFrame(() => {
                window.scrollTo({ top: scrollToElement(el) })
              })
            })
          }
        }}
      >
        {children}
      </a>
    )
  }

  if (isAbsoluteUrl(to || href)) {
    /* eslint-disable react/jsx-no-target-blank */
    return (
      <a
        className={clsx(styles.link, className)}
        href={to || href}
        target="_blank"
        rel={['noopener', 'noreferrer', rel].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <RelativeLink
      activeClassName={clsx(styles.activeLink, activeClassName)}
      activeStyle={activeStyle}
      className={clsx(styles.link, className)}
      rel={rel}
      to={to || href}
      {...rest}
    >
      {children}
    </RelativeLink>
  )
}

// Overwrites for posts
export const PostLink = ({ className, to, href, ...rest }) => (
  <Link
    {...rest}
    className={clsx(className, styles.postLink)}
    to={to || href}
  />
)

Link.propTypes = {
  activeClassName: PropTypes.string,
  activeStyle: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
  to: PropTypes.string.isRequired,
}

export default Link

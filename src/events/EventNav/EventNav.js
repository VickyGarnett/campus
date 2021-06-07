import React from 'react'
import { FaFlickr, FaPlayCircle, FaTwitter, FaFilePdf } from 'react-icons/fa'
import clsx from 'clsx'

import styles from './EventNav.module.css'

const EventNav = ({
  download,
  hasAboutOverlay,
  hasPrepOverlay,
  showAboutOverlay,
  showPrepOverlay,
  social,
}) => (
  <div>
    <ul className="home__links">
      {hasAboutOverlay ? (
        <li>
          <button
            onClick={showAboutOverlay}
            className={clsx('link-popin', styles.buttonAsLink)}
          >
            <span>About</span>
          </button>
        </li>
      ) : null}
      {hasPrepOverlay ? (
        <li>
          <button
            onClick={showPrepOverlay}
            className={clsx('link-popin', styles.buttonAsLink)}
          >
            <span>How to prepare</span>
          </button>
        </li>
      ) : null}
      {social.flickr ? (
        <li>
          <a href={social.flickr}>
            <FaFlickr size="0.75em" style={{ marginRight: '1rem' }} />
            <span>See the photos</span>
          </a>
        </li>
      ) : null}
      {social.video ? (
        <li>
          <a href={social.video}>
            <FaPlayCircle size="0.75em" style={{ marginRight: '1rem' }} />
            <span>Watch the video</span>
          </a>
        </li>
      ) : null}
      {social.storify ? (
        <li>
          <a href={social.storify}>
            <FaTwitter size="0.75em" style={{ marginRight: '1rem' }} />
            <span>Read the Storify</span>
          </a>
        </li>
      ) : null}
      {download ? (
        <li className="download">
          <a href={download.publicURL}>
            <FaFilePdf size="0.75em" style={{ marginRight: '1rem' }} />
            <span>
              Download the full synthesis (PDF, {download.prettySize})
            </span>
          </a>
        </li>
      ) : null}
    </ul>

    <p className="home__more">
      You can annotate and discuss all the material here with the{' '}
      <a href="https://hypothes.is/">hypothes.is</a> plugin.
    </p>
  </div>
)

export default EventNav

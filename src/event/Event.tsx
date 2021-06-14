// import '@/event/event.module.css'
import '@reach/dialog/styles.css'

import { DialogContent, DialogOverlay } from '@reach/dialog'
import cx from 'clsx'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import {
  FaEnvelope,
  FaGlobe,
  FaTwitter,
  FaFlickr,
  FaFilePdf,
} from 'react-icons/fa'

import type { Event as EventData } from '@/api/cms/event'
import { Svg as CloseIcon } from '@/assets/icons/close.svg'
import { Icon } from '@/common/Icon'
import { PageContent } from '@/common/PageContent'
import type { DialogState } from '@/common/useDialogState'
import { useDialogState } from '@/common/useDialogState'
import { Mdx as EventContent, Mdx } from '@/mdx/Mdx'
import type { ISODateString } from '@/utils/ts/aliases'

export interface EventProps {
  event: EventData
  lastUpdatedAt: ISODateString | null
  isPreview?: boolean
}

/**
 * Event resource.
 */
export function Event(props: EventProps): JSX.Element {
  const { event, lastUpdatedAt, isPreview } = props
  const { metadata } = event.data

  return (
    <PageContent>
      <EventOverview event={event} />
      <div className="body__borders relative mx-[6.25vw] bg-[#f8f9f9]">
        <EventSessions
          sessions={metadata.sessions}
          //  downloads={downloads}
        />
        {/* <EventSideNav sessions={sessions} /> */}
      </div>
      {/* <EventFooter event={event} /> */}
    </PageContent>
  )
}

interface EventOverviewProps {
  event: EventProps['event']
}

/**
 * Event overview.
 */
function EventOverview(props: EventOverviewProps) {
  const { event } = props
  const { metadata } = event.data
  const {
    about,
    prep,
    featuredImage,
    logo,
    sessions,
    social,
    eventType,
    title,
  } = metadata

  const aboutDialog = useDialogState()
  const prepDialog = useDialogState()

  return (
    <section
      id="body"
      className="home min-h-screen flex flex-col relative px-[6.25vw] bg-[#0d1930]"
    >
      {featuredImage != null ? (
        <div className="absolute inset-0">
          <img
            src={featuredImage}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="bg-gradient-to-b from-transparent via-transparent to-[rgba(0,0,0,0.65)] absolute inset-0" />
        </div>
      ) : null}

      {/* TODO: Missing home__wrapper-1::after for 1px right-border */}
      <div className="home__wrapper-1 flex-1 flex flex-col border-r border-[#d5d8dc] border-opacity-50 relative mr-[3.125vw]">
        <div className="home__wrapper-2 flex-1 flex flex-col justify-center px-[6.25vw] py-[1.5625vw] pr-[3.125vw]">
          <div className="home__wrapper-3 flex justify-between">
            <div className="home__main relative w-2/3">
              {logo != null ? (
                <div className="absolute bottom-full left-[-3.125vw] w-32">
                  <img src={logo} alt="" className="" loading="lazy" />
                </div>
              ) : null}

              <h1 className="text-[#ed6f59] mb-3 text-5xl font-bold">
                {eventType}
              </h1>
              <h2 className="leading-[1.15] py-[0.5vw] px-[0.75vw] uppercase text-white relative bg-[#1e396c] text-2xl font-bold">
                {/* TODO: should be in ::before */}
                <div className="absolute bg-[#ed6f59] w-[3.125vw] h-[3.125vw] right-0 top-0 transform translate-x-1/2 -translate-y-1/2" />
                {title}
              </h2>

              <div className="home__intro bg-[rgba(0,0,0,0.75)] px-[0.75em] py-[0.5em] text-white leading-snug z-10 relative">
                <EventContent
                  {...event}
                  // TODO: components={{ a: Link, h1: EventTitle, h2: EventSubtitle, p: EventIntro }}
                />
              </div>

              <EventToc sessions={sessions} />
            </div>

            <aside className="home__aside w-1/3 flex flex-col justify-between">
              <EventSocialLinks social={social} />
              <EventNav
                hasAboutOverlay={Boolean(metadata.about)}
                hasPrepOverlay={Boolean(metadata.prep)}
                aboutDialog={aboutDialog}
                prepDialog={prepDialog}
                social={metadata.social}
                synthesis={metadata.synthesis}
              />
            </aside>
          </div>
        </div>
      </div>

      {aboutDialog.isOpen ? (
        <EventOverlay content={about.code} onDismiss={aboutDialog.close} />
      ) : null}

      {prepDialog.isOpen && prep != null ? (
        <EventOverlay content={prep.code} onDismiss={prepDialog.close} />
      ) : null}
    </section>
  )
}

interface EventOverlayProps {
  content: string
  onDismiss: () => void
}

/**
 * Event overlay.
 */
function EventOverlay(props: EventOverlayProps) {
  const { content, onDismiss } = props

  return (
    <DialogOverlay onDismiss={onDismiss} className="z-30">
      <DialogContent
        id="eventoverlay"
        // !important to overwrite reach default styles
        className="mx-auto !w-3/4 !my-[3.125vw] !p-0"
      >
        <div className="popin-content flex flex-col relative bg-[#0870ac] shadow-md px-[6.25vw]">
          <button
            onClick={onDismiss}
            className="popin-closer rounded-full text-white text-4xl absolute right-[1.5625vw] top-[1.5625vw] opacity-75 transition duration-[400ms] ease-out hover:opacity-100 hover:duration-150"
          >
            <span className="sr-only">Close</span>
            <Icon icon={CloseIcon} className="" />
          </button>

          <div className="popin-core bg-white px-[6.25vw] py-[3.125vw]">
            <h1
              id="about"
              className="h1 relative text-6xl uppercase mb-20 font-bold"
            >
              {/* TODO: before + after squares */}
              About
            </h1>
            <Mdx
              code={content}
              components={
                {
                  // TODO:
                }
              }
            />
          </div>
        </div>
      </DialogContent>
    </DialogOverlay>
  )
}

interface EventTocProps {
  sessions: EventProps['event']['data']['metadata']['sessions']
}

/**
 * Event table of contents (sessions).
 */
function EventToc(props: EventTocProps) {
  const { sessions } = props

  return (
    <ul className="home__index relative">
      {/* TODO: should be in ::before */}
      <div className="absolute bg-[#ed6f59] w-[6.25vw] h-[6.25vw] left-0 top-0 transform -translate-x-1/2 -translate-y-1/2" />
      {sessions.map((session, index) => (
        <li key={index} className="block mt-[0.5em]">
          <a
            href={`#session-${index + 1}`}
            className="relative text-white leading-[1.15] block"
          >
            <small className="font-bold text-center uppercase bg-[#1e396c] mr-[0.5vw] px-[0.5em] py-[0.25em] inline-block w-[6.5vw] text-base leading-none">
              <span>Session {index + 1}</span>
            </small>
            <strong className="text-2xl font-normal transition duration-[400ms] hover:duration-150 ease-out hover:text-[#ed6f59]">
              {session.title}
            </strong>
          </a>
        </li>
      ))}
    </ul>
  )
}

interface EventSocialLinksProps {
  social: EventProps['event']['data']['metadata']['social']
}

/**
 * Event social media links.
 */
function EventSocialLinks(props: EventSocialLinksProps) {
  const { social } = props

  if (social == null) return null

  return (
    <ul className="home__share relative text-right right-[-8.0625vw] top-[3.125vw]">
      {social.twitter != null ? (
        <li className="mr-2.5 mb-[1.5625vw]">
          <a
            href={String(new URL(social.twitter, 'https://twitter.com'))}
            className="home__share__twitter bg-[#55acee] inline-flex w-[3.125vw] h-[3.125vw] text-white items-center justify-center text-2xl"
            aria-label="Share on Twitter"
          >
            <div className="flex items-center justify-center h-full relative">
              <FaTwitter />
            </div>
          </a>
        </li>
      ) : null}
      {social.website != null ? (
        <li className="mr-2.5 mb-[1.5625vw] bg-[#ed6f59] inline-flex w-[3.125vw] h-[3.125vw] text-white items-center justify-center text-2xl">
          <a href={social.website} aria-label="Visit website">
            <div className="flex items-center justify-center h-full relative">
              <FaGlobe />
            </div>
          </a>
        </li>
      ) : null}
      {social.email != null ? (
        <li className="mr-2.5 mb-[1.5625vw] bg-[#ed6f59] inline-flex w-[3.125vw] h-[3.125vw] text-white items-center justify-center text-2xl">
          <a href={`mailto:${social.email}`} aria-label="Contact">
            <div className="flex items-center justify-center h-full relative">
              <FaEnvelope />
            </div>
          </a>
        </li>
      ) : null}
    </ul>
  )
}

interface EventNavProps {
  social: EventProps['event']['data']['metadata']['social']
  synthesis: EventProps['event']['data']['metadata']['synthesis']
  aboutDialog: DialogState
  prepDialog: DialogState
  hasAboutOverlay: boolean
  hasPrepOverlay: boolean
}

/**
 *
 */
function EventNav(props: EventNavProps) {
  const {
    hasAboutOverlay,
    aboutDialog,
    hasPrepOverlay,
    prepDialog,
    social,
    synthesis,
  } = props

  return (
    <div className="text-right text-2xl text-white">
      <ul className="home__links flex flex-col">
        {hasAboutOverlay ? (
          <li>
            <button
              onClick={aboutDialog.open}
              className="inline-flex items-center link-popin opacity-50 transition ease-out duration-[400ms] hover:opacity-100 hover:duration-150"
            >
              <span>About</span>
            </button>
          </li>
        ) : null}
        {hasPrepOverlay ? (
          <li>
            <button
              onClick={prepDialog.open}
              className="inline-flex items-center link-popin opacity-50 transition ease-out duration-[400ms] hover:opacity-100 hover:duration-150"
            >
              <span>How to prepare</span>
            </button>
          </li>
        ) : null}
        {social?.flickr != null ? (
          <li>
            <a
              href={social.flickr}
              className="inline-flex items-center opacity-50 transition ease-out duration-[400ms] hover:opacity-100 hover:duration-150"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFlickr size="0.75em" className="mr-2.5" />
              <span>See the photos</span>
            </a>
          </li>
        ) : null}
        {synthesis != null ? (
          <Fragment>
            <hr className="w-[1.5vw] h-[0.15vw] opacity-50 my-[1.5vw] self-end bg-white" />
            <li className="download">
              <a
                href={synthesis}
                className="inline-flex items-center opacity-50 transition ease-out duration-[400ms] hover:opacity-100 hover:duration-150"
                download
              >
                <FaFilePdf size="0.75em" className="mr-2.5" />
                <span>Download the full synthesis</span>
              </a>
            </li>
          </Fragment>
        ) : null}
      </ul>

      <p className="home__more opacity-50 text-base pt-[1.75vw]">
        You can annotate and discuss all the material here with the{' '}
        <a
          href="https://hypothes.is/"
          className="underline hover:no-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          hypothes.is
        </a>{' '}
        plugin.
      </p>
    </div>
  )
}

interface EventSessionsProps {
  sessions: EventProps['event']['data']['metadata']['sessions']
}

function EventSessions(props: EventSessionsProps) {
  const { sessions } = props

  return (
    <div className="relative">
      {sessions.map((session, index) => {
        return <EventSession key={index} session={session} index={index} />
      })}
    </div>
  )
}

interface EventSessionProps {
  session: EventProps['event']['data']['metadata']['sessions'][number]
  index: number
}

function EventSession(props: EventSessionProps) {
  const { session, index } = props

  return (
    // TODO: session before+after
    <div
      id={`session-${index}`}
      className="session relative border-t-[3.125vw] border-[#0870ac]"
    >
      <div className="session__heading flex items-baseline justify-between">
        <h1 className="h1 text-6xl font-bold uppercase mb-12">
          {session.title}
        </h1>
        <a
          href={session.synthesis}
          download
          className="link-download text-5xl flex-shrink-0 inline-flex items-center justify-center text-white w-[4.6875vw] h-[4.6875vw] bg-[#ed6f59] mt-[1.5625vw] mr-[6.25vw] transition duration-[400ms] ease-out hover:bg-[#0870ac] hover:duration-150"
        >
          <FaFilePdf size="0.75em" />
          <span className="sr-only">Download the session synthesis</span>
        </a>
      </div>

      <div className="session__core mx-[6.25vw] pb-[5em]">
        <Mdx
          code={session.body.code}
          components={{
            Download: function EventSessionDownload(props) {
              return <div className="session__downloads"></div>
            },
            Link: function EventSessionLink(props) {
              return <div></div>
            },
            Speakers: function EventSessionSpeakers(props) {
              return <div className="session__speakers"></div>
            },
            Speaker: function EventSessionSpeaker(props) {
              return <div></div>
            },
            h2: function Heading2(props) {
              return (
                <h2
                  className="h2 h2--counter text-4xl font-bold mt-[2.5vw] mb-[1.5vw] pb-[1.5vw] border-b-2 border-[#0870ac]"
                  {...props}
                >
                  {props.children}
                </h2>
              )
            },
            h3: function Heading3(props) {
              return (
                <h3
                  className="h3 relative text-3xl mt-10 mb-8 font-bold"
                  {...props}
                >
                  {props.children}
                </h3>
              )
            },
            p: function Paragraph(props) {
              return (
                <p
                  className="text-3xl text-[#00396C] mb-[1em] leading-snug"
                  {...props}
                >
                  {props.children}
                </p>
              )
            },
            a: function Anchor(props) {
              return (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b-[0.15vw] border-[#1e396c] transition ease-out duration-[400ms] hover:text-[#ed6f59] hover:border-[#ed6f59] hover:duration-150"
                >
                  {props.children}
                </a>
              )
            },
          }}
        />
      </div>

      {session.synthesis != null ? (
        <div className="session__downloads">
          <pre>{session.synthesis}</pre>
        </div>
      ) : null}
    </div>
  )
}

interface EventFooterProps {
  event: EventProps['event']
}

/**
 * Event overview.
 */
function EventFooter(props: EventFooterProps) {
  const { event } = props

  return <footer></footer>
}

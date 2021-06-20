// import '@/event/event.module.css'
import '@reach/dialog/styles.css'

import { DialogContent, DialogOverlay } from '@reach/dialog'
import {
  FaEnvelope,
  FaGlobe,
  FaTwitter,
  FaFlickr,
  FaFilePdf,
  FaCloud,
} from 'react-icons/fa'

import type { Event as EventData } from '@/api/cms/event'
import { Svg as CloseIcon } from '@/assets/icons/close.svg'
import { Icon } from '@/common/Icon'
import { PageContent } from '@/common/PageContent'
import type { DialogState } from '@/common/useDialogState'
import { useDialogState } from '@/common/useDialogState'
import { Mdx as EventContent, Mdx } from '@/mdx/Mdx'
import { getFullName } from '@/utils/getFullName'
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
      <div className="relative body__borders">
        <EventSessions
          sessions={metadata.sessions}
          //  downloads={downloads}
        />
        {/* <EventSideNav sessions={sessions} /> */}
      </div>
      <EventFooter event={event} />
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
    <section className="!h-screen !min-h-screen home">
      {featuredImage != null ? (
        <div className="absolute inset-0">
          <img
            src={featuredImage}
            alt=""
            className="object-cover w-full h-full"
            loading="lazy"
          />
          <div className="bg-gradient-to-b from-transparent via-transparent to-[rgba(0,0,0,0.65)] absolute inset-0" />
        </div>
      ) : null}

      <div className="home__wrapper-1">
        <div className="home__wrapper-2">
          <div className="home__wrapper-3">
            <div className="relative home__main">
              {logo != null ? (
                <div className="absolute bottom-full left-[-3.125vw] w-32">
                  <img src={logo} alt="" className="" loading="lazy" />
                </div>
              ) : null}

              <h1 className="font-bold h1">
                <span>{eventType}</span>
              </h1>
              <h2 className="h2">
                <span>{title}</span>
              </h2>

              <div className="home__intro">
                <EventContent
                  {...event}
                  // TODO: components={{ a: Link, h1: EventTitle, h2: EventSubtitle, p: EventIntro }}
                />
              </div>

              <EventToc sessions={sessions} />
            </div>

            <aside className="home__aside">
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
              className="relative mb-20 text-6xl font-bold uppercase h1"
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
    <ul className="home__index">
      {sessions.map((session, index) => (
        <li key={index}>
          <a href={`#session-${index + 1}`}>
            <small>
              <span>Session {index + 1}</span>
            </small>
            <strong>{session.title}</strong>
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
    <ul className="home__share">
      {social.twitter != null ? (
        <li className="mr-2.5">
          <a
            href={String(new URL(social.twitter, 'https://twitter.com'))}
            className="home__share__twitter"
            aria-label="Share on Twitter"
          >
            <div className="flex items-center justify-center h-full">
              <FaTwitter />
            </div>
          </a>
        </li>
      ) : null}
      {social.website != null ? (
        <li className="mr-2.5">
          <a href={social.website} aria-label="Visit website">
            <div className="flex items-center justify-center h-full">
              <FaGlobe />
            </div>
          </a>
        </li>
      ) : null}
      {social.email != null ? (
        <li className="mr-2.5">
          <a href={`mailto:${social.email}`} aria-label="Contact">
            <div className="flex items-center justify-center h-full">
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
    <div>
      <ul className="text-white transition-opacity opacity-50 home__links ">
        {hasAboutOverlay ? (
          <li>
            <button onClick={aboutDialog.open} className="link-popin">
              <span>About</span>
            </button>
          </li>
        ) : null}
        {hasPrepOverlay ? (
          <li>
            <button onClick={prepDialog.open} className="link-popin">
              <span>How to prepare</span>
            </button>
          </li>
        ) : null}
        {social?.flickr != null ? (
          <li>
            <a href={social.flickr} target="_blank" rel="noopener noreferrer">
              <FaFlickr size="0.75em" className="mr-2.5" />
              <span>See the photos</span>
            </a>
          </li>
        ) : null}
        {synthesis != null ? (
          <li className="download">
            <a href={synthesis} download>
              <FaFilePdf size="0.75em" className="mr-2.5" />
              <span>Download the full synthesis</span>
            </a>
          </li>
        ) : null}
      </ul>
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
    <div id={`session-${index}`} className="session">
      <div className="session__heading">
        <h1 className="h1">
          <span className="square" />
          <strong>{session.title}</strong>
        </h1>
        <a
          href={session.synthesis}
          download
          className="inline-flex items-center justify-center text-white link-download"
        >
          <FaFilePdf size="0.75em" />
          <span className="sr-only">Download the session synthesis</span>
        </a>
      </div>

      <div className="session__core">
        <Mdx
          code={session.body.code}
          components={{
            Download: function EventSessionDownload(props) {
              return (
                <div className="session__downloads">
                  <a href={props.download} download className="link-download">
                    <span>
                      <FaFilePdf />
                    </span>
                    <strong>
                      Download the slides
                      <br />
                      <span>PDF</span>
                    </strong>
                  </a>
                </div>
              )
            },
            Link: function EventSessionLink(props) {
              return (
                <div className="session__downloads">
                  <a href={props.link} className="link-download">
                    <span>
                      <FaCloud />
                    </span>
                    <strong>{props.link}</strong>
                  </a>
                </div>
              )
            },
            Speakers: function EventSessionSpeakers(props) {
              return <div className="session__speakers">{props.children}</div>
            },
            Speaker: function EventSessionSpeaker(props) {
              const speaker = session.speakers.find(
                (speaker) => speaker.id === props.speaker,
              )

              if (speaker == null) return null

              return (
                <div>
                  <h3 className="h2">
                    <strong>Speaker</strong>
                    <span>for this session</span>
                  </h3>
                  <ul className="list-speakers">
                    <li>
                      <div>
                        <img
                          src={speaker.avatar}
                          alt=""
                          loading="lazy"
                          className=""
                        />
                      </div>
                      <div className="list-speakers__bio">
                        <h3 className="font-bold h3">{getFullName(speaker)}</h3>
                        <div className="leading-snug text-[#1e396c]">
                          {props.children ?? speaker.description}
                        </div>
                        <ul className="list-speakers__links">
                          {speaker.twitter != null ? (
                            <li>
                              <a
                                href={String(
                                  new URL(
                                    speaker.twitter,
                                    'https://twitter.com',
                                  ),
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {speaker.twitter}
                              </a>
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              )
            },
            h2: function Heading2(props) {
              return (
                <h2 className="font-bold h2 h2--counter" {...props}>
                  {props.children}
                </h2>
              )
            },
            h3: function Heading3(props) {
              return (
                <h3 className="font-bold h3" {...props}>
                  {props.children}
                </h3>
              )
            },
            p: function Paragraph(props) {
              return (
                <p
                  className="text-[1.7vw] text-[#00396C] mb-[1em] leading-snug"
                  {...props}
                >
                  {props.children}
                </p>
              )
            },
            a: function Anchor(props) {
              return (
                <a {...props} target="_blank" rel="noopener noreferrer">
                  {props.children}
                </a>
              )
            },
          }}
        />
      </div>

      {session.synthesis != null ? (
        <div className="session__downloads">
          <a href={session.synthesis} className="link-download">
            <span></span>
            <strong>
              Download the complete session synthesis
              <br />
              <span>PDF</span>
            </strong>
          </a>
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

  const { licence, social, synthesis } = event.data.metadata

  return (
    <div id="footer">
      <div className="px-[6.25vw]">
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
        <div className="footer__credits">{licence?.name}</div>
        <ul className="footer__links">
          <li>
            <button className="link-popin">About</button>
          </li>
          {social?.flickr != null ? (
            <li>
              <a href={social.flickr} target="_blank" rel="noopener noreferrer">
                See the photos
              </a>
            </li>
          ) : null}
          {synthesis != null ? (
            <li className="download">
              <a href={synthesis} target="_blank" rel="noopener noreferrer">
                Download the full synthesis
              </a>
            </li>
          ) : null}
        </ul>
        <h3 className="h3">Organisation</h3>
        <ul className="footer__partners">
          {event.data.metadata.partners.map((partner) => {
            return (
              <li key={partner.id} className="items-center flex-1 h-12">
                <a href={partner.url} target="_blank" rel="noopener noreferrer">
                  {partner.name}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

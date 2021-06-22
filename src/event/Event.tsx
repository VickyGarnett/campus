import '@reach/dialog/styles.css'

import { DialogContent, DialogOverlay } from '@reach/dialog'
import Link from 'next/link'
import {
  FaEnvelope,
  FaGlobe,
  FaTwitter,
  FaFlickr,
  FaFilePdf,
  FaCloud,
} from 'react-icons/fa'

import type { Event as EventData } from '@/api/cms/event'
import { Svg as AvatarIcon } from '@/assets/icons/avatar.svg'
import { Svg as CloseIcon } from '@/assets/icons/close.svg'
import { Svg as OrcidIcon } from '@/assets/icons/orcid.svg'
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

  const aboutDialog = useDialogState()
  const prepDialog = useDialogState()

  return (
    <PageContent>
      <EventOverview
        event={event}
        aboutDialog={aboutDialog}
        prepDialog={prepDialog}
      />
      <div className="body__borders">
        <EventSessions
          sessions={metadata.sessions}
          // downloads={metadata.downloads}
        />
        <EventSideNav sessions={metadata.sessions} />
      </div>
      <EventFooter
        event={event}
        hasAboutOverlay={Boolean(metadata.about)}
        hasPrepOverlay={Boolean(metadata.prep)}
        aboutDialog={aboutDialog}
        prepDialog={prepDialog}
      />
    </PageContent>
  )
}

interface EventOverviewProps {
  event: EventProps['event']
  aboutDialog: DialogState
  prepDialog: DialogState
}

/**
 * Event overview.
 */
function EventOverview(props: EventOverviewProps) {
  const { event, aboutDialog, prepDialog } = props
  const { metadata } = event.data
  const { about, prep, featuredImage, logo, sessions, social, eventType } =
    metadata

  return (
    <section id="body" className="!h-screen !min-h-screen home">
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

              <EventContent
                {...event}
                components={{
                  a: function EventOverlayLink(props) {
                    return (
                      <a
                        href={props.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {props.children}
                      </a>
                    )
                  },
                  h2: function EventSubtitle(props) {
                    return (
                      <h2 className="font-bold h2">
                        <span>{props.children}</span>
                      </h2>
                    )
                  },
                  p: function EventIntro(props) {
                    return <p className="home__intro">{props.children}</p>
                  },
                }}
              />

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
        <EventOverlay
          content={about.code}
          label="About the event"
          onDismiss={aboutDialog.close}
        />
      ) : null}

      {prepDialog.isOpen && prep != null ? (
        <EventOverlay
          content={prep.code}
          label="Notes for preparation"
          onDismiss={prepDialog.close}
        />
      ) : null}
    </section>
  )
}

interface EventOverlayProps {
  content: string
  label: string
  onDismiss: () => void
}

/**
 * Event overlay.
 */
function EventOverlay(props: EventOverlayProps) {
  const { content, label, onDismiss } = props

  return (
    <DialogOverlay onDismiss={onDismiss} className="z-30">
      <DialogContent
        id="eventoverlay"
        aria-label={props.label}
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
              About
            </h1>
            <Mdx
              code={content}
              components={{
                a: function EventOverlayLink(props) {
                  return (
                    <a
                      href={props.href}
                      className="transition text-event-violet1 hover:text-event-violet2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {props.children}
                    </a>
                  )
                },
                h1: function EventOverlayHeading(props) {
                  return (
                    <h1 className="relative font-bold h1">{props.children}</h1>
                  )
                },
                h2: function EventOverlaySubheading(props) {
                  return (
                    <h2 className="relative font-bold h3">{props.children}</h2>
                  )
                },
                p: function EventOverlayParagraph(props) {
                  return (
                    <p className="my-4 leading-relaxed">{props.children}</p>
                  )
                },
                ul: function EventOverlayList(props) {
                  return <ul className="list-disc">{props.children}</ul>
                },
              }}
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
          <a href={`#session-${index}`}>
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

  if (social == null) return <div />

  return (
    <ul className="home__share">
      {social.twitter != null ? (
        <li className="mr-2.5">
          <a
            href={String(new URL(social.twitter, 'https://twitter.com'))}
            className="home__share__twitter"
            aria-label="Share on Twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="relative flex items-center justify-center h-full">
              <FaTwitter />
            </div>
          </a>
        </li>
      ) : null}
      {social.website != null ? (
        <li className="mr-2.5">
          <a
            href={social.website}
            aria-label="Visit website"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="relative flex items-center justify-center h-full">
              <FaGlobe />
            </div>
          </a>
        </li>
      ) : null}
      {social.email != null ? (
        <li className="mr-2.5">
          <a href={`mailto:${social.email}`} aria-label="Contact">
            <div className="relative flex items-center justify-center h-full">
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
      <ul className="flex flex-col items-end home__links">
        {hasAboutOverlay ? (
          <li>
            <button
              onClick={aboutDialog.open}
              className="link-popin text-white opacity-50 transition duration-[400ms] ease-out hover:opacity-100 hover:duration-150 focus:opacity-100 focus:duration-150 rounded"
            >
              <span>About</span>
            </button>
          </li>
        ) : null}
        {hasPrepOverlay ? (
          <li>
            <button
              onClick={prepDialog.open}
              className="link-popin text-white opacity-50 transition duration-[400ms] ease-out hover:opacity-100 hover:duration-150 focus:opacity-100 focus:duration-150 rounded"
            >
              <span>How to prepare</span>
            </button>
          </li>
        ) : null}
        {social?.flickr != null ? (
          <li>
            <a
              href={social.flickr}
              target="_blank"
              rel="noopener noreferrer"
              className="!flex items-center"
            >
              <FaFlickr size="0.75em" className="mr-2.5" />
              <span>See the photos</span>
            </a>
          </li>
        ) : null}
        {synthesis != null ? (
          <li className="download">
            <a
              href={synthesis}
              download
              className="!flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
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
    <div id={`session-${index}`} className="session">
      <div className="session__heading">
        <h1 className="font-bold h1">
          <span className="square" />
          <strong>{session.title}</strong>
        </h1>
        <a
          href={session.synthesis}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="!flex items-center justify-center text-white link-download"
        >
          <FaFilePdf size="1.5em" />
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
                  <a
                    href={props.download}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-download !flex"
                  >
                    <span className="mr-2.5 text-event-orange flex items-center">
                      <FaFilePdf size="1.8em" />
                    </span>
                    <strong>
                      {props.children ?? 'Download the slides'}
                      <br />
                      <span>(PDF)</span>
                    </strong>
                  </a>
                </div>
              )
            },
            Link: function EventSessionLink(props) {
              return (
                <div className="session__downloads">
                  <a
                    href={props.link}
                    className="link-download !flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="mr-2.5 text-event-orange flex items-center">
                      <FaCloud size="1.8em" />
                    </span>
                    <strong>{props.children ?? props.link}</strong>
                  </a>
                </div>
              )
            },
            Speakers: function EventSessionSpeakers(props) {
              return (
                <div className="session__speakers">
                  <h3 className="h2">
                    <strong>
                      Speaker{props.children.length > 1 ? 's' : ''}
                    </strong>
                    <span>for this session</span>
                  </h3>
                  <ul className="space-y-[3.125vw] list-speakers">
                    {props.children}
                  </ul>
                </div>
              )
            },
            Speaker: function EventSessionSpeaker(props) {
              const speaker = session.speakers.find(
                (speaker) => speaker.id === props.speaker,
              )

              if (speaker == null) return null

              return (
                <li>
                  <div>
                    {speaker.avatar != null ? (
                      <img
                        src={speaker.avatar}
                        alt=""
                        loading="lazy"
                        className="object-cover"
                      />
                    ) : (
                      <Icon
                        icon={AvatarIcon}
                        className="absolute left-0 right-0 w-[9.375vw] h-[9.375vw] rounded-full border-[0.3vw] border-event-violet2 text-event-violet2"
                      />
                    )}
                  </div>
                  <div className="list-speakers__bio">
                    <h3 className="font-bold h3">{getFullName(speaker)}</h3>
                    <div className="leading-snug text-[#1e396c]">
                      {props.children ?? speaker.description}
                    </div>
                    <ul className="list-speakers__links text-event-violet1">
                      {speaker.twitter != null ? (
                        <li>
                          <a
                            href={String(
                              new URL(speaker.twitter, 'https://twitter.com'),
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="!flex items-center"
                          >
                            <FaTwitter size="0.75em" className="mr-1" />
                            <span>{speaker.twitter}</span>
                          </a>
                        </li>
                      ) : null}
                      {speaker.email != null ? (
                        <li>
                          <a
                            href={`mailto:${speaker.email}`}
                            className="!flex items-center"
                          >
                            <FaEnvelope size="0.75em" className="mr-1" />
                            <span>{speaker.email}</span>
                          </a>
                        </li>
                      ) : null}
                      {speaker.website != null ? (
                        <li>
                          <a
                            href={speaker.website}
                            className="!flex items-center"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaGlobe size="0.75em" className="mr-1" />
                            <span>Personal Website</span>
                          </a>
                        </li>
                      ) : null}
                      {speaker.orcid != null ? (
                        <li>
                          <a
                            href={String(
                              new URL(speaker.orcid, 'https://orcid.org'),
                            )}
                            className="!flex items-center"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Icon
                              icon={OrcidIcon}
                              className="w-[0.75em] h-[0.75em] mr-1"
                            />
                            <span>ORCID</span>
                          </a>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </li>
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
            ul: function List(props) {
              return (
                <ul {...props} className="list-standard text-event-violet1">
                  {props.children}
                </ul>
              )
            },
            ol: function OrderedList(props) {
              return (
                <ol {...props} className="list-ordered text-event-violet1">
                  {props.children}
                </ol>
              )
            },
          }}
        />
        {session.synthesis != null ? (
          <div className="session__downloads">
            <a
              href={session.synthesis}
              className="link-download !flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="!text-event-orange">
                <FaFilePdf size="1.8em" className="mr-2.5" />
              </span>
              <strong>
                Download the complete session synthesis
                <br />
                <span>(PDF)</span>
              </strong>
            </a>
          </div>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Session nav.
 */
interface EventSideNavProps {
  sessions: EventProps['event']['data']['metadata']['sessions']
}

function EventSideNav(props: EventSideNavProps) {
  const { sessions } = props

  return (
    <div id="nav-anchors" className="bottom-0 !z-10 hidden md:block">
      <ol className="sticky top-40">
        <li>
          <Link href={{ hash: 'body' }}>
            <a className="internal-link">
              <strong>Scroll to top</strong>
            </a>
          </Link>
        </li>
        {sessions.map((session, index) => {
          return (
            <li key={index}>
              <Link href={{ hash: `session-${index}` }}>
                <a>
                  <strong>{session.title}</strong>
                </a>
              </Link>
            </li>
          )
        })}
        <li>
          <Link href={{ hash: 'footer' }}>
            <a className="internal-link">
              <strong>Scroll to bottom</strong>
            </a>
          </Link>
        </li>
      </ol>
    </div>
  )
}

interface EventFooterProps {
  event: EventProps['event']
  hasAboutOverlay: boolean
  hasPrepOverlay: boolean
  aboutDialog: DialogState
  prepDialog: DialogState
}

/**
 * Event overview.
 */
function EventFooter(props: EventFooterProps) {
  const { event, hasAboutOverlay, hasPrepOverlay, aboutDialog, prepDialog } =
    props

  const { licence, social, synthesis } = event.data.metadata

  return (
    <div id="footer">
      <div className="px-[6.25vw]">
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
        <div className="footer__credits">{licence?.name}</div>
        <ul className="footer__links">
          {hasAboutOverlay ? (
            <li>
              <button
                onClick={aboutDialog.open}
                className="font-bold link-popin hover:text-event-orange transition ease-out duration-[400ms] hover:duration-150"
              >
                About
              </button>
            </li>
          ) : null}
          {hasPrepOverlay ? (
            <li>
              <button
                onClick={prepDialog.open}
                className="font-bold link-popin hover:text-event-orange transition ease-out duration-[400ms] hover:duration-150"
              >
                Prep
              </button>
            </li>
          ) : null}
          {social?.flickr != null ? (
            <li>
              <a
                href={social.flickr}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <FaFlickr size="0.75em" className="mr-1" />
                See the photos
              </a>
            </li>
          ) : null}
          {synthesis != null ? (
            <li className="download">
              <a
                href={synthesis}
                download
                className="flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFilePdf size="0.75em" className="mr-1" />
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
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full h-full"
                >
                  {partner.logo != null ? (
                    <img
                      alt={partner.name}
                      className="text-white opacity-75 flex-1 h-full transition duration-[400ms] ease-out hover:opacity-100 hover:duration-150 object-contain"
                      src={partner.logo}
                      loading="lazy"
                    />
                  ) : (
                    partner.name
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

import { useState } from 'react'

import { Spinner } from '@/common/Spinner'
import { createUrl } from '@/utils/createUrl'

export const videoProviders = {
  youtube: 'YouTube',
  vimeo: 'Vimeo',
  nakala: 'Nakala',
} as const

export type VideoProvider = keyof typeof videoProviders

export interface VideoProps {
  id: string
  /** @default "youtube" */
  provider?: VideoProvider
  /** @default false */
  autoPlay?: boolean
  /** In seconds. */
  startTime?: number
  caption?: string
}

/**
 * Video video.
 */
export function Video(props: VideoProps): JSX.Element {
  const url = useVideo(
    props.provider ?? 'youtube',
    props.id,
    props.autoPlay,
    props.startTime,
  )

  const [isLoadingIframe, setIsLoadingIframe] = useState(true)

  function onLoadIframe() {
    setIsLoadingIframe(false)
  }

  return (
    <figure className="flex flex-col items-center justify-center">
      <div className="w-full aspect-w-16 aspect-h-9">
        <div className="absolute text-primary-600 top-1/2 left-1/2">
          <Spinner className={isLoadingIframe ? undefined : 'hidden'} />
        </div>
        <iframe
          src={String(url)}
          title="Video player"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          loading="lazy"
          onLoad={onLoadIframe}
          className=""
        />
      </div>
      {props.caption !== undefined ? (
        <figcaption className="py-2 font-medium">{props.caption}</figcaption>
      ) : null}
    </figure>
  )
}

function useVideo(
  provider: VideoProvider,
  id: string,
  autoPlay = false,
  startTime?: number,
) {
  switch (provider) {
    case 'youtube':
      return getYouTubeUrl(id, autoPlay, startTime)
    case 'vimeo':
      return getVimeoUrl(id, autoPlay, startTime)
    case 'nakala':
      return getNakalaUrl(id, autoPlay, startTime)
  }
}

function getYouTubeUrl(id: string, autoPlay = false, startTime?: number) {
  const BASE_URL = 'https://www.youtube-nocookie.com/embed/'

  const embedUrl = createUrl({ path: id, baseUrl: BASE_URL })

  if (autoPlay === true) {
    embedUrl.searchParams.set('autoplay', String(1))
  }
  if (startTime !== undefined) {
    embedUrl.searchParams.set('start', String(startTime))
  }

  return embedUrl
}

function getVimeoUrl(id: string, autoPlay = false, startTime?: number) {
  const BASE_URL = 'https://player.vimeo.com/video/'

  const embedUrl = createUrl({
    path: id,
    baseUrl: BASE_URL,
    query: { autoplay: autoPlay ? '1' : undefined },
  })

  return embedUrl
}

function getNakalaUrl(id: string, autoPlay = false, startTime?: number) {
  const BASE_URL = 'https://api.nakala.fr/embed/'

  const embedUrl = createUrl({
    path: id,
    baseUrl: BASE_URL,
  })

  return embedUrl
}

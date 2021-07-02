import Image from 'next/image'
import { Fragment } from 'react'

import { Svg as PlayIcon } from '@/assets/icons/play.svg'
import { Icon } from '@/common/Icon'
import { LightBox } from '@/common/LightBox'
import type { VideoProps } from '@/common/Video'
import { Video } from '@/common/Video'
import { useDialogState } from '@/common/useDialogState'
import type { FilePath } from '@/utils/ts/aliases'

export interface VideoCardProps extends Omit<VideoProps, 'caption'> {
  title: string
  subtitle: string
  image: FilePath
}

/**
 * Video card.
 */
export function VideoCard(props: VideoCardProps): JSX.Element {
  const lightbox = useDialogState()

  return (
    <Fragment>
      <button
        onClick={lightbox.open}
        className="flex flex-col items-center w-full p-12 space-y-4 transition rounded shadow-lg text-neutral-800 hover:shadow-xl focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
      >
        <div className="w-full">
          <Image
            src={props.image}
            alt=""
            className="!my-0"
            layout="responsive"
            width="16"
            height="9"
            objectFit="cover"
            sizes="640px"
          />
        </div>
        <Icon icon={PlayIcon} className="w-16 h-16 text-primary-600" />
        <strong className="text-2xl font-bold">{props.title}</strong>
        <p className="text-neutral-500">{props.subtitle}</p>
      </button>
      <LightBox {...lightbox}>
        <Video
          id={props.id}
          provider={props.provider}
          caption={[props.title, props.subtitle].filter(Boolean).join(' - ')}
          autoPlay={props.autoPlay}
          startTime={props.startTime}
        />
      </LightBox>
    </Fragment>
  )
}

import dynamic from 'next/dynamic'
import { createElement } from 'react'
import type { ComponentType } from 'react'

import { YouTube } from '@/common/YouTube'
import { ExternalResource } from '@/post/ExternalResource'
import { Grid } from '@/post/Grid'
import { SideNote } from '@/post/SideNote'
import { VideoCard } from '@/post/VideoCard'
import { Quiz } from '@/post/quiz/Quiz'

/**
 * Lazy-load Quiz component, since it won't be used on most pages.
 *
 * FIXME: We seem to lose Quiz.Card etc. when importing like this.
 */
// const Quiz = dynamic(async () => {
//   const { Quiz } = await import('@/post/quiz/Quiz')
//   return Quiz
// })

// export type ComponentType =
//   /** Layout wrapper. */
//   | 'wrapper'
//   /** CommonMark. */
//   | 'a'
//   | 'blockquote'
//   | 'code'
//   | 'em'
//   | 'h1'
//   | 'h2'
//   | 'h3'
//   | 'h4'
//   | 'h5'
//   | 'h6'
//   | 'hr'
//   | 'img'
//   | 'li'
//   | 'ol'
//   | 'p'
//   | 'pre'
//   | 'strong'
//   | 'ul'
//   /** GitHub markdown. */
//   | 'del'
//   | 'table'
//   | 'tbody'
//   | 'td'
//   | 'th'
//   | 'thead'
//   | 'tr'

// export type ComponentMap = {
//   [key in ComponentType]?: JSX.IntrinsicElements | ComponentType
// }

export type ComponentMap = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [name: string]: JSX.IntrinsicElements | ComponentType<any>
}

/**
 * Legacy component names.
 */
const legacy: ComponentMap = {
  CTA: ExternalResource,
  Flex: Grid,
  Panel: function Panel(props) {
    return createElement(SideNote, { type: 'info', ...props })
  },
  Youtube: YouTube,
}

/**
 * Custom components allowed in mdx content.
 */
export const components: ComponentMap = {
  ...legacy,
  ExternalResource,
  Grid,
  Quiz,
  SideNote,
  VideoCard,
  YouTube,
}

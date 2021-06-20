import dynamic from 'next/dynamic'
import { createElement } from 'react'
import type { ComponentType } from 'react'

import { YouTube } from '@/common/YouTube'
import { ExternalResource } from '@/post/ExternalResource'
import { Grid } from '@/post/Grid'
import { SideNote } from '@/post/SideNote'
import { VideoCard } from '@/post/VideoCard'

/**
 * Lazy-load Quiz component, since it won't be used on most pages.
 *
 * We lose function properties when importing with `next/dynamic`,
 * so we need to import each component manually.
 *
 * @see https://github.com/vercel/next.js/issues/26381
 */
const Quiz = dynamic(async () => {
  const { Quiz } = await import('@/post/quiz/Quiz')
  return Quiz
})
const QuizCard = dynamic(async () => {
  const { QuizCard } = await import('@/post/quiz/QuizCard')
  return QuizCard
})
const QuizQuestion = dynamic(async () => {
  const { QuizQuestion } = await import('@/post/quiz/QuizQuestion')
  return QuizQuestion
})
const MultipleChoice = dynamic(async () => {
  const { MultipleChoice } = await import('@/post/quiz/MultipleChoice')
  return MultipleChoice
})
const XmlCodeEditor = dynamic(async () => {
  const { XmlCodeEditor } = await import('@/post/quiz/XmlCodeEditor')
  return XmlCodeEditor
})

// @ts-expect-error Function prop.
Quiz.Card = QuizCard
// @ts-expect-error Function prop.
Quiz.Question = QuizQuestion
// @ts-expect-error Function prop.
Quiz.MultipleChoice = MultipleChoice
// @ts-expect-error Function prop.
Quiz.XmlCodeEditor = XmlCodeEditor

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

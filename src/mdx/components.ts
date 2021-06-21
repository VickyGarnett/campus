import type { ComponentType } from 'react'

import { YouTube } from '@/common/YouTube'
import { Grid } from '@/post/Grid'

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
const legacyComponents: ComponentMap = {
  Flex: Grid,
  Youtube: YouTube,
}

/**
 * Custom components allowed in mdx content.
 */
export const components: ComponentMap = {
  ...legacyComponents,
  Grid,
  YouTube,
}

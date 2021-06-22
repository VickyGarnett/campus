import { components } from '@/mdx/components'
import type { MdxContentProps } from '@/mdx/runMdxSync'
import { useMdx } from '@/mdx/useMdx'

export interface MdxProps {
  code: string
  components?: MdxContentProps['components']
}

/**
 * Renders pre-compiled mdx content.
 */
export function Mdx(props: MdxProps): JSX.Element | null {
  const mdx = useMdx(props.code)

  if (mdx === null) return null

  const { MdxContent, metadata } = mdx

  return (
    <MdxContent
      {...metadata}
      components={{ ...components, ...props.components }}
    />
  )
}

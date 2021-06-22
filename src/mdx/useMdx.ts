import { useMemo } from 'react'

import type { Mdx } from '@/mdx/runMdxSync'
import { runMdxSync } from '@/mdx/runMdxSync'

/**
 * Hydrates pre-compiled mdx.
 */
export function useMdx(code: string): Mdx | null {
  const mdx = useMemo(() => {
    if (code.length === 0) return null
    return runMdxSync(code)
  }, [code])

  return mdx
}

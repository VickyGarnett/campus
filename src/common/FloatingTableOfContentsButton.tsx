import '@reach/dialog/styles.css'

import { DialogContent, DialogOverlay } from '@reach/dialog'
import cx from 'clsx'
import { useRouter } from 'next/router'
import { Fragment, useEffect } from 'react'

import { Svg as CloseIcon } from '@/assets/icons/close.svg'
import { Svg as TocIcon } from '@/assets/icons/toc.svg'
import { Icon } from '@/common/Icon'
import type { TableOfContentsProps } from '@/common/TableOfContents'
import { TableOfContents } from '@/common/TableOfContents'
import { useDialogState } from '@/common/useDialogState'

export interface FloatingTableOfContentsButtonProps {
  toc: TableOfContentsProps['toc']
}

/**
 * Floating table of contents.
 */
export function FloatingTableOfContentsButton(
  props: FloatingTableOfContentsButtonProps,
): JSX.Element {
  const state = useDialogState()
  const router = useRouter()

  useEffect(() => {
    router.events.on('hashChangeStart', state.close)

    return () => {
      router.events.off('hashChangeStart', state.close)
    }
  }, [router, state.close])

  return (
    <Fragment>
      <button
        onClick={state.toggle}
        className={cx(
          'fixed z-40 p-4 text-white transition rounded-full bottom-5 right-5 2xl:hidden focus:outline-none focus-visible:ring',
          state.isOpen
            ? 'hover:bg-red-700 bg-red-600 focus-visible:ring-red-600'
            : 'hover:bg-primary-700 bg-primary-600 focus-visible:ring-primary-600',
        )}
      >
        <Icon icon={state.isOpen ? CloseIcon : TocIcon} className="w-5 h-5" />
        <span className="sr-only">Table of contents</span>
      </button>
      <DialogOverlay
        isOpen={state.isOpen}
        onDismiss={state.close}
        className="z-30"
      >
        <DialogContent
          aria-label="Table of contents"
          className="flex flex-col !w-full !h-full !my-0 space-y-2 rounded-xl shadow-card md:!w-1/2 md:!my-16 md:!h-auto"
        >
          <button
            onClick={state.close}
            aria-label="Close"
            className="self-end p-2 transition rounded-full hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
          >
            <Icon icon={CloseIcon} className="w-6 h-6" />
          </button>
          <TableOfContents
            toc={props.toc}
            title={
              <h2 className="text-sm font-bold tracking-wide uppercase text-neutral-600">{`Table of contents`}</h2>
            }
            className="space-y-2"
          />
        </DialogContent>
      </DialogOverlay>
    </Fragment>
  )
}

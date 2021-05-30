import type { Locale } from '@/i18n/i18n.config'
import { url } from '~/config/site.config'

export interface SiteMetadata {
  url: string
  title: string
  shortTitle?: string
  description: string
  favicon: {
    src: string
    maskable?: boolean
  }
  image: {
    src: string
    publicPath: string
    alt: string
  }
  twitter?: string
  creator?: {
    name: string
    affiliation?: string
    website: string
    address?: {
      street: string
      zip: string
      city: string
    }
    image?: {
      src: string
      publicPath: string
      alt: string
    }
    phone?: string
    email?: string
    twitter?: string
  }
}

/**
 * Site metadata for all supported locales.
 */
export const siteMetadata: Record<Locale, SiteMetadata> = {
  en: {
    url: String(new URL('en', url)),
    title: 'Campus',
    shortTitle: 'Campus',
    description: '',
    favicon: {
      src: 'public/assets/images/logo-maskable.svg',
      maskable: true,
    },
    image: {
      src: 'public/android-chrome-512x512.png',
      publicPath: '/android-chrome-512x512.png',
      alt: '',
    },
    twitter: '',
  },
} as const

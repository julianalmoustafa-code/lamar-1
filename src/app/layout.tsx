import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import FloatingWhatsApp from '@/components/public/FloatingWhatsApp'
import { getContent } from '@/lib/content'
import { getTheme } from '@/lib/themeServer'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, absoluteUrl } from '@/lib/site'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

export const revalidate = 3600

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  icons: {
    icon: '/lamar_icon.svg',
    shortcut: '/lamar_icon.svg',
  },
  verification: {google: "vNn0-0yetaf2Z4UjabBzp2OguUuMbVP1sgQUtGjpZtY",
},
  title: {
    default: 'LAMAR Stukadoor en Onderhoud | Gipswerk, Decoratie & Renovatie',
    template: '%s | LAMAR Stukadoor en Onderhoud',
  },
  description: SITE_DESCRIPTION,
  keywords: 'stukadoor, gipswerk, interieurafwerking, schilderwerk, woningrenovatie, decoratie, Nederland, LAMAR',
  openGraph: {
    title: SITE_NAME,
    description: 'Professioneel stukadoorswerk, interieurafwerking en woningrenovatie in Nederland.',
    type: 'website',
    locale: 'nl_NL',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: absoluteUrl('/og-image.png'), width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Professioneel stukadoorswerk, interieurafwerking en woningrenovatie in Nederland.',
    images: [absoluteUrl('/og-image.png')],
  },
  robots: { index: true, follow: true },
}

import Preloader from '@/components/public/Preloader'
import MobileBottomNav from '@/components/public/MobileBottomNav'
import TopTrustBar from '@/components/public/TopTrustBar'

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const wa = await getContent('whatsapp_number', '31630302033')
  // We can fetch theme, but we will enforce our new elegant palette by default
  const theme = await getTheme()
  const primaryColor = theme.primary
  const accentColor = theme.accent

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': absoluteUrl('/#business'),
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: absoluteUrl('/opengraph-image'),
    telephone: `+${wa}`,
    areaServed: { '@type': 'Country', name: 'Netherlands' },
    address: { '@type': 'PostalAddress', addressCountry: 'NL' },
    knowsAbout: ['Stucwerk', 'Gipswerk', 'Interieurafwerking', 'Schilderwerk', 'Woningrenovatie'],
  }

  return (
    <html
      lang="nl"
      className={`${poppins.variable}`}
      data-scroll-behavior="smooth"
      style={{
        '--font-outfit': 'var(--font-poppins)',
        '--font-archivo': 'var(--font-poppins)',
        '--teal': primaryColor,
        '--teal2': accentColor,
      } as React.CSSProperties}
    >
      <body>
        <Preloader />
        <TopTrustBar />
        {children}
        <FloatingWhatsApp number={wa} />
        <MobileBottomNav />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}

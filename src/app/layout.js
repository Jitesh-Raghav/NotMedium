import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata = {
  title: 'NotMedium — The engineering blogs worth your time',
  description: 'A hand-curated index of engineering blogs from the teams building the internet. No feed, no algorithm, no paywall.',
  keywords: 'engineering blogs, tech blogs, software engineering, programming, developer blogs',
  icons: {
    icon: '/medium-logo.ico',
    shortcut: '/medium-logo.ico',
    apple: '/medium-logo.ico',
  },
  openGraph: {
    title: 'NotMedium — The engineering blogs worth your time',
    description: 'A hand-curated index of engineering blogs from the teams building the internet.',
    type: 'website',
    images: ['/medium-logo.png'],
  },
  twitter: {
    card: 'summary',
    title: 'NotMedium — The engineering blogs worth your time',
    description: 'A hand-curated index of engineering blogs from the teams building the internet.',
    images: ['/medium-logo.png'],
  },
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
    { media: '(prefers-color-scheme: light)', color: '#fafaf8' },
  ],
}

// Applied before paint so the stored theme never flashes.
const themeScript = `
try {
  var t = localStorage.getItem('nm-theme');
  document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
} catch (e) {
  document.documentElement.setAttribute('data-theme', 'dark');
}
`

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${serif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  )
}

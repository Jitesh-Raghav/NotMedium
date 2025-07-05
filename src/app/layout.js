import './globals.css'

export const metadata = {
  title: 'NotMedium - Engineering Blogs Directory',
  description: 'Discover engineering blogs from top companies worldwide. A curated directory of technical blogs organized alphabetically.',
  keywords: 'engineering blogs, tech blogs, software engineering, programming, developer blogs',
  icons: {
    icon: '/medium-logo.ico',
    shortcut: '/medium-logo.ico',
    apple: '/medium-logo.ico',
  },
  openGraph: {
    title: 'NotMedium - Engineering Blogs Directory',
    description: 'Discover engineering blogs from top companies worldwide. A curated directory of technical blogs organized alphabetically.',
    type: 'website',
    images: ['/medium-logo.ico'],
  },
  twitter: {
    card: 'summary',
    title: 'NotMedium - Engineering Blogs Directory',
    description: 'Discover engineering blogs from top companies worldwide.',
    images: ['/medium-logo.ico'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/medium-logo.ico" sizes="any" />
        <link rel="shortcut icon" href="/medium-logo.ico" />
        <link rel="apple-touch-icon" href="/medium-logo.ico" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
} 
import Navigation from './Components/Navigation'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Join the waitlist | Scriblo',
  description: 'Discover a powerful and intuitive blogging platform that empowers writers to share their ideas with the world. Our application provides a seamless user experience, advanced collaboration features, and a thriving community. Join our waitlist today and be the first to experience the future of blogging.',
  icons: {
    icon: '/images/icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
        </body>
    </html>
  )
}

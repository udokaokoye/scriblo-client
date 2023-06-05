import Navigation from '@/Components/Navigation'
import '../globals.css'
import { Merriweather } from 'next/font/google'
// import localFont from 'next/font/local'
import Provider from '@/Components/Provider'
import { AppContexProvider } from '../contex/store';
import { usePathname } from 'next/navigation';

const merrweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-charter-itc'
})


export const metadata = {
  title: 'Scriblo',
  description: 'Discover a powerful and intuitive blogging platform that empowers writers to share their ideas with the world. Our application provides a seamless user experience, advanced collaboration features, and a thriving community. Join our waitlist today and be the first to experience the future of blogging.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={merrweather.className}>
        <AppContexProvider>
        <Provider>
        <Navigation />
        {children}
        </Provider>
        </AppContexProvider>
        </body>
    </html>
  )
}

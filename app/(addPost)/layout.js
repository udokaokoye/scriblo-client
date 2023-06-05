import '../globals.css'
import Provider from '@/Components/Provider'
import { AppContexProvider } from '../contex/store';
import { Merriweather } from 'next/font/google'
// import ClientProtectedRoute from '@/Components/ClientProtectedRoute';
import ServerProtectedRoute from '@/Components/ServerProtectedRoute';

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
        <ServerProtectedRoute>
        <AppContexProvider>
        <Provider>
        {children}
        </Provider>
        </AppContexProvider>
        </ServerProtectedRoute>
        </body>
    </html>
  )
}

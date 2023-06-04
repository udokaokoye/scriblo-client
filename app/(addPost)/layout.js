import '../globals.css'
import { Inter } from 'next/font/google'
import Provider from '@/Components/Provider'
import { AppContexProvider } from '../contex/store';
// import ClientProtectedRoute from '@/Components/ClientProtectedRoute';
import ServerProtectedRoute from '@/Components/ServerProtectedRoute';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Scriblo',
  description: 'Discover a powerful and intuitive blogging platform that empowers writers to share their ideas with the world. Our application provides a seamless user experience, advanced collaboration features, and a thriving community. Join our waitlist today and be the first to experience the future of blogging.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
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

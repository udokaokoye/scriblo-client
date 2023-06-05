import { Source_Sans_Pro, Merriweather} from 'next/font/google'



  export const source_Sans_Pro = Source_Sans_Pro({
    weight: ['200', '300', '400', '600', '700', '900'], 
    subsets: ['latin'],
    varibale: '--font-src-sans-pro'
  })

  export const merrweather = Merriweather({
    weight: ['300', '400', '700', '900'],
    subsets: ['latin'],
    variable: '--font-charter-itc'
  })
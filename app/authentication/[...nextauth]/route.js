import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
const API_URL = process.env.API_URL || "http://localhost:3000/api";
export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      credentials: {},
      async authorize(credentials, req) {
        const {email} = credentials;
        const res = await fetch(`${API_URL}/users/?email=leviokoye@gmail.com`)
        const {user} = await res.json()
  
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  callbacks: {
    async signIn(user, account, profile) {
    fetch(
        `${API_URL}/users/checkIfUserExists.php?email=${user?.user?.email}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.message) {
            return false;
          }
        });

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
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
      name: 'Credentials',
      async authorize(credentials) {
        const {email, token} = credentials;
        const res = await fetch(`${API_URL}/users/index.php?email=${email}&with=token`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        })
        const response = await res.json()
        if (response.status == 200 && response.data) {
          console.log(response.data)
          const ses = {
            user: {...response.data}
          }
          return ses
        }
        return false
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
          return true;
        });

    },
    jwt({token, user}) {
      if(user) {
        token = {...token, ...user}
      }
      return token
    },
    session({session, token}) {
      if(token) {
        session = {...token}
      }
      return session
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

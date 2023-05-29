import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.API_URL || "http://localhost:3000/api";

export const authOptions = {
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const { email, token } = credentials;
        const res = await fetch(
          `${API_URL}/users/index.php?email=${email}&with=token`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const response = await res.json();
        if (response.status == 200 && response.data) {
          return response.data;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn(user) {
      if (user.account.provider == "google") {
        const res = await fetch(
          `${API_URL}/users/checkIfUserExists.php?email=${user?.user?.email}`
        );
        const resJson = await res.json();
        if (resJson.message === false) {
          return `/signup?continue=true&email=${user?.user?.email}&name=${user?.user?.name}&image=${user?.user?.image}`;
        } 
        else {
          const response = await fetch(
            `${API_URL}/users/index.php?email=${user?.user?.email}&with=token`,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + resJson.token,
              },
            }
          );
          const responseJson = await response.json();
          if (responseJson.status !== 200) {
            return false;
          }
          return {
            ...responseJson.data,
          };
        }
      }
      return {
        hello: "world"
      };
    },
    jwt: async ({ token, user }) => {
      console.log(token, user)
      return {...token, ...user}
    },
    session: async ({ session, token }) => {
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

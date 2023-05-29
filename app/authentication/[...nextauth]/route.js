import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import e from "express";
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
          console.log(response.data);
          const ses = {
            user: {
              ...response.data,
            },
          };
          return ses;
        }
        return false;
      },
    }),
  ],
  callbacks: {
    async signIn(user, account) {
      // make sure the provider is google
      if (user.account.provider == "google") {
        const res = await fetch(
          `${API_URL}/users/checkIfUserExists.php?email=${user?.user?.email}`
        );
        const resJson = await res.json();
        // console.log(resJson)
        if (resJson.message === false) {
          return `/signup?continue=true&email=${user?.user?.email}&name=${user?.user?.name}&image=${user?.user?.image}`;
        } else {
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
          if (responseJson.status == 200) {
            // console.log(responseJson.data);
            const sess= {
              user: {
                ...responseJson.data,
              },
            };
            return Promise.resolve(sess);
          } else {
            return false;
          }
        }

        // return false;
      } else {
        return true;
      }
    },
    jwt({ token, user }) {
      // console.log(user);
      if (user) {
        token = { ...token, ...user };
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token, user }) => {
      console.log(token);
      console.log(user);
      session = {
        user: {
          ...user,
        },
      };

      return Promise.resolve(session);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.API_URL || "http://localhost:3000/api";

export const authOptions = {
  session: {
    strategy: 'jwt',
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
        // console.log("ResJson " + resJson.message)
        // else {
          // const response = await fetch(
          //   `${API_URL}/users/index.php?email=${user?.user?.email}&with=token`,
          //   {
          //     method: "GET",
          //     headers: {
          //       Authorization: "Bearer " + resJson.token,
          //     },
          //   }
          // );
          // const responseJson = await response.json();
          // if (responseJson.status !== 200) {
          //   return false;
          // }
          return true;
        // }
      }
      return {
        hello: "world"
      };
    },
    jwt: async ({ token, user, trigger, session }) => {
      // console.log("USER: " + user)
      if (user) {
        const response = await fetch(
          `${API_URL}/users/index.php?email=${user?.email}&with=token`);
        const responseJson = await response.json();
        console.log("response: " + responseJson)
        if (responseJson.status !== 200) {
          return token;
        }
        token = {...token, ...responseJson.data};
      }

      if (trigger === "update" && token) {
        console.log("Email: " + token?.id)
        // const response = await fetch(
        //   `${API_URL}/users/index.php?id=${token?.id}&with=token`);
        // const responseJson = await response.json();
        // if (responseJson.status !== 200) {
        //   return token;
        // }
        // token = {...token, ...responseJson.data};
      }
      return token;
    },
    session: async ({ session, token }) => {
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

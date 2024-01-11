import CredentialsProvider from "next-auth/providers/credentials";
import { Account, Profile, SessionStrategy, User } from "next-auth";
import { sql } from '@vercel/postgres';
import { JWT } from "next-auth/jwt";

type UserTable = {
  id: string;
  age: number;
  name: string;
  admin: boolean;
};

interface CkpcUser extends User {
  id: string;
  age: number;
  name: string;
  admin: boolean;
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        age: { label: "屆數", type: "number", placeholder: "1" },
        name: { label: "名字/暱稱", type: "text", placeholder: "johndoe" },
      },
      async authorize(credentials: any, req: any) {
        // Check if user exists and credentials are correct
        const id = `ckpc${credentials.age}-${credentials.name}`;
        const data = await sql<UserTable>`SELECT * FROM users WHERE id = ${id}`;
        const user = data.rows[0];

        if (user) {
          // User exists. Return the User object to indicate that the user has been logged in
          return {
            id: `ckpc${user.age}-${user.name}`,
            age: user.age,
            name: user.name,
            admin: user.admin,
          } as CkpcUser;
        } else {
          const age = Number(credentials.age);
          if (Number.isInteger(age) && age >= 1 && age <= 31) {
            // If the age is valid, create a new user and log the user in
            await sql<UserTable>`
              INSERT INTO users (id, age, name, admin)
              VALUES (${id}, ${age}, ${credentials.name}, false)
              ON CONFLICT DO NOTHING
            `;

            return {
              id: `ckpc${age}-${credentials.name}`,
              age,
              name: credentials.name,
              admin: false,
            } as CkpcUser;
          } else {
            return null;
          }
        }
      }
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: any }) {
      if (user) {
        token.id = user.id;
        token.age = user.age;
        token.name = user.name;
        token.admin = user.admin;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      session.user = {
        id: token.id,
        age: token.age,
        name: token.name,
        admin: token.admin,
      }
      return session;
    },
  },
}

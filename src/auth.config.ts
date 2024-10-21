import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth"

import Credentials from "next-auth/providers/credentials";
import { authFormSchema } from "./lib/utils";
import { prismaDb } from "./lib/db";
import { compare } from "bcryptjs";
import { UserRole } from "@prisma/client";
import { getUserById } from "./data/queries";


export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validateValue = authFormSchema("sign-in").safeParse(credentials);

        if (validateValue.success) {
          const { email, password } = validateValue.data;

          const user = await prismaDb.user.findUnique({
            where: { email }
          });

          if (!user || !user.password) {
            throw null;
          }

          const isPasswordMatch = await compare(password, user.password);

          if (!isPasswordMatch) {
            throw new Error("Invalid password");
          }

          return user
        }

        return null
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.role = existingUser.role

      return token;
    }
  }
} satisfies NextAuthConfig
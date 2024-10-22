import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config";
import { prismaDb } from "./lib/db";

export const { handlers: { GET, POST }, auth, signIn, signOut, } = NextAuth({
  adapter: PrismaAdapter(prismaDb),
  session: { strategy: "jwt" },
  ...authConfig
})
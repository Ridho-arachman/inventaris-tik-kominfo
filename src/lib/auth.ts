import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { nextCookies } from "better-auth/next-js";
import bcrypt from "bcrypt";
import { sendEmail } from "./sendEmail";

export const auth = betterAuth({
  plugins: [nextCookies()],
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void (await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `<p>Hi ${user.name},</p><p>Click <a href="${url}">here</a> to verify your email.</p>`,
      }));
    },
    sendOnSignIn: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (plainPassword: string) => {
        const saltRounds = 10;
        return await bcrypt.hash(plainPassword, saltRounds);
      },
      verify: async ({
        password,
        hash,
      }: {
        password: string;
        hash: string;
      }) => {
        return await bcrypt.compare(password, hash);
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "OPD",
        input: false, // don't allow user to set role
      },
      opdId: {
        type: "string",
        required: false,
        input: false,
      },
      codeOpd: {
        type: "string",
        required: false,
        input: false, // don't allow user to set role
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },
});

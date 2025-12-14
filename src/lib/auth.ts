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
      const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://yourdomain.com/logo.png" alt="Kominfo Serang" style="width: 120px;" />
        </div>

        <h2 style="color: #6366f1;">Halo ${user.name},</h2>
        <p>Terima kasih telah mendaftar di sistem INVENTARIS ALAT TIK KOMINFO KABUPATEN SERANG.</p>
        <p>Silakan klik tombol di bawah untuk memverifikasi email Anda:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" 
            style="
              background-color: #6366f1;
              color: #fff;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: bold;
              display: inline-block;
            "
          >Verifikasi Email</a>
        </div>

        <p style="font-size: 0.9rem; color: #555;">
          Jika tombol tidak berfungsi, salin dan tempel link berikut di browser:
          <br /><a href="${url}" style="color: #6366f1;">${url}</a>
        </p>

        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 0.8rem; color: #999; text-align: center;">
          &copy; ${new Date().getFullYear()} Kominfo Kabupaten Serang. All rights reserved.
        </p>
      </div>
      `;

      void (await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html,
      }));
    },
    sendOnSignIn: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
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

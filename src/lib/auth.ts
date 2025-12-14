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
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi5C4_T_qAmfk5uZpOaXkhCFnP03zRPzEJIg&s" alt="Kominfo Serang" style="width: 120px;" />
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
    sendResetPassword: async ({ user, url, token }, request) => {
      const html = `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 40px 16px">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width: 600px;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
            "
          >
            <!-- Header -->
            <tr>
              <td
                style="
                  background-color: #2563eb;
                  padding: 24px;
                  text-align: center;
                  color: #ffffff;
                "
              >
                <h1 style="margin: 0; font-size: 22px">
                  Reset Password Akun
                </h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 32px; color: #111827">
                <p style="margin: 0 0 16px">
                  Halo,
                </p>

                <p style="margin: 0 0 16px">
                  Kami menerima permintaan untuk mereset password akun Anda.
                  Klik tombol di bawah ini untuk melanjutkan proses reset
                  password.
                </p>

                <div style="text-align: center; margin: 32px 0">
                  <a
                    href="${url}"
                    style="
                      background-color: #2563eb;
                      color: #ffffff;
                      padding: 14px 28px;
                      border-radius: 8px;
                      text-decoration: none;
                      font-weight: bold;
                      display: inline-block;
                    "
                  >
                    Reset Password
                  </a>
                </div>

                <p style="margin: 0 0 16px; font-size: 14px; color: #4b5563">
                  Link ini hanya berlaku selama
                  <strong>15 menit</strong>.
                </p>

                <p style="margin: 0; font-size: 14px; color: #4b5563">
                  Jika Anda tidak merasa melakukan permintaan reset password,
                  abaikan email ini.
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding: 0 32px">
                <hr
                  style="
                    border: none;
                    border-top: 1px solid #e5e7eb;
                    margin: 0;
                  "
                />
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  padding: 20px 32px;
                  font-size: 12px;
                  color: #6b7280;
                  text-align: center;
                "
              >
                © 2025 Sistem Inventaris TIK<br />
                Email ini dikirim secara otomatis, mohon tidak membalas.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
        html,
      });
    },
    onPasswordReset: async ({ user }) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
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
        input: false,
      },
      opdId: {
        type: "string",
        required: false,
        input: false,
      },
      codeOpd: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },
});

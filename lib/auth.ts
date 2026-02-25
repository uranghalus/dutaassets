import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import { admin as adminPg, organization, username } from "better-auth/plugins";
import { ac, owner, admin, member } from "./auth-permission";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql", // or "mysql", "postgresql", ...etc
  }),
  //...
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail(
        user.email,
        "Reset Password Anda",
        `<p>Halo ${user.name},</p><p>Silakan klik link berikut untuk mereset password Anda: <a href="${url}">${url}</a></p>`,
      );
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail(
        user.email,
        "Verifikasi Email Anda",
        `<p>Halo ${user.name},</p><p>Silakan klik link berikut untuk memverifikasi email Anda: <a href="${url}">${url}</a></p>`,
      );
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: false,
    },
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
      username: {
        type: "string",
        input: true,
      },
    },
  },
  plugins: [
    nextCookies(),
    username(),
    adminPg(),
    organization({
      ac: ac,
      allowUserToCreateOrganization: true,
      roles: {
        owner,
        admin,
        member,
      },
      dynamicAccessControl: {
        enabled: true,
      },
      teams: {
        enabled: true,
      },
    }),
  ],
});

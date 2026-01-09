import { prisma } from './prisma';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';

import { admin as adminPg, organization, username } from 'better-auth/plugins';
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql', // or "mysql", "postgresql", ...etc
  }),
  //...
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
    additionalFields: {
      role: {
        type: 'string',
        input: false,
      },
      username: {
        type: 'string',
        input: true,
      },
    },
  },
  plugins: [nextCookies(), username(), adminPg(), organization()],
});

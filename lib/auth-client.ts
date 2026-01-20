import { nextCookies } from 'better-auth/next-js';
import { createAuthClient } from 'better-auth/react';
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
  usernameClient,
} from 'better-auth/client/plugins';

import { auth } from './auth';
// import { ac, admin, inspector, manager, superadmin } from './permissions';

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    inferAdditionalFields<typeof auth>(),
    nextCookies(),
    usernameClient(),
    organizationClient({
      dynamicAccessControl: {
        enabled: true,
      },
    }),
  ],
});

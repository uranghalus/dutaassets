import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
  usernameClient,
} from "better-auth/client/plugins";

import { auth } from "./auth";
import {
  ac,
  owner,
  admin,
  member,
  manager,
  supervisor,
  staff_lapangan,
  finance_manager,
  staff_asset,
} from "./auth-permission";

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    inferAdditionalFields<typeof auth>(),
    nextCookies(),
    usernameClient(),
    organizationClient({
      ac: ac,
      dynamicAccessControl: {
        enabled: true,
      },
      roles: {
        owner,
        admin,
        member,
        manager,
        supervisor,
        staff_lapangan,
        finance_manager,
        staff_asset,
      },
      teams: {
        enabled: true,
      },
    }),
  ],
});

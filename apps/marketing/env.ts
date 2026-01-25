import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

import { keys as routes } from '@workspace/routes/keys';

export const env = createEnv({
  extends: [routes()],
  server: {
    EMAIL_RESEND_API_KEY: z.string().optional(),
    EMAIL_MAILER: z.enum(['NodeMailer', 'Resend']).optional(),
    EMAIL_FROM: z.string().min(1)
  },
  client: {},
  runtimeEnv: {
    EMAIL_RESEND_API_KEY: process.env.EMAIL_RESEND_API_KEY,
    EMAIL_MAILER: process.env.EMAIL_MAILER,
    EMAIL_FROM: process.env.EMAIL_FROM
  }
});

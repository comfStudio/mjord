import { z } from 'zod';

import { UserHelpers } from '@/services/user';
import { t } from '@mjord/common';

export const zStudentEmail = z.string().min(3, t`Email must contain at least 3 characters`).email(t`Invalid email.`).superRefine((val, ctx) => {
    const domain = val.split('@')[1];
    if (domain && !UserHelpers.validEmailDomains.includes(domain.toLocaleLowerCase())) {

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "domain",
      });
    }
  });
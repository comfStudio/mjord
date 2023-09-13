import { z } from 'zod';

import { t } from '@mjord/common';

import { zStudentEmail } from './primitives';

export const loginSchema1 = z.object({
    email: zStudentEmail
});

export const loginSchema2 = z.object({
    token: z.string().min(1, t`Token must not be empty`)
});

/// Onboard

export const onboardSchema = z.object({
    name: z.string().min(3, t`Name must contain at least 3 characters`)
    .max(35, t`Name must not contain more than 35 characters`),
});


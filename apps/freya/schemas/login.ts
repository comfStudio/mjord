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

const schema = z.object({
  key: z.string(),
  key2: z.number().optional(),
});

const defs1 = schema.default({ key: "test" });

const d1 = defs1.parse({ key: "test" });

const defs2 = schema.default({ key: "test", key2: 1 });

const d2 = defs2.parse({ key: "test" });
const d3 = defs2.parse({});

console.debug({
  d1,
  d2,
});
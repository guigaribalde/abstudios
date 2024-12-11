import type { CreateUserSchema } from '@acme/database/schema';
import type { z } from 'zod';

export type UserType = z.infer<typeof CreateUserSchema>;

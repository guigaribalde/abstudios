import type { CreateUserSchema } from '@acme/database/schema';
import type { z } from 'zod';

export type TempUserType = z.infer<typeof CreateUserSchema>;

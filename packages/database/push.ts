import { execSync } from 'node:child_process';

const password = process.env.DATABASE_PASSWORD!;
const ref = process.env.DATABASE_REF!;

execSync(`pnpm run db:generate`, {
  stdio: 'inherit',
});

execSync(`pnpm supabase link --project-ref ${ref} -p ${password}`, {
  stdio: 'inherit',
});

execSync(`pnpm supabase db push`, {
  stdio: 'inherit',
});

execSync(`pnpm supabase unlink`, {
  stdio: 'inherit',
});

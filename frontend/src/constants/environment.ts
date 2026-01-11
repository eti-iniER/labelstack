import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.url(),
});

const _env = envSchema.safeParse(import.meta.env);

if (!_env.success) {
  console.error(
    "❌ Invalid environment variables:",
    z.treeifyError(_env.error),
  );
  throw new Error("Invalid environment variables");
}

export const environment = _env.data;

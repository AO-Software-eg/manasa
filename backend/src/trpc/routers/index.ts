import { router } from "../trpc.ts";
import { authRouter } from "./auth.ts";

export const appRouter = router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
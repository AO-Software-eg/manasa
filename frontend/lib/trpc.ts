import { httpBatchLink } from "@trpc/client";


// lib/trpc.ts
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@manasa/shared";

export const trpc = createTRPCReact<AppRouter>();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
    }),
  ],
});

export default trpcClient;
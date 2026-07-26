import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export type Context = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
};

export function createContext(
  { req, res }: CreateExpressContextOptions,
): Context {
  return {
    req,
    res,
  };
}
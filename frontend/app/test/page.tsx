"use client";

import { trpc } from "@/lib/trpc";

export default function TestPage() {
  const { data, isLoading, error } = trpc.auth.hello.useQuery();

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  return <h1>{data?.message}</h1>;
}
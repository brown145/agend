"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.error("NEXT_PUBLIC_CONVEX_URL is not set");
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ConvexQueryCacheProvider>{children}</ConvexQueryCacheProvider>
    </ConvexProviderWithClerk>
  );
}

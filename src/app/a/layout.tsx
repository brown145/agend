import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "./_components/ConvexClientProvider";
import Loading from "./loading";

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  console.error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
  throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
}

export default function AuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ConvexClientProvider>
        <SignedOut>
          <div className="flex justify-center h-screen pt-16">
            <SignIn withSignUp={true} fallback={<Loading />} />
          </div>
        </SignedOut>
        <SignedIn>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <UserButton />
          </header>
          <main className="flex-1">{children}</main>
          <Toaster />
        </SignedIn>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}

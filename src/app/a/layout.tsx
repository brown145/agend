import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "./_components/ConvexClientProvider";
import UserInitalizationProvider from "./_components/UserInitalizationProvider";
import ClientLayout from "./clientLayout";

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
        <UserInitalizationProvider>
          <SignedOut>
            {/* Should be protected by middleware */}
            <div className="flex justify-center items-center h-screen">
              <SignInButton />
              <SignUpButton />
            </div>
          </SignedOut>
          <SignedIn>
            <ClientLayout>
              <header className="flex justify-end items-center p-4 gap-4 h-16">
                <UserButton />
              </header>
              <main className="flex-1">{children}</main>
              <Toaster />
            </ClientLayout>
          </SignedIn>
        </UserInitalizationProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}

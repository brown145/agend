import {
  ClerkProvider,
  SignIn,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "agendry",
  description: "Manage your agendas and action items",
};

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ConvexClientProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <SignedOut>
              <div className="flex justify-center items-center h-screen">
                <SignIn />
              </div>
            </SignedOut>
            <SignedIn>
              <header className="flex justify-end items-center p-4 gap-4 h-16">
                <UserButton />
              </header>
              test123
              <main className="flex-1">{children}</main>
              <Toaster />
            </SignedIn>
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}

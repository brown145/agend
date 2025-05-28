import type { Preview } from "@storybook/nextjs-vite";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
import "../src/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story) => (
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;

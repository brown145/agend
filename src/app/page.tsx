"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    redirect("/a/");
  }, []);

  return (
    <div className="flex justify-center pt-16">
      <Link
        href="/a/"
        className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors duration-200"
      >
        Use the app
      </Link>
    </div>
  );
}

"use client";

import { useUserInitalization } from "@/app/a/_components/UserInitalizationProvider";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthedPage() {
  return <RedirectToOrganization />;
}

function RedirectToOrganization() {
  const router = useRouter();
  const { personalOrgId } = useUserInitalization();

  useEffect(() => {
    if (personalOrgId) {
      router.push(`/a/${personalOrgId}`);
    }
  }, [router, personalOrgId]);

  return <Loader text="redirecting..." />;
}

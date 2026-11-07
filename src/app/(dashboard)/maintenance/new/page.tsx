"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewMaintenanceRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/maintenance");
  }, [router]);

  return null;
}

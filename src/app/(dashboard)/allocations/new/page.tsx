"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewAllocationRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/allocations");
  }, [router]);

  return null;
}

import { AuditDetailClient } from "@/components/audits/AuditDetailClient";

export function generateStaticParams() {
  return [
    { auditId: "AUD-2026-Q1" },
    { auditId: "AUD-2026-Q2" },
    { auditId: "AUD-2026-Q3" },
    { auditId: "demo" },
  ];
}

export default async function AuditDetailPage({
  params,
}: {
  params: Promise<{ auditId: string }>;
}) {
  const { auditId } = await params;
  return <AuditDetailClient auditId={auditId} />;
}

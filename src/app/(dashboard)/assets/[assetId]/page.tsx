import { AssetDetailClient } from "@/components/assets/AssetDetailClient";

export function generateStaticParams() {
  const ids = [];
  for (let i = 1001; i <= 1060; i++) {
    ids.push({ assetId: `AST-${i}` });
  }
  ids.push({ assetId: "demo" });
  return ids;
}

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  return <AssetDetailClient assetId={assetId} />;
}

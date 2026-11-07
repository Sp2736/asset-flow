import { AssetHistoryClient } from "@/components/assets/AssetHistoryClient";

export function generateStaticParams() {
  const ids = [];
  for (let i = 1001; i <= 1060; i++) {
    ids.push({ assetId: `AST-${i}` });
  }
  ids.push({ assetId: "demo" });
  return ids;
}

export default async function AssetHistoryPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  return <AssetHistoryClient assetId={assetId} />;
}

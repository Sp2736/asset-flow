"use client";

import React from "react";
import Link from "next/link";
import { Eye, SlidersHorizontal } from "lucide-react";
import { Asset } from "@/types";
import { AssetStatusBadge } from "./AssetStatusBadge";

interface AssetTableProps {
  assets: Asset[];
  onOpenStatusModal?: (asset: Asset) => void;
  canManageAssets?: boolean;
}

export function AssetTable({ assets, onOpenStatusModal, canManageAssets = false }: AssetTableProps) {
  if (assets.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground">
        No assets found matching the criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
            <th className="py-3 px-4">Asset ID</th>
            <th className="py-3 px-4">Name & Model</th>
            <th className="py-3 px-4">Serial Number</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Department & Location</th>
            <th className="py-3 px-4">Cost</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Current Custody</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {assets.map((asset) => (
            <tr key={asset.id} className="hover:bg-muted/30 transition-colors">
              <td className="py-3 px-4 font-mono font-semibold text-foreground">
                {asset.id}
              </td>
              <td className="py-3 px-4">
                <div className="font-bold text-foreground">
                  <Link href={`/assets/${asset.id}`} className="hover:text-primary hover:underline">
                    {asset.name}
                  </Link>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  {asset.model}
                </div>
              </td>
              <td className="py-3 px-4 font-mono text-muted-foreground text-[11px]">
                {asset.serialNumber}
              </td>
              <td className="py-3 px-4 text-foreground/90 font-medium">
                {asset.categoryName}
              </td>
              <td className="py-3 px-4">
                <div className="text-foreground">{asset.departmentName}</div>
                <div className="text-[11px] text-muted-foreground">{asset.location}</div>
              </td>
              <td className="py-3 px-4 font-mono font-medium text-foreground">
                ${asset.acquisitionCost.toLocaleString()}
              </td>
              <td className="py-3 px-4">
                <AssetStatusBadge status={asset.status} size="sm" />
              </td>
              <td className="py-3 px-4">
                {asset.assignedToEmployeeName ? (
                  <span className="font-medium text-foreground">
                    {asset.assignedToEmployeeName}
                  </span>
                ) : (
                  <span className="text-muted-foreground/60 italic">Unallocated</span>
                )}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="inline-flex items-center gap-1.5">
                  <Link
                    href={`/assets/${asset.id}`}
                    title="View Details"
                    className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                  {canManageAssets && onOpenStatusModal && (
                    <button
                      onClick={() => onOpenStatusModal(asset)}
                      title="Update Status"
                      className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-primary"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


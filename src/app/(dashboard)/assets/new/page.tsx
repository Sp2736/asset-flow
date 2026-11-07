"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Laptop, CheckCircle2, ShieldAlert } from "lucide-react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { Button } from "@/components/ui/button";
import { AssetStatus } from "@/types";
import { toast } from "sonner";

export default function NewAssetPage() {
  const router = useRouter();
  const { departments, categories, createAsset } = useMockDatabase();

  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || "");
  const [location, setLocation] = useState("");
  const [acquisitionCost, setAcquisitionCost] = useState("1200");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [condition, setCondition] = useState<"Mint" | "Good" | "Fair" | "Needs Maintenance">("Mint");
  const [status, setStatus] = useState<AssetStatus>("Available");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !model || !serialNumber) {
      toast.error("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);

    const selectedCat = categories.find((c) => c.id === categoryId);
    const selectedDept = departments.find((d) => d.id === departmentId);

    const newAsset = createAsset({
      name,
      model,
      serialNumber,
      categoryId,
      categoryName: selectedCat?.name || "General",
      departmentId,
      departmentName: selectedDept?.name || "Operations",
      location: location || `${selectedDept?.name} Office`,
      acquisitionCost: parseFloat(acquisitionCost) || 0,
      purchaseDate,
      condition,
      status,
      notes,
    });

    toast.success(`Asset ${newAsset.id} registered successfully!`, {
      description: `${newAsset.name} added to ${newAsset.departmentName}`,
    });

    setTimeout(() => {
      router.push("/assets");
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
          <Link href="/assets">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Ledger
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Register Physical Asset
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Enroll a new physical device, workstation, or infrastructure hardware unit into the central ledger.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Asset Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MacBook Pro Mock-16 (M3 Max)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Model Number / Code <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MBP16-M3M-64G"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Serial Number <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SN-MBP-908124"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground font-mono outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Assigned Department
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Physical Location / Desk
              </label>
              <input
                type="text"
                placeholder="e.g. Floor 4 - Tech Hub Desk 4A"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Acquisition Cost ($ USD)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={acquisitionCost}
                onChange={(e) => setAcquisitionCost(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground font-mono outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Purchase Date
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Physical Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
              >
                <option value="Mint">Mint (Brand New)</option>
                <option value="Good">Good (Operational)</option>
                <option value="Fair">Fair (Shows Wear)</option>
                <option value="Needs Maintenance">Needs Maintenance</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
              >
                <option value="Available">Available (In Storage / Ready for Allocation)</option>
                <option value="Reserved">Reserved (Staged for Onboarding)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Internal Asset Notes / Tags
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Dedicated for frontend engineering builds, includes Thunderbolt cable and 140W brick."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link href="/assets">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs bg-primary text-primary-foreground gap-2"
            >
              {isSubmitting ? "Registering..." : "Register Asset"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

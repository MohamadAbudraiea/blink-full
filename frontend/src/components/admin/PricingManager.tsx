import { useState, useEffect } from "react";
import { useGetPricing, useUpdatePricing } from "@/hooks/usePricing";
import type { ServicePricing } from "@/hooks/usePricing";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, DollarSign, TrendingUp, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SERVICE_LABELS: Record<string, string> = {
  wash: "Car Wash",
  dryclean: "Dry Clean",
  polish: "Polish",
  graphene: "Graphene Coat",
  nanoceramic: "Nano Ceramic",
};

const SERVICE_COLORS: Record<string, string> = {
  wash: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30",
  dryclean: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
  polish: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
  graphene: "from-violet-500/20 to-violet-500/5 border-violet-500/30",
  nanoceramic: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
};

interface EditState {
  base_price: string;
  plan_2_price: string;
  plan_4_price: string;
  plan_8_price: string;
}

function ServicePricingCard({
  row,
}: {
  row: ServicePricing;
}) {
  const { updatePricingMutation, isUpdatingPricing } = useUpdatePricing();
  const [edit, setEdit] = useState<EditState>({
    base_price: String(row.base_price),
    plan_2_price: String(row.plan_2_price),
    plan_4_price: String(row.plan_4_price),
    plan_8_price: String(row.plan_8_price),
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setEdit({
      base_price: String(row.base_price),
      plan_2_price: String(row.plan_2_price),
      plan_4_price: String(row.plan_4_price),
      plan_8_price: String(row.plan_8_price),
    });
    setIsDirty(false);
  }, [row]);

  const handleChange = (field: keyof EditState, val: string) => {
    setEdit((prev) => ({ ...prev, [field]: val }));
    setIsDirty(true);
  };

  const handleSave = () => {
    updatePricingMutation({
      service: row.service,
      base_price: parseFloat(edit.base_price) || 0,
      plan_2_price: parseFloat(edit.plan_2_price) || 0,
      plan_4_price: parseFloat(edit.plan_4_price) || 0,
      plan_8_price: parseFloat(edit.plan_8_price) || 0,
    });
    setIsDirty(false);
  };

  const colorClass = SERVICE_COLORS[row.service] || "from-primary/20 to-primary/5 border-primary/30";
  const baseNum = parseFloat(edit.base_price) || 0;
  const beforePrice = Math.round(baseNum * 1.1);

  const fields: { key: keyof EditState; label: string; icon: React.ReactNode; hint?: string }[] = [
    {
      key: "base_price",
      label: "Base Price (Single Service)",
      icon: <Tag className="w-3.5 h-3.5" />,
      hint: `Shown as: ~~${beforePrice} JD~~ → ${Math.round(baseNum)} JD`,
    },
    {
      key: "plan_2_price",
      label: "Plan ×2 Price (Total)",
      icon: <DollarSign className="w-3.5 h-3.5" />,
      hint: `Before: ${Math.round(baseNum * 2)} JD → After: ${edit.plan_2_price || 0} JD`,
    },
    {
      key: "plan_4_price",
      label: "Plan ×4 Price (Total)",
      icon: <DollarSign className="w-3.5 h-3.5" />,
      hint: `Before: ${Math.round(baseNum * 4)} JD → After: ${edit.plan_4_price || 0} JD`,
    },
    {
      key: "plan_8_price",
      label: "Plan ×8 Price (Total)",
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      hint: `Before: ${Math.round(baseNum * 8)} JD → After: ${edit.plan_8_price || 0} JD`,
    },
  ];

  return (
    <Card className={`relative overflow-hidden border bg-gradient-to-br ${colorClass} transition-all duration-300 hover:shadow-lg`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold capitalize">
            {SERVICE_LABELS[row.service] || row.service}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isDirty && (
              <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/50 animate-pulse">
                Unsaved
              </Badge>
            )}
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isDirty || isUpdatingPricing}
              className="h-8 gap-1.5"
            >
              {isUpdatingPricing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save
            </Button>
          </div>
        </div>
        <CardDescription className="text-xs">
          Edit prices. Changes are saved per-service.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
              {f.icon}
              {f.label}
            </label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={edit[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
                className="pr-14 bg-background/60"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                JD
              </span>
            </div>
            {f.hint && (
              <p className="text-xs text-muted-foreground/70 font-light">{f.hint}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PricingManager() {
  const { pricing, isGettingPricing } = useGetPricing();

  if (isGettingPricing) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold">Service Pricing</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Set the base price and subscription plan prices for each service.
            The "before" price shown to users is automatically calculated as{" "}
            <strong>base + 10%</strong>.
          </p>
        </div>
      </div>

      {/* Info box */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm space-y-1">
        <p className="font-semibold text-primary">How pricing is displayed to users:</p>
        <ul className="text-muted-foreground space-y-1 text-xs">
          <li>• <strong>Single service</strong>: crossed-out price = base×1.1 (rounded), final price = base</li>
          <li>• <strong>Subscription ×2</strong>: crossed-out = base×2, final = Plan ×2 price</li>
          <li>• <strong>Subscription ×4</strong>: crossed-out = base×4, final = Plan ×4 price</li>
          <li>• <strong>Subscription ×8</strong>: crossed-out = base×8, final = Plan ×8 price</li>
        </ul>
      </div>

      {/* Service cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {pricing.map((row) => (
          <ServicePricingCard key={row.service} row={row} />
        ))}
      </div>

      {pricing.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No pricing data found. Make sure the backend is running and the database is synced.
        </div>
      )}
    </div>
  );
}

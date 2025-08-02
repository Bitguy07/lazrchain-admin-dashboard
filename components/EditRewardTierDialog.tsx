import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

// New type based on InvestmentTier schema
interface InvestmentTier {
  min: number;
  max: number;
  dailyYieldMin: number;
  dailyYieldMax: number;
  description: string;
}

type EditableField =
  | "min"
  | "max"
  | "dailyYieldMin"
  | "dailyYieldMax"
  | "description"
  | "minMax"
  | "dailyYieldRange";

interface EditTierDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tier: InvestmentTier;
  index: number;
  field: EditableField;
  onSave: (updatedField: Partial<InvestmentTier>, index: number) => void;
}

export default function EditTierDialog({
  isOpen,
  onClose,
  tier,
  index,
  field,
  onSave,
}: EditTierDialogProps) {
  const [min, setMin] = useState(tier.min);
  const [max, setMax] = useState(tier.max);
  const [dailyMin, setDailyMin] = useState(tier.dailyYieldMin);
  const [dailyMax, setDailyMax] = useState(tier.dailyYieldMax);
  const [description, setDescription] = useState(tier.description);

  useEffect(() => {
    setMin(tier.min);
    setMax(tier.max);
    setDailyMin(tier.dailyYieldMin);
    setDailyMax(tier.dailyYieldMax);
    setDescription(tier.description);
  }, [tier, isOpen]);

  const handleSave = () => {
    const updated: Partial<InvestmentTier> = {};

    if (field === "minMax") {
      if (min !== tier.min) updated.min = min;
      if (max !== tier.max) updated.max = max;
    } else if (field === "min" && min !== tier.min) {
      updated.min = min;
    } else if (field === "max" && max !== tier.max) {
      updated.max = max;
    } else if (field === "dailyYieldRange") {
      if (dailyMin !== tier.dailyYieldMin) updated.dailyYieldMin = dailyMin;
      if (dailyMax !== tier.dailyYieldMax) updated.dailyYieldMax = dailyMax;
    } else if (field === "dailyYieldMin" && dailyMin !== tier.dailyYieldMin) {
      updated.dailyYieldMin = dailyMin;
    } else if (field === "dailyYieldMax" && dailyMax !== tier.dailyYieldMax) {
      updated.dailyYieldMax = dailyMax;
    } else if (field === "description" && description !== tier.description) {
      updated.description = description;
    }

    if (Object.keys(updated).length === 0) {
      toast({
        title: "No changes made",
        description: "The values are the same as before.",
      });
      onClose();
      return;
    }

    onSave(updated, index);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-lg text-foreground">Edit</DialogTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Update the selected field of this tier
          </CardDescription>
        </DialogHeader>

        <div className="space-y-4">
          {(field === "min" || field === "minMax") && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Min Investment
              </label>
              <Input
                type="number"
                inputMode="numeric"
                value={min === 0 ? "" : min}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isNaN(val)) setMin(val);
                }}
                placeholder={`$${tier.min}`}
              />
            </div>
          )}

          {(field === "max" || field === "minMax") && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Max Investment
              </label>
              <Input
                type="number"
                inputMode="numeric"
                value={max === 0 ? "" : max}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isNaN(val)) setMax(val);
                }}
                placeholder={`$${tier.max}`}
              />
            </div>
          )}

          {(field === "dailyYieldMin" || field === "dailyYieldRange") && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Daily Yield Min (%)
              </label>
              <Input
                type="number"
                inputMode="numeric"
                value={dailyMin === 0 ? "" : dailyMin}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isNaN(val)) setDailyMin(val);
                }}
                placeholder={`${tier.dailyYieldMin}%`}
              />
            </div>
          )}

          {(field === "dailyYieldMax" || field === "dailyYieldRange") && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Daily Yield Max (%)
              </label>
              <Input
                type="number"
                inputMode="numeric"
                value={dailyMax === 0 ? "" : dailyMax}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isNaN(val)) setDailyMax(val);
                }}
                placeholder={`${tier.dailyYieldMax}%`}
              />
            </div>
          )}

          {field === "description" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Description
              </label>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={tier.description}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSave} className="w-full shadow-md">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

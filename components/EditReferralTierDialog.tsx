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

type Tier = {
  minInvestment: number;
  maxInvestment: number;
  referralPercentage: number;
  description: string;
};

type EditableField =
  | "minInvestment"
  | "maxInvestment"
  | "referralPercentage"
  | "description"
  | "minMax";

interface EditTierDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tier: Tier;
  index: number;
  field: EditableField;
  onSave: (updatedField: Partial<Tier>, index: number) => void;
}

export default function EditTierDialog({
  isOpen,
  onClose,
  tier,
  index,
  field,
  onSave,
}: EditTierDialogProps) {
  const [min, setMin] = useState(tier.minInvestment);
  const [max, setMax] = useState(tier.maxInvestment);
  const [percentage, setPercentage] = useState(tier.referralPercentage);
  const [description, setDescription] = useState(tier.description);

  useEffect(() => {
    setMin(tier.minInvestment);
    setMax(tier.maxInvestment);
    setPercentage(tier.referralPercentage);
    setDescription(tier.description);
  }, [tier, isOpen]);

  const handleSave = () => {
    const updated: Partial<Tier> = {};

    if (field === "minMax") {
      if (min !== tier.minInvestment) updated.minInvestment = min;
      if (max !== tier.maxInvestment) updated.maxInvestment = max;
    } else if (field === "minInvestment" && min !== tier.minInvestment) {
      updated.minInvestment = min;
    } else if (field === "maxInvestment" && max !== tier.maxInvestment) {
      updated.maxInvestment = max;
    } else if (
      field === "referralPercentage" &&
      percentage !== tier.referralPercentage
    ) {
      updated.referralPercentage = percentage;
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
          {(field === "minInvestment" || field === "minMax") && (
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
                placeholder={`$${tier.minInvestment}`}
              />
            </div>
          )}

          {(field === "maxInvestment" || field === "minMax") && (
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
                placeholder={`$${tier.maxInvestment}`}
              />
            </div>
          )}

          {field === "referralPercentage" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Referral Percentage
              </label>
              <Input
                type="number"
                inputMode="numeric"
                value={percentage === 0 ? "" : percentage}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isNaN(val)) setPercentage(val);
                }}
                placeholder={`${tier.referralPercentage}%`}
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

"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Coins, Zap, Star, Users } from "lucide-react";

import { useGetInvestmentTiersQuery } from "@/reduxElement/RTK_Queries/tiers";
import { useUpdateInvestmentTierMutation } from "@/reduxElement/RTK_Queries/tiers";

import { openDialog, closeDialog } from "@/reduxElement/Slices/tierRewEdit";
import EditTierDialog from "@/components/EditRewardTierDialog";

type TierData = {
  _id: string;
  tierName: string;
  min: number;
  max: number;
  dailyYieldMin: number;
  dailyYieldMax: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Optional UI props
  gradient?: string;
};



// Icons and gradient styles for static assignment
const strategyStyles = [
  { icon: Coins, gradient: "from-green-400 to-emerald-500" },
  { icon: Zap, gradient: "from-blue-400 to-cyan-500" },
  { icon: Star, gradient: "from-purple-400 to-pink-500" },
];

// Skeleton loader for investment strategy cards
const StrategySkeleton = () => (
  <Card className="bg-white dark:bg-gray-500 shadow-lg overflow-hidden animate-pulse">
    <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300" />
    <CardContent className="p-4 sm:p-6 flex items-start space-x-4">
      <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-r from-gray-200 to-gray-300" />
      <div className="flex-1 space-y-5 mt-2">
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-300 rounded" />
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-300 rounded" />
        <div className="h-6 w-40 bg-green-100 dark:bg-green-700/20 border border-green-200 dark:border-green-700 rounded" />
      </div>
    </CardContent>
  </Card>
);

// Transform tier data to UI display format
const mergeInvestmentTiers = (tiers: any[] = []) => {
  return tiers.map((tier, index) => ({
    ...tier,
    ...strategyStyles[index % strategyStyles.length], // Cyclical fallback
    label: `$${tier.min} - $${tier.max}`,
    minYield: tier.dailyYieldMin,
    maxYield: tier.dailyYieldMax,
  }));
};


export default function RewardsPage() {
  const { toast } = useToast();
    const dispatch = useAppDispatch();
    const { selectedField, selectedIndex, dialogOpen } = useAppSelector((state) => state.tierRewEdit);
    const [updateInvestmentTier] = useUpdateInvestmentTierMutation();
  
    type EditableField =         "min"
      | "max"
      | "dailyYieldMin"
      | "dailyYieldMax"
      | "description"
      | "minMax" 
      | "dailyYieldRange" ;

      const { data: tierData, error: tierError, isLoading: tierLoading } = useGetInvestmentTiersQuery();

  const handleEdit = (index: number, field: EditableField) => {
    dispatch(openDialog({ index, field }));
  };
  
const handleSave = async (updatedField: Partial<TierData>, index: number) => {
    if (!tierData?.tiers || !tierData.tiers[index]) return;

    const tier = tierData.tiers[index];
    const id = tier._id;

    if (Object.keys(updatedField).length === 0) {
      toast({ title: "No changes made", description: "Nothing was updated." });
      return;
    }

    try {
      const res = await updateInvestmentTier({ id, body: updatedField }).unwrap();
      if (res.success) {
        toast({ title: "Updated", description: "Tier updated successfully!" });
      } else {
        toast({
          title: "Update failed",
          description: "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tier.",
        variant: "destructive",
      });
    }
  };


  useEffect(() => {
    if (tierError) {
      toast({
        variant: "destructive",
        title: "Error loading investment tiers",
        description: "Something went wrong while fetching strategy tiers.",
      });
    }
  }, [tierError]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-semibold">
            <Coins className="w-6 h-6 mr-3 text-yellow-500" />
            Investment Strategy Tiers
          </CardTitle>
          <CardDescription className="text-md text-gray-600">
            Maximize your returns with strategic investment levels
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4">
            {tierLoading
              ? Array(3)
                  .fill(null)
                  .map((_, i) => <StrategySkeleton key={i} />)
              : mergeInvestmentTiers(tierData?.tiers).map((strategy, index) => (
                  <Card
                    key={index}
                    className={`pt-3 bg-gradient-to-r ${strategy.gradient} shadow-lg dark:bg-gray-800`}
                  >
                    <CardContent className="p-4 bg-white rounded-b-[11px] pt-7 pl-7 pb-7 flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${strategy.gradient} scale-110 rounded-2xl flex items-center justify-center`}
                      >
                        <strategy.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="pl-1 ">
                        <h4 className="text-lg font-semibold -mt-1"><span onClick={() => handleEdit(index, "minMax")}  className="hover:bg-gray-200 cursor-pointer rounded-xl px-1">{strategy.label}</span></h4>
                        <p className="text-sm  pt-2">
                            <span onClick={() => handleEdit(index, "description")}  className="hover:bg-gray-200 cursor-pointer rounded-xl px-1">{strategy.description}</span>
                        </p>
                        <Badge
                          onClick={() => handleEdit(index, "dailyYieldRange")}
                          variant="outline"
                          className="bg-green-100 dark:bg-green-900/20 mt-3 font-bold hover:text-green-500 cursor-pointer text-green-700"
                        >
                          {strategy.minYield}% - {strategy.maxYield}% Daily
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </CardContent>
      </Card>
        { selectedIndex !== null &&
          selectedField &&
          dialogOpen &&
          tierData?.tiers &&
          tierData.tiers[selectedIndex] &&
          (
        <EditTierDialog
            isOpen={dialogOpen}
            onClose={() => dispatch(closeDialog())}
            tier={mergeInvestmentTiers(tierData?.tiers || [])[selectedIndex]}
            index={selectedIndex}
            field={selectedField}
            onSave={handleSave}
        />
        )}
    </div>
  );
}

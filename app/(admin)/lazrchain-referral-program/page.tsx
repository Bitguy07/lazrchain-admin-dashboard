"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { Users, TrendingUp, Star } from "lucide-react";

import { useGetReferralBonusTiersQuery } from "@/reduxElement/RTK_Queries/tiers";
import { useUpdateReferralTierMutation } from "@/reduxElement/RTK_Queries/tiers";

import EditTierDialog from "@/components/EditReferralTierDialog";

import { openDialog, closeDialog } from "@/reduxElement/Slices/tierRefEdit";


type TierData = {
  minInvestment: number;
  maxInvestment: number;
  referralPercentage: number;
  description: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradient?: string;
};

const tierVisuals = [
  { icon: Users, gradient: "from-green-400 to-teal-500" },
  { icon: TrendingUp, gradient: "from-blue-400 to-indigo-500" },
  { icon: Star, gradient: "from-purple-400 to-violet-500" }
];

const referralsData = [
  {
    email: "user1@example.com",
    investment: "$80.00",
    reward: "$0.4600",
    earnings: "$0.0368",
    status: "Active"
  },
  {
    email: "user2@example.com",
    investment: "$200.00",
    reward: "$4.2000",
    earnings: "$0.6300",
    status: "Active"
  },
  {
    email: "user3@example.com",
    investment: "$600.00",
    reward: "$0.0000",
    earnings: "$0.0000",
    status: "Pending"
  }
];

const ReferralTierSkeleton = () => (
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

const ReferralProgram = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { adminEmail } = useAppSelector((state) => state.auth);
  const { selectedField, selectedIndex, dialogOpen } = useAppSelector((state) => state.tierRefEdit);

  type EditableField = "minInvestment" | "maxInvestment" | "referralPercentage" | "description" | "minMax";
  const [selectedTierIndex, setSelectedTierIndex] = useState<number | null>(null);

  const [updateReferralTier] = useUpdateReferralTierMutation();

  const {
    data: tierData,
    isLoading: isTiersLoading,
    error: tierError,
  } = useGetReferralBonusTiersQuery();


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
    const res = await updateReferralTier({ id, body: updatedField }).unwrap();
    if (res.success) {
      toast({ title: "Updated", description: "Tier updated successfully!" });
    } else {
      toast({ title: "Update failed", description: "Something went wrong.", variant: "destructive" });
    }
  } catch (error) {
    toast({ title: "Error", description: "Failed to update tier.", variant: "destructive" });
  }
};


const mergeTierData = (tiersFromApi: NonNullable<typeof tierData>['tiers']) => {
    return tiersFromApi.map((tier, index) => ({
      ...tier,
      ...tierVisuals[index % tierVisuals.length], // fallback cyclically if >3
    }));
  };

  useEffect(() => {
    if (tierError) {
      toast({
        title: "Error",
        description: "Failed to fetch referral tiers.",
        variant: "destructive",
      });
    }
  }, [tierError]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Referral Tier Card */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 shadow-xl">
        <CardContent className="space-y-6 pt-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Referral Bonus Tiers
            </h3>
            <div className="grid gap-4">
              {isTiersLoading ? (
                Array(3).fill(0).map((_, i) => <ReferralTierSkeleton key={i} />)
              ) : (
                tierData?.tiers && mergeTierData(tierData.tiers).map((tier, index) => (
                  <Card key={index} className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${tier.gradient}`} />
                    <CardContent className="p-4 sm:p-6 flex items-start space-x-4">
                      <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-r ${tier.gradient}`}>
                        {tier.icon && <tier.icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />}
                      </div>
                      <div className="flex-1  flex flex-col space-y-1">
                        <span><span onClick={() => handleEdit(index, "minMax")} className="text-base sm:text-lg cursor-pointer hover:bg-gray-200 rounded-xl px-1 pb-0.5 font-bold mb-2 text-gray-900 dark:text-white">
                          ${tier.minInvestment} - ${tier.maxInvestment}
                        </span></span>
                        <span><span onClick={() => handleEdit(index, "description")} className="text-sm cursor-pointer hover:bg-gray-200 rounded-xl px-1 pb-0.5 text-gray-600 dark:text-gray-300 mb-3">
                          {tier.description}
                        </span></span>
                        <span><Badge onClick={() => handleEdit(index, "referralPercentage")} className="bg-green-50 cursor-pointer  dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 font-semibold">
                          {tier.referralPercentage}% of Referral's Daily Reward
                        </Badge></span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center shadow-xl p-6">
              <div className="text-3xl font-bold mb-1">3</div>
              <div className="text-sm opacity-90">Total Referrals</div>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center shadow-xl p-6">
              <div className="text-3xl font-bold mb-1">$0.6668</div>
              <div className="text-sm opacity-90">Daily Earnings</div>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center shadow-xl p-6">
              <div className="text-3xl font-bold mb-1">2</div>
              <div className="text-sm opacity-90">Active Referrals</div>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Referral Performance Table */}
      {/* <Card className="bg-white dark:bg-gray-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg">Referral Performance</CardTitle>
          <CardDescription>
            Track users referrals and their daily contributions
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-700 dark:text-gray-200">
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Investment</th>
                <th className="px-4 py-3 text-left">Daily Reward</th>
                <th className="px-4 py-3 text-left">User Earnings</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {referralsData.map((ref, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{ref.email}</td>
                  <td className="px-4 py-3 font-bold text-green-600 dark:text-green-400">{ref.investment}</td>
                  <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">{ref.reward}</td>
                  <td className="px-4 py-3 font-bold text-purple-600 dark:text-purple-400">{ref.earnings}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
                      ref.status === "Active"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                    }`}>
                      {ref.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card> */}
        {  selectedIndex !== null &&
          selectedField &&
          dialogOpen &&
          tierData?.tiers &&
          tierData.tiers[selectedIndex] &&
          (
          <EditTierDialog
            isOpen={dialogOpen}
            onClose={() => dispatch(closeDialog())}
            tier={mergeTierData(tierData?.tiers || [])[selectedIndex]}
            index={selectedIndex}
            field={selectedField}
            onSave={handleSave}
          />
        )}
    </div>
  );
};

export default ReferralProgram;

'use client';

import { useState, useMemo } from "react";
import EarningsChart from "@/components/EarningsChart";
import {
  DollarSign,
  TrendingUp,
  Coins,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ✅ Dummy earnings data generator
function getDummyEarningsData(count = 7) {
  const result = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    result.push({
      date: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
      daily_earnings: parseFloat((Math.random() * 500).toFixed(4)),
      referral_earnings: parseFloat((Math.random() * 100).toFixed(4)),
    });
  }
  return result.reverse(); // Oldest first
}

const DashboardPage = () => {
  
  const pastEarnings = useMemo(() => getDummyEarningsData(10), []);
  const chartData = {
    labels: pastEarnings.map((e) => e.date),
    datasets: [
      {
        label: "USDT Earnings",
        data: pastEarnings.map(
          (e) => e.daily_earnings + (e.referral_earnings || 0)
        ),
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsla(var(--primary), 0.1)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Balance & Earnings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-crypto hover:card-glow transition-all duration-300 border-0 overflow-hidden">
          <CardHeader className="bg-gradient-primary text-primary-foreground relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardTitle className="flex items-center text-base sm:text-lg relative z-10">
              <DollarSign className="w-5 h-5 mr-2 bg-white/20 p-1 rounded-full" />
              USDT Balance
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-sm relative z-10">
              Current USDT deposit in Smart Contract
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="text-center bg-gradient-to-r from-muted/50 to-muted rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                $359399.39
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">USDT Balance</div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-crypto hover:card-glow transition-all duration-300 border-0 overflow-hidden">
          <CardHeader className="bg-gradient-secondary text-secondary-foreground relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardTitle className="flex items-center text-base sm:text-lg relative z-10">
              <TrendingUp className="w-5 h-5 mr-2 bg-white/20 p-1 rounded-full" />
              Real-Time Yield Farming
            </CardTitle>
            <CardDescription className="text-secondary-foreground/80 text-sm relative z-10">
              Current Yield 
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="text-center bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                $108234.56
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">Daily Yield (USDT)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card>
        <EarningsChart
          chartData={chartData}
          chartOptions={chartOptions}
        />
      </Card>

      {/* Earnings History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-foreground">
            <Coins className="w-5 h-5 mr-2 text-warning" />
            Earnings History
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Detailed record of your daily USDT earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm font-semibold text-foreground">Date</TableHead>
                  <TableHead className="text-right text-sm font-semibold text-foreground">Amount (USDT)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastEarnings.map((earning, index) => (
                  <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="text-sm font-medium text-muted-foreground">
                      {earning.date}
                    </TableCell>
                    <TableCell className="text-right font-bold text-sm text-success">
                      ${(earning.daily_earnings + (earning.referral_earnings || 0)).toFixed(4)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

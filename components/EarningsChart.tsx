"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Line } from "react-chartjs-2";

// ✅ Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// ✅ Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EarningsChartProps {
  chartData: any;
  chartOptions: any;
}

const EarningsChart: React.FC<EarningsChartProps> = ({ chartData, chartOptions }) => {
  return (
    <Card className="card-crypto border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-success to-primary text-success-foreground">
        <CardTitle className="flex items-center text-base sm:text-lg">
          <TrendingUp className="w-5 h-5 mr-2 bg-white/20 p-1 rounded-full" />
          Earnings Analytics
        </CardTitle>
        <CardDescription className="text-success-foreground/80 text-sm">
          Track your earning performance over time
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsChart;

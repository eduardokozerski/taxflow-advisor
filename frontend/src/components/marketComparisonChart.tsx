"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MarketBenchmark } from "@/types/analysis";

type MarketComparisonChartProps = {
  benchmark: MarketBenchmark;
};

export const MarketComparisonChart = ({ benchmark }: MarketComparisonChartProps) => {
  const chartData = [
    {
      indicador: "Carga tributária",
      empresa: benchmark.taxRateCompany,
      mercado: benchmark.taxRateMarket
    },
    {
      indicador: "Folha salarial",
      empresa: benchmark.payrollRateCompany,
      mercado: benchmark.payrollRateMarket
    },
    {
      indicador: "Margem operacional",
      empresa: benchmark.marginCompany,
      mercado: benchmark.marginMarket
    }
  ];

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.35} />
          <XAxis dataKey="indicador" tick={{ fill: "#e4e4e7", fontSize: 12 }} />
          <YAxis tick={{ fill: "#e4e4e7", fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="empresa" fill="#818cf8" radius={6} />
          <Bar dataKey="mercado" fill="#34d399" radius={6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

import React, { useMemo } from "react";
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ISale } from "../interfaces/ISales";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
);

const SalesChart: React.FC<{
  filter: "week" | "month" | "year";
  dataset?: ISale[];
}> = ({ filter = "week", dataset = [] }) => {
  const { labels, amounts } = useMemo(() => {
    const end = new Date();
    let start: Date;
    const timeFrames: Date[] = [];

    switch (filter) {
      case "week":
        start = new Date(end);
        start.setDate(end.getDate() - 6);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          timeFrames.push(new Date(d));
        }
        break;
      case "month":
        start = new Date(end);
        start.setDate(1); // First day of the current month
        while (start <= end) {
          timeFrames.push(new Date(start));
          start.setDate(start.getDate() + 1);
        }
        break;
      case "year":
        start = new Date(end);
        start.setMonth(end.getMonth() - 11); // 12 months ago
        for (let i = 0; i < 12; i++) {
          timeFrames.push(new Date(start));
          start.setMonth(start.getMonth() + 1);
        }
        break;
    }

    const salesMap = new Map<string, number>();
    dataset.forEach((sale) => {
      const saleDate = new Date(sale.created_at);
      let key: string;
      switch (filter) {
        case "week":
        case "month":
          key = saleDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          break;
        case "year":
          key = saleDate.toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          });
          break;
      }
      salesMap.set(key, (salesMap.get(key) || 0) + sale.total_amount);
    });

    const labels: string[] = [];
    const amounts: number[] = [];

    timeFrames.forEach((date) => {
      let label: string;
      switch (filter) {
        case "week":
        case "month":
          label = date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          });
          break;
        case "year":
          label = date.toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          });
          break;
      }
      labels.push(label);
      amounts.push(salesMap.get(label) || 0);
    });

    return { labels, amounts };
  }, [dataset, filter]);

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Sales revenue",
        data: amounts,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text:
          filter === "year"
            ? "Sales in the last 12 months"
            : `Sales in the last ${filter}`,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    hover: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line className="max-h-72 w-full" options={options} data={data} />;
};

export default SalesChart;

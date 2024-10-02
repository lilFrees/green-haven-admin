import { useMemo } from "react";
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
import { IUser } from "../../users/interface/IUser";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
);

const UsersChart: React.FC<{
  filter: "week" | "month" | "year";
  dataset?: IUser[] | undefined;
}> = ({ filter = "week", dataset = [] }) => {
  const { labels, userCounts } = useMemo(() => {
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
        start.setDate(end.getDate() - 30); // First day of the current month
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          timeFrames.push(new Date(d));
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

    const sortedUsers = [...dataset].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    const labels: string[] = [];
    const userCounts: number[] = [];
    let cumulativeUserCount = 0;

    timeFrames.forEach((date) => {
      let label: string;
      switch (filter) {
        case "week":
        case "month":
          label = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
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

      while (
        sortedUsers.length > 0 &&
        new Date(sortedUsers[0].created_at) <= date
      ) {
        cumulativeUserCount++;
        sortedUsers.shift();
      }

      userCounts.push(cumulativeUserCount);
    });

    return { labels, userCounts };
  }, [dataset, filter]);

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Total Users",
        data: userCounts,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
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

export default UsersChart;

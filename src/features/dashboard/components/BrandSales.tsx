import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useDashboard } from "../hooks/useDashboard";
import { getColors } from "../../../shared/utils/getColors";

ChartJS.register(ArcElement, Tooltip, Legend);

const BrandSales = () => {
  const { brandSales, brandSalesLoading } = useDashboard();

  if (brandSalesLoading) {
    return <div>Loading...</div>;
  }

  if (!brandSales || brandSales.length === 0) {
    return <div>No data available</div>;
  }

  const labels = brandSales.map((brand) => brand.brand_name);
  const sales = brandSales.map((brand) => brand.number_of_products_sold);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Brand Sales",
        data: sales,
        backgroundColor: sales.map((_, i) => getColors(i)),
        borderColor: sales.map((_, i) => getColors(i)),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Top 6 Brands by Sales",
      },
    },
  };

  return (
    <div className="mb-10 max-h-72 w-full">
      <h2 className="mb-4 text-2xl font-bold">Best Selling Brands</h2>
      <div className="h-full">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default BrandSales;

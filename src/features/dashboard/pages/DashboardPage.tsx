import { animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import RecentUsers from "../components/RecentUsers";
import SalesChart from "../components/SalesChart";
import TimeFilter from "../components/TimeFilter";
import UsersChart from "../components/UsersChart";
import { useDashboard } from "../hooks/useDashboard";
import { useSalesTimeFilter } from "../hooks/useSalesTimeFilter";
import { useUsersTimeFilter } from "../hooks/useUsersTimeFilter";
import RecentProducts from "../components/RecentProducts";
import BrandSales from "../components/BrandSales";
import CategorySales from "../components/CategorySales";

function DashboardPage() {
  const { orders, users } = useDashboard();
  const { dateFilter: salesFilter, setDateFilter: setSalesDateFilter } =
    useSalesTimeFilter();
  const { dateFilter: usersFilter, setDateFilter: setUsersDateFilter } =
    useUsersTimeFilter();
  const [displaySales, setDisplaySales] = useState<string>("0");
  const [displayUsers, setDisplayUsers] = useState<number>(0);

  const totalSales =
    orders?.reduce((acc, order) => acc + order.total_amount, 0) || 0;
  const totalUsers = users?.length;

  const salesCount = useMotionValue(0);
  const salesRounded = useTransform(salesCount, (latest) =>
    Math.floor(latest).toLocaleString(),
  );

  const usersCount = useMotionValue(0);
  const usersRounded = useTransform(usersCount, (latest) => Math.floor(latest));

  useEffect(() => {
    salesRounded.on("change", (latest) => {
      setDisplaySales(latest);
    });

    usersRounded.on("change", (latest) => {
      setDisplayUsers(latest);
    });

    const salesControls = animate(salesCount, totalSales, {
      duration: 1,
    });

    const usersControls = animate(usersCount, totalUsers || 0, {
      duration: 1,
    });

    return () => {
      salesControls.stop();
      usersControls.stop();
    };
  }, [
    salesCount,
    salesRounded,
    totalSales,
    totalUsers,
    usersCount,
    usersRounded,
  ]);

  return (
    <div className="grid grid-cols-1 grid-rows-[repeat(auto-fill,max-content)] gap-10 md:grid-cols-2">
      <h1 className="text-3xl md:col-span-2">Dashboard</h1>

      <div>
        <TimeFilter setFilter={setSalesDateFilter} filter={salesFilter} />
        <h2 className="text-3xl font-bold">$ {displaySales}</h2>
        <SalesChart filter={salesFilter} dataset={orders} />
      </div>

      <div>
        <TimeFilter setFilter={setUsersDateFilter} filter={usersFilter} />
        <h2 className="text-3xl font-bold">{displayUsers}</h2>
        <UsersChart filter={usersFilter} dataset={users} />
      </div>

      <RecentUsers />
      <RecentProducts />

      <BrandSales />
      <CategorySales />
    </div>
  );
}

export default DashboardPage;

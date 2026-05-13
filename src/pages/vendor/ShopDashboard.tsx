import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import { useState, useEffect, useMemo } from "react";

import axios from "@/lib/axios";

import {
  Package,
  ShoppingCart,
  Clock3,
  Wallet,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import {
  cardStyle,
} from "@/styles/uiStyles";

const ShopDashboard = () => {

  const [analytics, setAnalytics] = useState<any>(null);

  const [orders, setOrders] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  /* FETCH DATA */
  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        setLoading(true);

        const token = localStorage.getItem("token");

        /* ANALYTICS */
        const analyticsRes = await axios.get(
          "http://localhost:8000/api/v1/products/analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAnalytics(analyticsRes.data.data);

        /* ORDERS */
        const ordersRes = await axios.get(
          "http://localhost:8000/api/v1/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(ordersRes.data.data || []);

      } catch (err) {

        console.log("Dashboard Error 👉", err);

        setAnalytics(null);

      } finally {

        setLoading(false);

      }
    };

    fetchDashboard();

  }, []);

  /* STATS */
  const totalProducts =
    analytics?.totalProducts || 0;

  const confirmedOrders =
    orders.filter(
      (o) => o.status === "Delivered"
    ).length;

  const pendingOrders =
    orders.filter(
      (o) => o.status === "Pending"
    ).length;

  const confirmedPayments =
    orders.filter(
      (o) => o.paymentStatus === "Paid"
    ).length;

  const pendingPayments =
    orders.filter(
      (o) => o.paymentStatus !== "Paid"
    ).length;

  const totalRevenue =
    orders.reduce(
      (acc, order) =>
        acc + (order.totalAmount || 0),
      0
    );

  /* CATEGORY DATA */
  const categoryData = useMemo(() => {

    if (!analytics?.categoryStats) return [];

    return Object.entries(
      analytics.categoryStats
    ).map(([key, value]) => ({
      name: key,
      value,
    }));

  }, [analytics]);

  /* REVENUE DATA */
  const revenueData = useMemo(() => {

    if (!analytics?.revenueStats) return [];

    return Object.entries(
      analytics.revenueStats
    ).map(([key, value]) => ({
      name: key,
      value,
    }));

  }, [analytics]);

  /* MONTHLY ORDER TREND */
  const monthlyOrdersData = useMemo(() => {

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const grouped: any = {};

    orders.forEach((order) => {

      const date = new Date(order.createdAt);

      const month =
        months[date.getMonth()];

      if (!grouped[month]) {

        grouped[month] = {
          month,
          orders: 0,
          revenue: 0,
        };
      }

      grouped[month].orders += 1;

      grouped[month].revenue +=
        order.totalAmount || 0;
    });

    return months
      .filter((m) => grouped[m])
      .map((m) => grouped[m]);

  }, [orders]);

  /* LOADING */
  if (loading) {

    return (

      <div className="
      min-h-screen
      flex items-center justify-center
      bg-slate-50
      ">

        <p className="
        text-slate-500
        text-lg
        ">
          Loading dashboard...
        </p>

      </div>
    );
  }

  return (

    <div className="
    p-6
    space-y-8
    bg-slate-50
    min-h-screen
    ">

      {/* HEADER */}
      <div className="
      flex
      items-center
      justify-between
      flex-wrap
      gap-4
      ">

        <div>

          <h1 className="
          text-3xl
          md:text-4xl
          font-extrabold
          tracking-tight
          text-slate-900
          ">
            Shop Dashboard
          </h1>

          <p className="
          text-slate-500
          mt-1
          text-sm
          ">
            Overview of your shop performance
          </p>

        </div>

        <div className="
        px-5 py-3
        rounded-2xl
        bg-blue-100
        text-blue-700
        font-semibold
        text-sm
        flex items-center gap-2
        ">

          <TrendingUp size={18} />

          Analytics Overview

        </div>

      </div>

      {/* STATS */}
      <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      xl:grid-cols-5
      gap-5
      ">

        <CardItem
          title="Total Products"
          value={totalProducts}
          icon={<Package size={28} />}
          bg="bg-blue-100"
          text="text-blue-600"
        />

        <CardItem
          title="Delivered Orders"
          value={confirmedOrders}
          icon={<ShoppingCart size={28} />}
          bg="bg-green-100"
          text="text-green-600"
        />

        <CardItem
          title="Pending Orders"
          value={pendingOrders}
          icon={<Clock3 size={28} />}
          bg="bg-orange-100"
          text="text-orange-600"
        />

        <CardItem
          title="Paid Orders"
          value={confirmedPayments}
          icon={<Wallet size={28} />}
          bg="bg-emerald-100"
          text="text-emerald-600"
        />

        <CardItem
          title="Revenue"
          value={`₹${totalRevenue}`}
          icon={<IndianRupee size={28} />}
          bg="bg-purple-100"
          text="text-purple-600"
        />

      </div>

      {/* MONTHLY CHARTS */}
      <div className="
      grid
      grid-cols-1
      xl:grid-cols-2
      gap-6
      ">

        {/* ORDERS CHART */}
        <div
          className={`
          ${cardStyle}
          bg-white
          p-6
          rounded-3xl
          border border-slate-200
          `}
        >

          <div className="mb-5">

            <h2 className="
            text-xl
            font-bold
            text-slate-800
            ">
              Monthly Orders
            </h2>

            <p className="
            text-sm
            text-slate-500
            mt-1
            ">
              Orders received month-wise
            </p>

          </div>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart data={monthlyOrdersData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="orders"
                fill="#3b82f6"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* REVENUE CHART */}
        <div
          className={`
          ${cardStyle}
          bg-white
          p-6
          rounded-3xl
          border border-slate-200
          `}
        >

          <div className="mb-5">

            <h2 className="
            text-xl
            font-bold
            text-slate-800
            ">
              Monthly Revenue
            </h2>

            <p className="
            text-sm
            text-slate-500
            mt-1
            ">
              Revenue generated every month
            </p>

          </div>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <AreaChart data={monthlyOrdersData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                fill="#bbf7d0"
                strokeWidth={3}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* CATEGORY + REVENUE */}
      <div className="
      grid
      grid-cols-1
      xl:grid-cols-2
      gap-6
      ">

        {/* PRODUCTS CATEGORY */}
        <div
          className={`
          ${cardStyle}
          bg-white
          p-6
          rounded-3xl
          border border-slate-200
          `}
        >

          <div className="mb-5">

            <h2 className="
            text-xl
            font-bold
            text-slate-800
            ">
              Products by Category
            </h2>

            <p className="
            text-sm
            text-slate-500
            mt-1
            ">
              Product distribution across categories
            </p>

          </div>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart data={categoryData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#8b5cf6"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* REVENUE CATEGORY */}
        <div
          className={`
          ${cardStyle}
          bg-white
          p-6
          rounded-3xl
          border border-slate-200
          `}
        >

          <div className="mb-5">

            <h2 className="
            text-xl
            font-bold
            text-slate-800
            ">
              Revenue by Category
            </h2>

            <p className="
            text-sm
            text-slate-500
            mt-1
            ">
              Revenue generated category-wise
            </p>

          </div>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <LineChart data={revenueData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#f59e0b"
                strokeWidth={4}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
};

/* CARD */
const CardItem = ({
  title,
  value,
  icon,
  bg,
  text,
}: any) => (

  <div
    className={`
    ${cardStyle}
    bg-white
    p-6
    rounded-3xl
    border border-slate-200
    shadow-sm
    hover:shadow-lg
    transition-all
    `}
  >

    <div className="
    flex
    items-center
    justify-between
    ">

      <div>

        <p className="
        text-sm
        text-slate-500
        ">
          {title}
        </p>

        <h3 className="
        text-3xl
        font-bold
        mt-2
        text-slate-900
        ">
          {value}
        </h3>

      </div>

      <div
        className={`
        w-14 h-14
        rounded-2xl
        flex items-center justify-center
        ${bg}
        `}
      >

        <div className={text}>
          {icon}
        </div>

      </div>

    </div>

  </div>
);

export default ShopDashboard;
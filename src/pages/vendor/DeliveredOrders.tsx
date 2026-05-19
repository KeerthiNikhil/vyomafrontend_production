import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

import {
  inputStyle,
  primaryButton,
  cardStyle,
} from "@/styles/uiStyles";

import {
  Search,
  CheckCircle2,
  IndianRupee,
  Truck,
} from "lucide-react";

const DeliveredOrders = () => {

  const token = localStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* FETCH DELIVERED ORDERS */
  useEffect(() => {

    const fetchOrders = async () => {

      try {

        setLoading(true);

       const res = await axios.get(
  "http://localhost:8000/api/v1/orders/vendor-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const delivered =
          res.data.data?.filter(
            (o: any) => o.status?.toLowerCase() === "delivered"
          ) || [];

        setOrders(delivered);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

    fetchOrders();

  }, []);

  /* FILTER */
  const filteredOrders = useMemo(() => {

    return orders.filter((order) =>
      order._id
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [orders, search]);

  /* SUMMARY */
  const totalRevenue = orders.reduce(
    (acc, o) => acc + (o.totalAmount || 0),
    0
  );

  const totalDeliveryCharges = orders.reduce(
    (acc, o) => acc + (o.deliveryCharge || 0),
    0
  );

  /* DYNAMIC DELIVERY TREND */
  const deliveryTrend = useMemo(() => {

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const trend = days.map((day) => ({
      day,
      deliveries: 0,
    }));

    orders.forEach((order) => {

      const date = new Date(order.createdAt);

      const dayIndex = date.getDay();

      trend[dayIndex].deliveries += 1;

    });

    return trend;

  }, [orders]);

  /* DYNAMIC REVENUE TREND */
  const revenueTrend = useMemo(() => {

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const trend = days.map((day) => ({
      day,
      revenue: 0,
    }));

    orders.forEach((order) => {

      const date = new Date(order.createdAt);

      const dayIndex = date.getDay();

      trend[dayIndex].revenue +=
        Number(order.totalAmount || 0);

    });

    return trend;

  }, [orders]);

  /* LOADING */
  if (loading) {
    return (
      <div className="
      min-h-screen
      flex items-center justify-center
      bg-slate-50
      ">
        <p className="text-slate-500 text-lg">
          Loading delivered orders...
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
      <div className="flex items-center justify-between flex-wrap gap-4">

        <div>

          <h1 className="
          text-3xl
          md:text-4xl
          font-extrabold
          tracking-tight
          text-slate-900
          ">
            Delivered Orders
          </h1>

          <p className="text-slate-500 mt-1 text-sm">
            Track completed deliveries & revenue
          </p>

        </div>

        <Button
          className={`
          ${primaryButton}
          hover:scale-[1.02]
          active:scale-[0.98]
          transition-all
          duration-200
          `}
        >
          Export Report
        </Button>

      </div>

      {/* SUMMARY CARDS */}
      <div className="
      grid
      grid-cols-1
      md:grid-cols-3
      gap-5
      ">

        {/* TOTAL DELIVERED */}
        <Card
          className={`
          ${cardStyle}
          rounded-3xl
          border border-slate-200
          shadow-sm
          hover:shadow-lg
          transition-all
          `}
        >
          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Delivered
                </p>

                <h2 className="
                text-3xl
                font-bold
                text-slate-900
                mt-2
                ">
                  {orders.length}
                </h2>

              </div>

              <div className="
              w-14 h-14
              rounded-2xl
              bg-green-100
              flex items-center justify-center
              ">
                <CheckCircle2
                  className="text-green-600"
                  size={28}
                />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* REVENUE */}
        <Card
          className={`
          ${cardStyle}
          rounded-3xl
          border border-slate-200
          shadow-sm
          hover:shadow-lg
          transition-all
          `}
        >
          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Revenue
                </p>

                <h2 className="
                text-3xl
                font-bold
                text-emerald-600
                mt-2
                ">
                  ₹{totalRevenue}
                </h2>

              </div>

              <div className="
              w-14 h-14
              rounded-2xl
              bg-emerald-100
              flex items-center justify-center
              ">
                <IndianRupee
                  className="text-emerald-600"
                  size={28}
                />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* DELIVERY CHARGE */}
        <Card
          className={`
          ${cardStyle}
          rounded-3xl
          border border-slate-200
          shadow-sm
          hover:shadow-lg
          transition-all
          `}
        >
          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Delivery Charges
                </p>

                <h2 className="
                text-3xl
                font-bold
                text-blue-600
                mt-2
                ">
                  ₹{totalDeliveryCharges}
                </h2>

              </div>

              <div className="
              w-14 h-14
              rounded-2xl
              bg-blue-100
              flex items-center justify-center
              ">
                <Truck
                  className="text-blue-600"
                  size={28}
                />
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* CHARTS */}
      <div className="
      grid
      grid-cols-1
      xl:grid-cols-2
      gap-6
      ">

        {/* DELIVERY TREND */}
        <Card
          className={`
          ${cardStyle}
          rounded-3xl
          border border-slate-200
          `}
        >
          <CardContent className="p-6">

            <div className="mb-5">

              <h2 className="
              text-xl
              font-bold
              text-slate-800
              ">
                Weekly Delivery Trend
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Dynamic delivered orders analytics
              </p>

            </div>

            <ResponsiveContainer width="100%" height={260}>

              <BarChart data={deliveryTrend}>

                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="deliveries"
                  fill="#3b82f6"
                  radius={[10, 10, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </CardContent>
        </Card>

        {/* REVENUE TREND */}
        <Card
          className={`
          ${cardStyle}
          rounded-3xl
          border border-slate-200
          `}
        >
          <CardContent className="p-6">

            <div className="mb-5">

              <h2 className="
              text-xl
              font-bold
              text-slate-800
              ">
                Revenue Trend
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Dynamic weekly revenue analytics
              </p>

            </div>

            <ResponsiveContainer width="100%" height={260}>

              <LineChart data={revenueTrend}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={4}
                />

              </LineChart>

            </ResponsiveContainer>

          </CardContent>
        </Card>

      </div>

      {/* SEARCH */}
      <div className="relative w-full sm:w-[320px]">

        <Search
          size={18}
          className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-400
          "
        />

        <Input
          placeholder="Search by Order ID..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className={`
          ${inputStyle}
          pl-11
          `}
        />

      </div>

      {/* TABLE */}
      <Card
        className={`
        ${cardStyle}
        rounded-3xl
        border border-slate-200
        overflow-hidden
        `}
      >

        <CardContent className="p-0 overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-100">

              <tr className="text-left">

                <th className="px-6 py-4 font-semibold text-slate-700">
                  Order ID
                </th>

                <th className="px-6 py-4 font-semibold text-slate-700">
                  Delivery Charge
                </th>

                <th className="px-6 py-4 font-semibold text-slate-700">
                  Date
                </th>

                <th className="px-6 py-4 font-semibold text-slate-700">
                  Discount
                </th>

                <th className="px-6 py-4 font-semibold text-slate-700">
                  Amount
                </th>

                <th className="px-6 py-4 font-semibold text-slate-700">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredOrders.map((order) => (

                <tr
                  key={order._id}
                  className="
                  border-t
                  hover:bg-slate-50
                  transition
                  "
                >

                  <td className="
                  px-6 py-4
                  font-semibold
                  text-slate-800
                  ">
                    #{order._id?.slice(-6)}
                  </td>

                  <td className="
                  px-6 py-4
                  font-semibold
                  text-blue-600
                  ">
                    ₹{order.deliveryCharge || 0}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    ₹{order.discount || 0}
                  </td>

                  <td className="
                  px-6 py-4
                  font-bold
                  text-slate-900
                  ">
                    ₹{order.totalAmount || 0}
                  </td>

                  <td className="px-6 py-4">

                    <span className="
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-semibold
                    bg-green-100
                    text-green-700
                    ">
                      Delivered
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* EMPTY */}
          {filteredOrders.length === 0 && (

            <div className="
            py-20
            text-center
            ">

              <div className="
              w-20 h-20
              mx-auto
              rounded-full
              bg-slate-100
              flex items-center justify-center
              text-4xl
              mb-5
              ">
                📦
              </div>

              <h2 className="
              text-xl
              font-semibold
              text-slate-800
              ">
                No Delivered Orders
              </h2>

              <p className="text-slate-500 mt-2">
                Orders will appear here once delivered
              </p>

            </div>

          )}

        </CardContent>

      </Card>

    </div>
  );
};

export default DeliveredOrders;
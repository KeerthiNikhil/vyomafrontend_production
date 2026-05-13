import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";

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
  Search,
  Clock3,
  IndianRupee,
  PackageCheck,
  Truck,
  CheckCircle2,
  X,
} from "lucide-react";

import {
  inputStyle,
  primaryButton,
  cardStyle,
} from "@/styles/uiStyles";

const PendingOrders = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* FETCH ORDERS */
  useEffect(() => {

    const fetchOrders = async () => {

      try {

        setLoading(true);

        const res = await axios.get(
          "http://localhost:8000/api/v1/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data.data || []);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

    fetchOrders();

  }, []);

  /* FILTER PENDING */
  const pendingOrders = useMemo(() => {

    return orders.filter(
      (o) => o.status === "Pending"
    );

  }, [orders]);

  /* SEARCH FILTER */
  const filteredOrders = useMemo(() => {

    return pendingOrders.filter((order) =>
      order._id
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [pendingOrders, search]);

  /* SUMMARY */
  const pendingCount = pendingOrders.length;

  const totalRevenue = pendingOrders.reduce(
    (acc, o) => acc + (o.totalAmount || 0),
    0
  );

  const totalOrders = orders.length;

  /* DYNAMIC CHART - ORDERS */
  const ordersTrend = useMemo(() => {

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const trend = days.map((day) => ({
      day,
      orders: 0,
    }));

    pendingOrders.forEach((order) => {

      const date = new Date(order.createdAt);

      const dayIndex = date.getDay();

      trend[dayIndex].orders += 1;

    });

    return trend;

  }, [pendingOrders]);

  /* DYNAMIC CHART - REVENUE */
  const revenueTrend = useMemo(() => {

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const trend = days.map((day) => ({
      day,
      revenue: 0,
    }));

    pendingOrders.forEach((order) => {

      const date = new Date(order.createdAt);

      const dayIndex = date.getDay();

      trend[dayIndex].revenue +=
        Number(order.totalAmount || 0);

    });

    return trend;

  }, [pendingOrders]);

  /* MARK DELIVERED */
  const handleMarkDelivered = async (id: string) => {

    try {

      await axios.put(
        `http://localhost:8000/api/v1/orders/${id}/deliver`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? { ...o, status: "Delivered" }
            : o
        )
      );

    } catch (err) {

      console.log(err);

    }
  };

  /* NAVIGATE */
  const handleAssignDelivery = (order: any) => {

    navigate("/vendor/delivery/assign", {
      state: {
        orderId: order._id,
        amount: order.totalAmount,
        date: new Date(
          order.createdAt
        ).toLocaleDateString(),

        address:
          order.shippingAddress?.fullAddress ||
          order.shippingAddress?.city ||
          "No address available",

        lat:
          order.shippingAddress?.lat ||
          "12.9716",

        lng:
          order.shippingAddress?.lng ||
          "77.5946",
      },
    });
  };

  /* LOADING */
  if (loading) {

    return (
      <div className="
      min-h-screen
      flex items-center justify-center
      bg-slate-50
      ">
        <p className="text-slate-500 text-lg">
          Loading pending orders...
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
            Pending Orders
          </h1>

          <p className="
          text-slate-500
          text-sm
          mt-1
          ">
            Manage pending deliveries & assignments
          </p>

        </div>

        <Button
          className={`
          ${primaryButton}
          hover:scale-[1.02]
          transition-all
          `}
          onClick={() => setShowModal(true)}
        >
          View Pending Orders
        </Button>

      </div>

      {/* SUMMARY */}
      <div className="
      grid
      grid-cols-1
      md:grid-cols-3
      gap-5
      ">

        {/* TOTAL */}
        <Card
          className={`
          ${cardStyle}
          rounded-3xl
          border border-slate-200
          `}
        >
          <CardContent className="p-6">

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
                  Total Orders
                </p>

                <h2 className="
                text-3xl
                font-bold
                text-slate-900
                mt-2
                ">
                  {totalOrders}
                </h2>

              </div>

              <div className="
              w-14 h-14
              rounded-2xl
              bg-blue-100
              flex items-center justify-center
              ">

                <PackageCheck
                  className="text-blue-600"
                  size={28}
                />

              </div>

            </div>

          </CardContent>
        </Card>

        {/* PENDING */}
        <Card
          onClick={() => setShowModal(true)}
          className={`
          ${cardStyle}
          rounded-3xl
          border border-slate-200
          cursor-pointer
          hover:shadow-lg
          transition-all
          `}
        >
          <CardContent className="p-6">

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
                  Pending Orders
                </p>

                <h2 className="
                text-3xl
                font-bold
                text-orange-500
                mt-2
                ">
                  {pendingCount}
                </h2>

              </div>

              <div className="
              w-14 h-14
              rounded-2xl
              bg-orange-100
              flex items-center justify-center
              ">

                <Clock3
                  className="text-orange-500"
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
          `}
        >
          <CardContent className="p-6">

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
                  Pending Revenue
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

      </div>

      {/* CHARTS */}
      <div className="
      grid
      grid-cols-1
      xl:grid-cols-2
      gap-6
      ">

        {/* ORDERS TREND */}
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
                Pending Orders Trend
              </h2>

              <p className="
              text-sm
              text-slate-500
              mt-1
              ">
                Weekly pending orders analytics
              </p>

            </div>

            <ResponsiveContainer
              width="100%"
              height={260}
            >

              <BarChart data={ordersTrend}>

                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="orders"
                  fill="#f97316"
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

              <p className="
              text-sm
              text-slate-500
              mt-1
              ">
                Weekly pending revenue analytics
              </p>

            </div>

            <ResponsiveContainer
              width="100%"
              height={260}
            >

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

      {/* MODAL */}
      {showModal && (

        <div className="
        fixed inset-0
        bg-black/50
        backdrop-blur-sm
        flex items-center justify-center
        z-50
        p-4
        ">

          <div className="
          bg-white
          w-full
          max-w-6xl
          rounded-3xl
          shadow-2xl
          border border-slate-200
          overflow-hidden
          ">

            {/* HEADER */}
            <div className="
            flex
            items-center
            justify-between
            px-6 py-5
            border-b
            bg-slate-50
            ">

              <div>

                <h2 className="
                text-2xl
                font-bold
                text-slate-800
                ">
                  Pending Orders
                </h2>

                <p className="
                text-sm
                text-slate-500
                mt-1
                ">
                  Assign delivery & manage orders
                </p>

              </div>

              <button
                onClick={() => setShowModal(false)}
                className="
                w-10 h-10
                rounded-xl
                bg-slate-100
                hover:bg-slate-200
                flex items-center justify-center
                transition
                "
              >
                <X size={18} />
              </button>

            </div>

            {/* SEARCH */}
            <div className="p-6 pb-0">

              <div className="
              relative
              w-full
              sm:w-[320px]
              ">

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
                  placeholder="Search Order ID..."
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

            </div>

            {/* TABLE */}
            <div className="
            overflow-x-auto
            p-6
            ">

              <table className="
              w-full
              text-sm
              ">

                <thead className="bg-slate-100">

                  <tr className="text-left">

                    <th className="
                    px-5 py-4
                    font-semibold
                    text-slate-700
                    ">
                      Order ID
                    </th>

                    <th className="
                    px-5 py-4
                    font-semibold
                    text-slate-700
                    ">
                      Date
                    </th>

                    <th className="
                    px-5 py-4
                    font-semibold
                    text-slate-700
                    ">
                      Amount
                    </th>

                    <th className="
                    px-5 py-4
                    font-semibold
                    text-slate-700
                    ">
                      Status
                    </th>

                    <th className="
                    px-5 py-4
                    font-semibold
                    text-slate-700
                    ">
                      Actions
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
                      px-5 py-4
                      font-semibold
                      text-slate-800
                      ">
                        #{order._id?.slice(-6)}
                      </td>

                      <td className="
                      px-5 py-4
                      text-slate-600
                      ">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="
                      px-5 py-4
                      font-bold
                      text-slate-900
                      ">
                        ₹{order.totalAmount || 0}
                      </td>

                      <td className="px-5 py-4">

                        <span className="
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-semibold
                        bg-orange-100
                        text-orange-600
                        ">
                          Pending
                        </span>

                      </td>

                      <td className="
                      px-5 py-4
                      ">

                        <div className="
                        flex
                        items-center
                        gap-3
                        ">

                          <Button
                            onClick={() =>
                              handleAssignDelivery(order)
                            }
                            className="
                            h-10
                            rounded-xl
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            "
                          >
                            <Truck size={16} />
                            Assign
                          </Button>

                          <Button
                            onClick={() =>
                              handleMarkDelivered(order._id)
                            }
                            className="
                            h-10
                            rounded-xl
                            bg-emerald-600
                            hover:bg-emerald-700
                            text-white
                            "
                          >
                            <CheckCircle2 size={16} />
                            Delivered
                          </Button>

                        </div>

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
                    No Pending Orders
                  </h2>

                  <p className="
                  text-slate-500
                  mt-2
                  ">
                    Pending orders will appear here
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default PendingOrders;
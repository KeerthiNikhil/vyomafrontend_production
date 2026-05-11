import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

interface Payment {
  _id: string;
  orderId: string;
  amount: number;
  date: string;
  method: string;
  status: "Paid" | "Pending";
}

const Payments = () => {
  const token = localStorage.getItem("token");

  const [payments, setPayments] = useState<Payment[]>([]);
  const [showPending, setShowPending] = useState(false);
  const [loading, setLoading] = useState(true);

  // ================= FETCH PAYMENTS =================
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/orders/vendor/payments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPayments(res.data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // ================= TOTALS =================
  const totalRevenue = payments
    .filter((p) => p.status === "Paid")
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingPayments = payments.filter(
    (p) => p.status === "Pending"
  );

  const pendingAmount = pendingPayments.reduce(
    (acc, p) => acc + p.amount,
    0
  );

  // ================= WEEKLY CHART =================
  const weeklyData = useMemo(() => {
    const map: any = {};

    payments.forEach((p) => {
      const day = new Date(p.date).toLocaleDateString("en-US", {
        weekday: "short",
      });

      if (!map[day]) {
        map[day] = 0;
      }

      map[day] += p.amount;
    });

    return Object.entries(map).map(([day, revenue]) => ({
      day,
      revenue,
    }));
  }, [payments]);

  // ================= MONTHLY CHART =================
  const monthlyData = useMemo(() => {
    const map: any = {};

    payments.forEach((p) => {
      const month = new Date(p.date).toLocaleDateString("en-US", {
        month: "short",
      });

      if (!map[month]) {
        map[month] = 0;
      }

      map[month] += p.amount;
    });

    return Object.entries(map).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }, [payments]);

  // ================= MARK AS PAID =================
  const handleMarkAsPaid = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:8000/api/v1/orders/payment/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPayments((prev) =>
        prev.map((payment) =>
          payment._id === id
            ? { ...payment, status: "Paid" }
            : payment
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ================= WITHDRAW =================
  const handleWithdraw = async () => {

  if (totalRevenue <= 0) {
    toast.error("No balance available to withdraw");
    return;
  }

  const confirmWithdraw = window.confirm(
    `Withdraw ₹${totalRevenue} to your bank account?`
  );

  if (!confirmWithdraw) return;

  try {

    const res = await axios.post(
      "http://localhost:8000/api/v1/payments/withdraw",
      {
        amount: totalRevenue,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(
      res.data.message ||
      `Withdrawal request for ₹${totalRevenue} submitted ✅`
    );

  } catch (err: any) {

    toast.error(
      err.response?.data?.message ||
      "Withdrawal failed ❌"
    );

    console.log(err);
  }
};
  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading payments...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

     {/* HEADER */}
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

  <div>
    <h1 className="text-3xl font-bold">
      Payments
    </h1>

    <p className="text-slate-500 mt-1">
      Track your earnings and revenue analytics
    </p>
  </div>

  {/* BUTTONS */}
  <div className="flex justify-between items-center gap-4 flex-wrap">

    {/* PENDING TOGGLE */}
    <Button
      variant="outline"
      onClick={() => setShowPending(!showPending)}
      className="
        h-12 px-6
        rounded-2xl
        border-slate-200
        shadow-sm
        hover:bg-slate-100
      "
    >
      {showPending
        ? "Hide Pending Payments"
        : `Pending (${pendingPayments.length})`}
    </Button>

    {/* WITHDRAW */}
    <Button
  onClick={handleWithdraw}
  className="
    h-12 px-8
    rounded-2xl
    bg-blue-600
    hover:bg-blue-700
    text-white
    font-semibold
    shadow-md
    transition-all duration-200
    disabled:cursor-not-allowed
  "
>
  💸 Withdraw ₹{totalRevenue}
</Button>

  </div>

</div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* TOTAL REVENUE */}
        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-slate-500 text-sm">
              Total Revenue
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              ₹{totalRevenue}
            </h2>
          </CardContent>
        </Card>

        {/* TRANSACTIONS */}
        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-slate-500 text-sm">
              Total Transactions
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {payments.length}
            </h2>
          </CardContent>
        </Card>

        {/* PENDING */}
        <Card
          
          className={`
          rounded-3xl
          border
          shadow-sm
          transition
          ${
            showPending
              ? "bg-orange-50 border-orange-300"
              : "bg-white border-slate-200 hover:shadow-md"
          }
        `}
        >
          <CardContent className="p-6">
            <p className="text-slate-500 text-sm">
              Pending Payments
            </p>

            <h2 className="text-3xl font-bold text-orange-500 mt-2">
              ₹{pendingAmount}
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              {pendingPayments.length} pending orders
            </p>
          </CardContent>
        </Card>

      </div>

      {/* PENDING TABLE */}
      {showPending && (
        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-6">

            <div className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-2xl font-semibold">
                Pending Payment Details
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Orders awaiting payment confirmation
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b text-left">
                    <th className="py-4">Order ID</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pendingPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="border-b"
                    >
                      <td className="py-4 font-medium">
                        {payment.orderId}
                      </td>

                      <td>
                        {new Date(
                          payment.date
                        ).toLocaleDateString()}
                      </td>

                      <td>{payment.method}</td>

                      <td className="font-semibold text-orange-600">
                        ₹{payment.amount}
                      </td>

                      <td>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleMarkAsPaid(payment._id)
                          }
                          className="
                          rounded-xl
                          bg-blue-600
                          hover:bg-blue-700
                        "
                        >
                          Mark as Paid
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </CardContent>
        </Card>
      )}

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* WEEKLY */}
        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-6">

            <div className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-2xl font-semibold">
                Weekly Revenue
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Revenue collected this week
              </p>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="revenue"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

          </CardContent>
        </Card>

        {/* MONTHLY */}
        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-6">

            <div className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-2xl font-semibold">
                Monthly Revenue
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Monthly sales analytics
              </p>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>

          </CardContent>
        </Card>

      </div>

    </div>
  );
};

export default Payments;
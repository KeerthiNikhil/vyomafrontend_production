import { useEffect, useState } from "react";
import axios from "@/lib/axios";

import {
  Package,
  Clock3,
  CheckCircle2,
  XCircle,
  Truck,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

const OrdersPage = () => {

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const res = await axios.get(
          "/orders/my-orders"
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

  /* STATUS COLORS */
  const getStatusStyle = (status: string) => {

    switch (status?.toLowerCase()) {

      case "pending":
        return {
          bg: "bg-orange-100",
          text: "text-orange-600",
          icon: <Clock3 size={14} />,
        };

      case "delivered":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          icon: <CheckCircle2 size={14} />,
        };

      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-600",
          icon: <XCircle size={14} />,
        };

      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          icon: <Package size={14} />,
        };
    }
  };

  if (loading) {

    return (

      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-slate-50
      ">

        <p className="
        text-slate-500
        text-lg
        ">
          Loading orders...
        </p>

      </div>

    );
  }

console.log(orders);

  return (

    <section className="
    min-h-screen
    bg-slate-50
    py-10
    ">

      <div className="
      max-w-5xl
      mx-auto
      px-4
      ">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="
          text-3xl
          md:text-4xl
          font-extrabold
          text-slate-900
          ">
            My Orders
          </h1>

          <p className="
          text-slate-500
          mt-2
          ">
            Track your recent purchases & delivery updates
          </p>

        </div>

        {/* EMPTY */}
        {orders.length === 0 ? (

          <div className="
          bg-white
          rounded-3xl
          p-12
          text-center
          border
          border-slate-200
          shadow-sm
          ">

            <div className="
            w-24
            h-24
            rounded-full
            bg-slate-100
            flex
            items-center
            justify-center
            mx-auto
            mb-5
            text-slate-500
            ">

              <Package size={40} />

            </div>

            <h2 className="
            text-2xl
            font-bold
            text-slate-800
            ">
              No Orders Yet
            </h2>

            <p className="
            text-slate-500
            mt-2
            ">
              Your placed orders will appear here
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {orders.map((order) => {

              const statusStyle =
                getStatusStyle(order.status);

              return (

                <div
                  key={order._id}
                  className="
                  bg-white
                  rounded-3xl
                  border
                  border-slate-200
                  shadow-sm
                  hover:shadow-md
                  transition-all
                  overflow-hidden
                  "
                >

                  {/* TOP */}
                  <div className="
                  flex
                  flex-col
                  md:flex-row
                  md:items-center
                  md:justify-between
                  gap-5
                  p-6
                  border-b
                  border-slate-100
                  ">

                    <div>

                      <p className="
                      text-sm
                      text-slate-500
                      ">
                        Order ID
                      </p>

                      <h2 className="
                      text-lg
                      font-bold
                      text-slate-800
                      mt-1
                      ">
                        #{order._id.slice(-6)}
                      </h2>

                      <div className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-slate-500
                      mt-3
                      ">

                        <CalendarDays size={15} />

                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </div>

                    </div>

                    <div className="
                    flex
                    flex-col
                    items-start
                    md:items-end
                    gap-3
                    ">

                      <div
                        className={`
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-semibold
                        ${statusStyle.bg}
                        ${statusStyle.text}
                        `}
                      >

                        {statusStyle.icon}

                        {order.status}

                      </div>

                      <div className="
                      flex
                      items-center
                      gap-2
                      text-xl
                      font-bold
                      text-slate-900
                      ">

                        <IndianRupee size={20} />

                        {order.totalAmount}

                      </div>

                    </div>

                  </div>

                  {/* PRODUCTS */}
                  <div className="p-6 space-y-4">

                    {order.products.map(
                      (item: any) => (

                        <div
                          key={item._id}
                          className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          pb-4
                          border-b
                          border-slate-100
                          "
                        >

                          <div className="
                          flex
                          items-center
                          gap-4
                          ">

                            <div className="
                            w-16
                            h-16
                            rounded-2xl
                            overflow-hidden
                            bg-slate-100
                            ">

                             <img
  src={
    item.product?.images?.[0]
      ? item.product.images[0].startsWith("http")
        ? item.product.images[0]
        : `http://localhost:8000${item.product.images[0]}`
      : "/placeholder.png"
  }
  alt={
    item.product?.name || "Product"
  }
  className="
  w-full
  h-full
  object-cover
  "
/>

                            </div>

                            <div>

                              <h3 className="
                              font-semibold
                              text-slate-800
                              ">
                                {item.product?.name}
                              </h3>

                              <p className="
                              text-sm
                              text-slate-500
                              mt-1
                              ">
                                Quantity:
                                {" "}
                                {item.quantity}
                              </p>

                            </div>

                          </div>

                          <div className="
                          font-bold
                          text-slate-900
                          text-lg
                          ">

                            ₹
                            {item.price}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                  {/* FOOTER */}
                  <div className="
                  bg-slate-50
                  px-6
                  py-5
                  flex
                  flex-col
                  md:flex-row
                  md:items-center
                  md:justify-between
                  gap-4
                  ">

                    <div className="
                    flex
                    items-center
                    gap-2
                    text-slate-600
                    ">

                      <Truck size={18} />

                      Delivery charge:
                      {" "}
                      ₹
                      {order.deliveryCharge || 0}

                    </div>

                    <div className="
                    text-2xl
                    font-extrabold
                    text-slate-900
                    ">

                      Total:
                      {" "}
                      ₹
                      {order.totalAmount}

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

    </section>

  );
};

export default OrdersPage;
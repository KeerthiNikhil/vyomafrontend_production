import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { MapPin, CreditCard, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import AddressModal from "@/components/checkout/AddressModal";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const formatPrice = (value: number) =>
  Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [openAddress, setOpenAddress] = useState(false);
const [address, setAddress] = useState<any>(null);

 const subtotal = Number(
  cart
    .reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    .toFixed(2)
);

const deliveryFee = subtotal > 499 ? 0 : 95;

const total = Number(
  (subtotal + deliveryFee).toFixed(2)
);

  const fetchAddress = async () => {
  try {
    const res = await axios.get("/address");

    if (res.data.success && res.data.data) {
      setAddress(res.data.data);
    }
  } catch (err) {
    console.log("No address yet");
  }
};

useEffect(() => {
  fetchAddress();
}, []);

  const handlePlaceOrder = async () => {
    try {
      if (!cart.length) {
        toast.error("Cart is empty ❌");
        return;
      }

      if (paymentMethod === "COD") {
        const res = await axios.post("/orders", {
          paymentMethod,
          totalAmount: total,
        });

        if (res.data.success) {
          toast.success("Order placed 🎉");
          await fetchCart();
          navigate("/order-success");
        }
        return;
      }

      

      const { data } = await axios.post("/orders/create-order", {
        amount: total,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Vyoma",
        description: "Order Payment",
        order_id: data.order.id,

        handler: async (response: any) => {
          const verify = await axios.post("/orders/verify-payment", {
            ...response,
            totalAmount: total,
          });

          if (verify.data.success) {
            toast.success("Payment successful 🎉");
            await fetchCart();
            navigate("/order-success");
          }
        },

        theme: {
          color: "#f97316",
        },
      };

      new window.Razorpay(options).open();
    } catch (err: any) {
  console.log("CHECKOUT ERROR 👉", err);
  console.log("RESPONSE 👉", err?.response?.data);

  toast.error(
    err?.response?.data?.message || "Something went wrong ❌"
  );
}
  };

  return (
    <section className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-5">

          {/* ADDRESS */}
<div className="bg-white rounded-2xl shadow-sm p-6">
  <h2 className="text-lg font-semibold flex items-center gap-2 mb-5">
    <MapPin size={18} />
    Delivery Address
  </h2>

  {address ? (
    <div className="border rounded-xl p-5 bg-gray-50">
      <p className="font-semibold text-gray-900">
        {address.name}
      </p>

      <p className="text-sm text-gray-600 mt-1">
        {address.house}, {address.area}
      </p>

      {address.landmark && (
        <p className="text-sm text-gray-600">
          {address.landmark}
        </p>
      )}

      <p className="text-sm text-gray-600">
        {address.city}, {address.state} - {address.pincode}
      </p>

      <p className="text-sm text-gray-600 mt-1">
        Phone: {address.phone}
      </p>

      <button
        onClick={() => setOpenAddress(true)}
        className="mt-4 text-blue-600 text-sm font-medium hover:underline"
      >
        Change Address
      </button>
    </div>
  ) : (
    <button
      onClick={() => setOpenAddress(true)}
      className="w-full border-2 border-dashed rounded-xl py-6 text-gray-500 hover:border-blue-500 hover:text-blue-600 transition"
    >
      + Add Delivery Address
    </button>
  )}
</div>

          {/* PAYMENT */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-5">
              <CreditCard size={18} />
              Payment Method
            </h2>

            <div className="space-y-4">

              <label
                className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition ${
                  paymentMethod === "COD"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Truck size={18} />
                Cash on Delivery
              </label>

              <label
                className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition ${
                  paymentMethod === "ONLINE"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <CreditCard size={18} />
                Pay Online (UPI / Card)
              </label>

            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="sticky top-24 h-fit">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            <div className="p-6 border-b">
              <h3 className="font-semibold text-lg">
                Order Summary
              </h3>
            </div>

            <div className="p-6 space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-600">Items Total</span>
                <span className="font-medium">
  ₹{formatPrice(subtotal)}
</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600 font-semibold">
                    FREE
                  </span>
                ) : (
                  <span>
  ₹{formatPrice(deliveryFee)}
</span>
                )}
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>
  ₹{formatPrice(total)}
</span>
              </div>

              <button
                disabled={!cart.length}
                onClick={handlePlaceOrder}
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-4 font-semibold transition"
              >
                Proceed To Pay →
              </button>

            </div>
          </div>
        </div>

      </div>

      <AddressModal
  open={openAddress}
  onClose={() => setOpenAddress(false)}
  onSaved={fetchAddress}
/>
    </section>
  );
};

export default Checkout;
import { useNavigate, Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const navigate = useNavigate();

  const formatPrice = (value: number) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }); 

  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  const subtotal = Number(
  cart
    .reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    .toFixed(2)
);

const deliveryFee = subtotal > 499 ? 0 : 40;

const total = Number(
  (subtotal + deliveryFee).toFixed(2)
);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-3">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">
          Add products to continue shopping
        </p>

        <Button onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <section className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 grid lg:grid-cols-3 gap-6">

        {/* LEFT CART */}
        <div className="lg:col-span-2 space-y-4">

          {/* FREE DELIVERY BAR */}
          <div className="bg-violet-100 text-violet-700 rounded-lg px-5 py-3 font-medium">
            🎉 Add ₹{Math.max(0, 499 - subtotal)} more for Free Delivery
          </div>

          {/* ITEMS */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {cart.map((item) => (
              <div
                key={item.id}
               className="flex gap-6 px-6 py-5 shadow-[0_1px_0_0_#ececec] last:shadow-none"
              >
                {/* IMAGE */}
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[92px] h-[92px] rounded-xl border border-gray-200 object-cover bg-white p-2"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                </Link>

                {/* INFO */}
                <div className="flex-1">
                  <Link
                    to={`/product/${item.id}`}
                    className="text-[14px] font-semibold text-slate-800 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>

                  <p className="text-green-600 text-[12px] mt-1 font-medium">
                    In Stock
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[12px] text-red-500 mt-2 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex flex-col items-end justify-center gap-5">
                  <p className="text-[14px] font-semibold text-slate-800">
                    ₹{formatPrice(item.price * item.quantity)}
                  </p>

                  <div className="flex items-center rounded-lg overflow-hidden border h-10">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="px-4 h-full bg-gray-50 hover:bg-gray-100 text-[12px]"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="px-5 text-[13px] font-semibold text-slate-700">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="px-4 h-full bg-gray-50 hover:bg-gray-100 text-[12px]"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRICE DETAILS */}
        <div className="sticky top-24 h-fit">
         <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

  {/* top strip */}
  <div className="px-8 py-5 border-b flex gap-10 text-[13px] font-medium text-slate-600">
    <span>📄 Compliance</span>
    <span>💵 COD Available.</span>
  </div>

  {/* content */}
  <div className="p-6">
    <h3 className="text-[13px] font-semibold text-slate-800 mb-6">
      Price Details
    </h3>

    {(() => {
      const mrp = Math.round(subtotal * 1.35);
      const saved = Math.round(mrp - subtotal);
      const deliveryFee = 95;
      const finalDelivery = subtotal > 499 ? 0 : deliveryFee;
      const total = subtotal + finalDelivery;

      return (
        <>
          {/* Item total */}
          <div className="space-y-1 mb-5">
            <div className="flex justify-between items-center text-[12px] text-slate-600">
              <span className="flex items-center gap-2">
  <ShoppingBag
    size={14}
    className="text-slate-500"
  />
  Item Total
</span>

              <div className="text-right">
                <span className="font-semibold text-[12px] text-slate-800">
                  Saved ₹{formatPrice(saved)}
                </span>

                <span className="line-through text-gray-400 text-[11px] mr-2">
                  ₹{formatPrice(mrp)}
                </span>

                <span className="font-semibold text-[12px] text-slate-800">
                  ₹{formatPrice(subtotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="flex justify-between items-center text-[12px] text-slate-600 mb-5">
            <span className="flex items-center gap-2 text-[12px] text-slate-600 font-medium">
  <Truck
    size={14}
    className="text-slate-500"
  />
  Delivery Partner Fee
</span>

            <div>
              <span className="line-through text-gray-400 text-[11px] mr-2">
                ₹95
              </span>

              <span className="text-green-600 font-semibold text-[12px]">
                FREE
              </span>
            </div>
          </div>

          {/* total */}
          <div className="font-semibold text-[12px] text-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-[12px] text-slate-800">
                  Grand Total
                </p>

                <p className="text-[10px] text-gray-500 mt-1">
                  (inclusive of all taxes)
                </p>
              </div>

              <p className="font-semibold text-[12px] text-slate-800">
                ₹{formatPrice(total)}
              </p>
            </div>
          </div>

          {/* checkbox */}
          <label className="flex items-start gap-3 text-sm mb-6 cursor-pointer">
            <input type="checkbox" className="mt-[2px] w-3.5 h-3.5" />

            <span className="text-[10px] text-gray-500">
              I have read and agree to the{" "}
              <span className="text-blue-600 underline">
                terms and condition
              </span>
            </span>
          </label>

          {/* CTA */}
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-5 py-3 flex justify-between items-center text-[12px] font-semibold"
          >
            <div className="text-left text-[11px] leading-5">
              <p>{cart.length} Items</p>
              <p>TOTAL - ₹{formatPrice(total)}</p>
            </div>

            <span>
              <span className="text-[12px] font-semibold">
  Proceed To Buy →
</span>
            </span>
          </button>
        </>
      );
    })()}
  </div>

  {/* bottom saving */}
  <div className="bg-blue-50 px-6 py-5">
    <p className="text-blue-600 font-semibold text-[12px]">
      Your Total Saving
    </p>

    <p className="text-blue-500 text-[10px] mt-1">
      Including ₹95 savings on delivery charges.
    </p>

    <p className="text-blue-700 font-semibold text-[12px] mt-2">
      ₹{formatPrice(subtotal * 0.35)}
    </p>
  </div>
</div>
        </div>

      </div>
    </section>
  );
};

export default Cart;
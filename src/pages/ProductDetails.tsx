import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Minus, Plus, Star, Heart } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useWishlist } from "../context/WishlistContext";
import StockIndicator from "@/components/products/StockIndicator";
import EmiCalculator from "@/components/products/EmiCalculator";
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/${id}`);
        const data = res.data.data;

console.log("PRODUCT =", data);
console.log("SHOP =", data.shop);
console.log("SHOP TYPE =", typeof data.shop);

setProduct(data);

if (data.unitOptions?.length) {
  setSelectedUnit(data.unitOptions[0]);
}
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!product) return <div className="p-10 text-center">Not found</div>;

  const images = product.images || [];

  const currentPrice = Number(
  selectedUnit?.price || product.finalPrice || 0
);

const hasDiscount =
  product.discountType &&
  Number(product.discountValue) > 0;

let originalPrice = currentPrice;
let savedAmount = 0;
let discountPercent = 0;

if (hasDiscount) {
  if (product.discountType === "percentage") {
    originalPrice =
      currentPrice +
      (currentPrice * Number(product.discountValue)) / 100;

    savedAmount =
      originalPrice - currentPrice;

    discountPercent =
      Number(product.discountValue);
  }

  if (product.discountType === "flat") {
    originalPrice =
      currentPrice +
      Number(product.discountValue);

    savedAmount =
      Number(product.discountValue);

    discountPercent =
      Math.round(
        (savedAmount / originalPrice) * 100
      );
  }
}

  const handleAddToCart = async () => {
    await addToCart({
      id: product._id,
      name: product.name,
      price: selectedUnit?.price || product.finalPrice,
unit: selectedUnit?.label || "",
      image: images?.[0],
      shop: product.shop?._id || product.shop,
      quantity: qty,
    });
  };
const handleGoToCart = async () => {
  await handleAddToCart();
  navigate("/cart");
};

const handleBuyNow = async () => {
  await handleAddToCart();
  navigate("/checkout");
};

  return (
   <section className="max-w-7xl mx-auto px-4 lg:px-6 py-6 pb-24">

      <div className="grid lg:grid-cols-[280px_1.1fr_1fr] gap-6 items-start">

        {/* LEFT (STICKY IMAGE) */}
        <div className="self-start">
  <div className="sticky top-24 h-fit">

    <div className="space-y-4">

      {/* MAIN IMAGE */}
      <div className="relative bg-white border border-slate-200 rounded-2xl p-4">
        <button
          onClick={() =>
            inWishlist
              ? removeFromWishlist(product._id)
              : addToWishlist({
                  _id: product._id,
                  name: product.name,
                  price: selectedUnit?.price || product.finalPrice,
unit: selectedUnit?.label || "",
                  image: images?.[0],
                })
          }
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:scale-105 transition"
        >
          <Heart
  size={18}
  className={
    inWishlist
      ? "text-red-500 fill-red-500"
      : "text-slate-700"
  }
/>
        </button>

        <img
  src={
    images?.[activeImage]
      ? images[activeImage].startsWith("http")
        ? images[activeImage]
        : `http://localhost:8000${images[activeImage]}`
      : "/placeholder.png"
  }
  className="w-full h-[260px] object-contain mx-auto"
/>
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
        {images.map((img: string, i: number) => (
          <img
            key={i}
            src={
  img?.startsWith("http")
    ? img
    : `http://localhost:8000${img}`
}
            onClick={() => setActiveImage(i)}
className={`w-16 h-16 flex-shrink-0 rounded-xl object-cover cursor-pointer border bg-white p-1 transition ${              activeImage === i
  ? "border-blue-500 ring-4 ring-blue-100"
  : "border-slate-200"
            }`}
          />
        ))}
      </div>

    </div>

  </div>
</div>

       {/* MIDDLE COLUMN */}
        <div className="space-y-6">

          {/* TOP INFO */}
          <div className="space-y-5">

            <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
            <p className="text-sm text-slate-500 leading-6">
  {product.description}
</p>

            <div className="flex items-center gap-2 text-yellow-500">
              <Star size={16} fill="currentColor" />
              <span className="text-sm text-gray-600">4.4 (78 reviews)</span>
            </div>

           <div className="flex items-center gap-2 flex-wrap">
  <span className="text-3xl font-bold">
  ₹{currentPrice}
</span>

{hasDiscount && (
  <>
    <span className="line-through text-base text-slate-400">
      ₹{Math.round(originalPrice)}
    </span>

    <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-sm font-medium">
      {discountPercent}% off
    </span>
  </>
)}

  <span className="text-yellow-500 text-sm">🪙 149</span>
</div>

          

           <div className="space-y-1 text-sm text-slate-600">
  {product.deliveryTime && (
    <p>🚚 {product.deliveryTime}</p>
  )}

  {product.returnPolicy && (
    <p>🔁 {product.returnPolicy}</p>
  )}

  <p>
    💰 {product.codAvailable ? "Cash on Delivery" : "Prepaid Only"}
  </p>
</div>

            <StockIndicator stock={product.stock} />
            
           {product.unitOptions?.length > 0 && (

  <div className="space-y-4">

    <div className="flex items-center justify-between">

      <p className="font-semibold text-slate-900 text-lg">
        Select Option
      </p>

      {selectedUnit && (
        <span className="text-sm text-blue-600 font-medium">
          Selected: {selectedUnit.label}
        </span>
      )}

    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

      {product.unitOptions.map(
        (unit: any, i: number) => {

          const isSelected =
            selectedUnit?.label === unit.label;

          return (

            <button
              key={i}
              type="button"
              onClick={() => setSelectedUnit(unit)}
              className={`
              relative
              rounded-2xl
              border
              p-4
              text-left
              transition-all
              bg-white
              hover:border-blue-400
              hover:shadow-sm

              ${
                isSelected
                  ? "border-blue-600 ring-4 ring-blue-100"
                  : "border-slate-200"
              }
              `}
            >

              {/* RADIO */}
              <div className="
              absolute
              top-3
              right-3
              ">

                <div
                  className={`
                  w-3
                  h-3
                  rounded-full
                  border-2
                  flex
                  items-center
                  justify-center
                  transition

                  ${
                    isSelected
                      ? "border-blue-600"
                      : "border-slate-300"
                  }
                  `}
                >

                  {isSelected && (

                    <div className="
                    w-2
                    h-2
                    rounded-full
                    bg-blue-600
                    " />

                  )}

                </div>

              </div>

              {/* CONTENT */}
              <div className="space-y-1">

                <p className="
                font-bold
                text-slate-900
                text-lg
                ">
                  {unit.label}
                </p>

                <p className="
                text-sm
                text-slate-500
                ">
                  ₹{unit.price}
                </p>

              </div>

            </button>

          );
        }
      )}

    </div>

  </div>

)}

            <div className="flex items-center gap-4">
              <span>Quantity</span>
              <div className="flex items-center border border-slate-200 rounded-full bg-white shadow-sm overflow-hidden">
                <button
  className="px-4 py-2 hover:bg-slate-100"
  onClick={() => setQty(Math.max(1, qty - 1))}
>
                  <Minus size={16} />
                </button>
                <span className="px-6 font-semibold text-lg">{qty}</span>
                <button
  className="px-4 py-2 hover:bg-slate-100"
  onClick={() => setQty(qty + 1)}
>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
  <Button
    onClick={handleAddToCart}
    className="w-full h-10 rounded-xl bg-blue-600 text-lg font-semibold"
  >
    Add to Cart
  </Button>
</div>

          </div>

          {/* TABS */}
          <Tabs product={product} />

        

          {/* Q&A */}
          <div>
            <h3 className="font-semibold">Questions & Answers</h3>
            <div className="border border-slate-200 rounded-3xl shadow-sm bg-white p-4 mt-3">
              <p className="font-medium">Is it compatible with Noris implants?</p>
              <p className="text-sm text-gray-600 mt-2">
                Yes, compatible with Noris systems.
              </p>
            </div>
          </div>


        </div>
        {/* RIGHT COLUMN */}
<div className="space-y-5 sticky top-24 min-w-0 w-full">

  {/* PRICE DETAILS */}
  <div className="flex items-center justify-between gap-3 text-green-600 font-medium">
  <span>Item Total</span>
  <span>₹{currentPrice * qty}</span>
</div>

{hasDiscount && (
  <div className="flex items-center justify-between gap-2 text-green-600 font-medium">
    <span>Saved</span>
    <span>₹{Math.round(savedAmount * qty)}</span>
  </div>
)}

 {/* OFFERS */}
<div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
  <h3 className="font-semibold text-slate-900 mb-4">
    Available Offers
  </h3>

  <div className="space-y-3 text-sm">

    <div className="flex items-start gap-2">
      <span className="text-green-600 text-base">🥬</span>
      <p className="text-slate-700">
        Buy <span className="font-semibold">2 Kg+</span> & get
        <span className="text-green-600 font-semibold"> 5% OFF</span>
      </p>
    </div>

    <div className="flex items-start gap-2">
      <span className="text-orange-500 text-base">🛒</span>
      <p className="text-slate-700">
        Shop above <span className="font-semibold">₹499</span> &
        get <span className="text-blue-600 font-semibold">Free Delivery</span>
      </p>
    </div>

    <div className="flex items-start gap-2">
      <span className="text-red-500 text-base">🎁</span>
      <p className="text-slate-700">
        Buy <span className="font-semibold">5 Items+</span> &
        get <span className="text-purple-600 font-semibold">10% OFF</span>
      </p>
    </div>

  </div>
</div>

  {/* BUTTONS */}
  <Button
  onClick={handleGoToCart}
  className="w-full h-10 bg-blue-600 rounded-xl"
>
  Go To Cart
</Button>

<Button
  onClick={handleBuyNow}
  className="w-full h-10 bg-orange-500 rounded-xl"
>
  Buy Now
</Button>

  {/* PAYMENT */}
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
    <h3 className="font-semibold mb-3">Payment Options</h3>

    <div className="grid grid-cols-2 gap-2 text-sm">
      <div>💰 COD</div>
      <div>📱 UPI</div>
      <div>💳 Cards</div>
      <div>🏦 EMI</div>
    </div>
  </div>

  {/* BENEFITS */}
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
    <h3 className="font-semibold mb-3">Benefits</h3>

    <ul className="space-y-2 text-sm">
      <li>✔ 100% Genuine</li>
      <li>✔ Best Price</li>
      <li>✔ Fast Delivery</li>
      <li>✔ GST Invoice</li>
    </ul>
  </div>

  {/* REVIEWS */}
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
    <h3 className="font-semibold mb-3">Reviews</h3>

    <p className="font-medium">⭐⭐⭐⭐⭐ User</p>
    <p className="text-sm text-slate-600 mt-2">
      Very useful and economical product
    </p>
  </div>

</div>
      </div>

      {/* STICKY BAR */}
      {/* STICKY BAR */}
{product && !loading && (

  <div
    className="
    fixed
    bottom-0
    left-0
    right-0
    border-t
    border-slate-200
    bg-white/95
    backdrop-blur-md
    px-4
    md:px-6
    py-3
    flex
    items-center
    justify-between
    z-50
    shadow-[0_-4px_20px_rgba(0,0,0,0.06)]
    animate-in
    slide-in-from-bottom
    duration-300
    "
  >

    {/* PRODUCT INFO */}
    <div className="min-w-0">

      <p className="
      text-xs
      text-slate-500
      line-clamp-1
      ">
        {product.name}
      </p>

      <p className="
      text-lg
      font-bold
      text-slate-900
      ">
        ₹
        {selectedUnit?.price ||
          product.finalPrice}
      </p>

    </div>

    {/* BUTTON */}
    <button
      onClick={handleAddToCart}
      className="
      h-12
      px-8
      rounded-2xl
      bg-blue-600
      hover:bg-blue-700
      active:scale-95
      transition-all
      text-white
      font-semibold
      shadow-md
      "
    >
      Add to Cart
    </button>

  </div>

)}

    </section>
  );
};

export default ProductDetails;

const Tabs = ({ product }: any) => {

  const [active, setActive] = useState(
    product.productDetails?.[0]?.title || ""
  );

  const tabs = product.productDetails || [];

  if (!tabs.length) return null;

  return (

    <div className="
    bg-white
    border
    border-slate-200
    rounded-2xl
    p-3
    shadow-sm
    ">

     <div className="flex gap-3 h-[170px]">

  {/* LEFT SCROLLABLE SECTION LIST */}
  <div
    className="
    w-[180px]
    overflow-y-auto
    pr-1
    space-y-2
    scrollbar-thin
    "
  >
    {tabs.map((tab: any, index: number) => {

      const isActive =
        active === tab.title;

      return (

        <button
          key={index}
          onClick={() =>
            setActive(tab.title)
          }
          className={`
          w-full
          text-left
          px-3
          py-2
          rounded-lg
          text-sm
          font-medium
          transition-all
          border

          ${
            isActive
              ? `
                bg-blue-600
                text-white
                border-blue-600
              `
              : `
                bg-slate-50
                text-slate-700
                border-slate-200
                hover:bg-blue-50
              `
          }
          `}
        >
          {tab.title}
        </button>

      );
    })}
  </div>

  {/* RIGHT CONTENT */}
  <div
    className="
    flex-1
    rounded-xl
    bg-slate-50
    border
    border-slate-100
    px-4
    py-3
    h-[170px]
    overflow-y-auto
    scrollbar-thin
    "
  >

{tabs.map((tab: any, index: number) => {

  if (active !== tab.title)
    return null;

  return (

    <div
      key={index}
      className="
      text-[14px]
      leading-7
      text-slate-700
      whitespace-pre-line
      "
    >

      {tab.content}

    </div>

  );
})}
         </div>
</div>

</div>

  );
};
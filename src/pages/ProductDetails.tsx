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

const ProductDetails = () => {
  const { id } = useParams();
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

  const currentPrice = Number(selectedUnit?.price || product.finalPrice || 0);
const originalPrice = Number(product.price || currentPrice);
const savedAmount = Math.max(0, originalPrice - currentPrice);

const discountPercent =
  originalPrice > 0
    ? Math.round((savedAmount / originalPrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    await addToCart({
      id: product._id,
      name: product.name,
      price: selectedUnit?.price || product.finalPrice,
unit: selectedUnit?.label || "",
      image: images?.[0],
      shop: product.shop,
      quantity: qty,
    });
  };


  return (
   <section className="max-w-7xl mx-auto px-4 lg:px-6 py-6 pb-24">

      <div className="grid lg:grid-cols-[300px_1fr_340px] gap-6 items-start">

        {/* LEFT (STICKY IMAGE) */}
        <div className="self-start">
  <div className="sticky top-24 h-fit">

    <div className="space-y-4">

      {/* MAIN IMAGE */}
      <div className="relative bg-white border border-slate-200 rounded-2xl p-5">
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
          className="absolute top-5 right-5 h-12 w-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:scale-105 transition"
        >
          <Heart className={inWishlist ? "text-red-500 fill-red-500" : ""} />
        </button>

        <img
          src={
            images?.[activeImage]
              ? `http://localhost:8000${images[activeImage]}`
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
            src={`http://localhost:8000${img}`}
            onClick={() => setActiveImage(i)}
className={`w-16 h-16 shrink-0 rounded-xl object-cover cursor-pointer border bg-white p-1 transition ${              activeImage === i
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

           <div className="flex items-center gap-3 flex-wrap">
  <span className="text-3xl font-bold">
    ₹{currentPrice}
  </span>

  {originalPrice > currentPrice && (
    <>
      <span className="line-through text-base text-slate-400">
        ₹{originalPrice}
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
  <div className="space-y-3">
    <p className="font-medium text-slate-800">
      Select Option
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {product.unitOptions.map((unit:any, i:number) => (
        <button
          key={i}
          onClick={() => setSelectedUnit(unit)}
          className={`rounded-2xl border p-4 text-center transition ${
            selectedUnit?.label === unit.label
              ? "border-blue-600 bg-blue-50"
              : "border-slate-200 bg-white hover:border-blue-300"
          }`}
        >
          <p className="font-semibold">
            {unit.label}
          </p>
          <p className="text-sm text-slate-500">
            ₹{unit.price}
          </p>
        </button>
      ))}
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
            <div className="border border-slate-200 rounded-3xl shadow-sm bg-white p-5 mt-3">
              <p className="font-medium">Is it compatible with Noris implants?</p>
              <p className="text-sm text-gray-600 mt-2">
                Yes, compatible with Noris systems.
              </p>
            </div>
          </div>


        </div>
        {/* RIGHT COLUMN */}
<div className="space-y-5 sticky top-24">

  {/* PRICE DETAILS */}
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
    <h3 className="font-semibold mb-4">Price Details</h3>

    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Item Total</span>
        <span>₹{originalPrice}</span>
      </div>

      <div className="flex justify-between text-green-600 font-medium">
        <span>Saved</span>
        <span>
          ₹{savedAmount}
        </span>
      </div>
    </div>
  </div>

 {/* OFFERS */}
<div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
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
  <Button className="w-full h-10 bg-blue-600 rounded-xl">
    Go To Cart
  </Button>

  <Button className="w-full h-10 bg-orange-500 rounded-xl">
    Buy Now
  </Button>

  {/* PAYMENT */}
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
    <h3 className="font-semibold mb-3">Payment Options</h3>

    <div className="grid grid-cols-2 gap-2 text-sm">
      <div>💰 COD</div>
      <div>📱 UPI</div>
      <div>💳 Cards</div>
      <div>🏦 EMI</div>
    </div>
  </div>

  {/* BENEFITS */}
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
    <h3 className="font-semibold mb-3">Benefits</h3>

    <ul className="space-y-2 text-sm">
      <li>✔ 100% Genuine</li>
      <li>✔ Best Price</li>
      <li>✔ Fast Delivery</li>
      <li>✔ GST Invoice</li>
    </ul>
  </div>

  {/* REVIEWS */}
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
    <h3 className="font-semibold mb-3">Reviews</h3>

    <p className="font-medium">⭐⭐⭐⭐⭐ User</p>
    <p className="text-sm text-slate-600 mt-2">
      Very useful and economical product
    </p>
  </div>

</div>
      </div>

      {/* STICKY BAR */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur-md px-6 py-4 flex justify-between items-center z-50">
        <div>
          <p className="text-sm">{product.name}</p>
          <p className="font-bold">₹{selectedUnit?.price || product.finalPrice}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-semibold shadow-sm"
        >
          ADD
        </button>
      </div>

    </section>
  );
};

export default ProductDetails;

const Tabs = ({ product }: any) => {
  const [active, setActive] = useState("");

  const tabs = product.productDetails || [];

  if (!tabs.length) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      {tabs.map((tab: any, index: number) => (
        <div
          key={index}
          className="border-b border-slate-200 last:border-b-0"
        >
          <button
            onClick={() =>
              setActive(
                active === tab.title
                  ? ""
                  : tab.title
              )
            }
            className="w-full py-4 flex justify-between items-center text-left"
          >
            <span className="font-medium text-slate-800">
              {tab.title}
            </span>

            <ChevronDown
              size={16}
              className={`transition ${
                active === tab.title
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {active === tab.title && (
            <div className="pb-4 text-sm text-slate-600 whitespace-pre-line">
              {tab.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
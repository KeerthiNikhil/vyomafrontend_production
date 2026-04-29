import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Minus, Plus, Star, Heart } from "lucide-react";

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

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data.data);
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

  const handleAddToCart = async () => {
    await addToCart({
      id: product._id,
      name: product.name,
      price: product.finalPrice,
      image: images?.[0],
      shop: product.shop,
      quantity: qty,
    });
  };

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
   <section className="max-w-7xl mx-auto px-4 py-6 pb-24 relative">

      <div className="grid lg:grid-cols-12 gap-10 items-start relative">

        {/* LEFT (STICKY IMAGE) */}
        <div className="lg:col-span-5 self-start">
  <div className="sticky top-24 h-fit">

    <div className="space-y-4">

      {/* MAIN IMAGE */}
      <div className="relative border border-slate-200 rounded-3xl shadow-sm p-5 bg-white">
        <button
          onClick={() =>
            inWishlist
              ? removeFromWishlist(product._id)
              : addToWishlist({
                  _id: product._id,
                  name: product.name,
                  price: product.finalPrice,
                  image: images?.[0],
                })
          }
          className="absolute right-3 top-3 bg-white p-2 rounded-full shadow"
        >
          <Heart className={inWishlist ? "text-red-500 fill-red-500" : ""} />
        </button>

        <img
          src={
            images?.[activeImage]
              ? `http://localhost:8000${images[activeImage]}`
              : "/placeholder.png"
          }
          className="w-full h-[520px] object-contain"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 overflow-x-auto">
        {images.map((img: string, i: number) => (
          <img
            key={i}
            src={`http://localhost:8000${img}`}
            onClick={() => setActiveImage(i)}
            className={`w-20 h-20 rounded-2xl cursor-pointer border border-slate-200 shadow-sm ${
              activeImage === i
  ? "border-blue-500 ring-2 ring-blue-100"
  : "border-slate-200"
            }`}
          />
        ))}
      </div>

    </div>

  </div>
</div>

        {/* RIGHT (ALL SCROLL CONTENT) */}
        <div className="lg:col-span-7 space-y-8">

          {/* TOP INFO */}
          <div className="space-y-5">

            <h1 className="text-2xl font-bold">{product.name}</h1>

            <div className="flex items-center gap-2 text-yellow-500">
              <Star size={16} fill="currentColor" />
              <span className="text-sm text-gray-600">4.4 (78 reviews)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">₹{product.finalPrice}</span>
              <span className="line-through text-gray-400">₹{product.price}</span>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                {Math.round((product.discountValue / product.price) * 100)}% off
              </span>
              <span className="text-yellow-500 text-sm">🪙 149</span>
            </div>

            <div className="flex gap-3">
              <div className="border border-slate-200 rounded-2xl shadow-sm bg-white px-5 py-3 text-sm">
                Buy 2+ for ₹{product.finalPrice - 60}
              </div>
              <div className="border border-slate-200 rounded-2xl shadow-sm bg-white px-5 py-3 text-sm">
                Buy 5+ for ₹{product.finalPrice - 80}
              </div>
            </div>

            <div className="flex gap-4 text-sm text-gray-600">
              <span>🚚 {formattedDate}</span>
              <span>🔁 10 Days Return</span>
              <span>💰 COD</span>
            </div>

            <StockIndicator stock={product.stock} />
            <EmiCalculator price={product.finalPrice} />

            <div className="border border-slate-200 rounded-3xl shadow-sm bg-white p-5">
              <p className="font-medium">{product.brand || "Dentaltech"}</p>
              <p className="text-sm text-blue-600 cursor-pointer">
                View More Products
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span>Quantity</span>
              <div className="flex border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                <button
  className="px-4 py-2 hover:bg-slate-100"
  onClick={() => setQty(Math.max(1, qty - 1))}
>
                  <Minus size={16} />
                </button>
                <span className="px-4">{qty}</span>
                <button
  className="px-4 py-2 hover:bg-slate-100"
  onClick={() => setQty(qty + 1)}
>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
  onClick={handleAddToCart}
  className="flex-1 bg-blue-600 rounded-2xl shadow-sm h-12"
>
                Add to Cart
              </Button>
              <Button className="flex-1 bg-orange-500 rounded-2xl shadow-sm h-12">
                Buy Now
              </Button>
            </div>

          </div>

          {/* TABS */}
          <Tabs product={product} />

          {/* PAYMENT + BENEFITS */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-3xl shadow-sm bg-white p-5">
              <h3 className="font-semibold mb-3">Payment Options</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="border border-slate-200 rounded-2xl bg-slate-50 p-3 text-center">COD</div>
                <div className="border border-slate-200 rounded-2xl bg-slate-50 p-3 text-center">UPI</div>
                <div className="border border-slate-200 rounded-2xl bg-slate-50 p-3 text-center">Cards</div>
                <div className="border border-slate-200 rounded-2xl bg-slate-50 p-3 text-center">EMI</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-3xl shadow-sm bg-white p-5">
              <h3 className="font-semibold mb-3">Benefits</h3>
              <ul className="text-sm space-y-1">
                <li>✔ 100% Genuine</li>
                <li>✔ Best Price</li>
                <li>✔ Fast Delivery</li>
                <li>✔ GST Invoice</li>
              </ul>
            </div>
          </div>

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

          {/* REVIEWS */}
          <div>
            <h3 className="font-semibold">Ratings & Reviews</h3>
            <div className="border border-slate-200 rounded-3xl shadow-sm bg-white p-5 mt-3">
              <p className="font-medium">User ⭐⭐⭐⭐⭐</p>
              <p className="text-sm text-gray-600">
                Very useful and economical product
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* STICKY BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-3 flex justify-between items-center z-50">
        <div>
          <p className="text-sm">{product.name}</p>
          <p className="font-bold">₹{product.finalPrice}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          ADD
        </button>
      </div>

    </section>
  );
};

export default ProductDetails;

const Tabs = ({ product }: any) => {
  const [active, setActive] = useState("Features");

  const tabs = [
    "Features",
    "Description",
    "Key Specifications",
    "Packaging",
    "Direction To Use",
    "Additional Info",
    "Warranty"
  ];

  return (
    <div className="border border-slate-200 rounded-3xl shadow-sm bg-white p-6">

      {/* TAB HEADERS */}
      <div className="flex gap-6 border-b pb-3 text-sm overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`whitespace-nowrap ${
              active === tab ? "text-blue-600 font-semibold" : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="mt-4 text-sm text-gray-600">

        {active === "Features" && (
          <ul className="list-disc ml-5 space-y-2">
            <li>Compatible with multiple implant systems</li>
            <li>Precision torque ratchet</li>
            <li>Color-coded drivers</li>
          </ul>
        )}

        {active === "Description" && (
          <p>{product.description || "No description available"}</p>
        )}

        {active === "Key Specifications" && (
          <div>
            <p>Brand: {product.brand}</p>
            <p>Stock: {product.stock}</p>
          </div>
        )}

        {active === "Packaging" && (
          <p>Comes in organized box packaging</p>
        )}

        {active === "Direction To Use" && (
          <p>Use as per clinical guidelines</p>
        )}

        {active === "Additional Info" && (
          <p>High durability and corrosion resistant</p>
        )}

        {active === "Warranty" && (
          <p>1 Year Manufacturer Warranty</p>
        )}

      </div>
    </div>
  );
};
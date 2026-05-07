import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import ShopCarousel from "@/components/shops/ShopCarousel";

// 🔥 Reuse HOME components
import TrustStrip from "@/components/common/TrustStrip";
import FeaturedCategories from "@/components/categories/FeaturedCategories";
import MidAdCarousel from "@/components/carousel/MidAdCarousel";
import NearbyShops from "@/components/shops/NearbyShops";
import HotSelling from "@/components/products/HotSelling";
import Recommended from "@/components/products/Recommended";

const ShopProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [shop, setShop] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        setLoading(true);

        const shopRes = await axios.get(
          `http://localhost:8000/api/v1/shops/${id}`
        );

        const productRes = await axios.get(
          `http://localhost:8000/api/v1/products/shop/${id}`
        );

        const shopData = shopRes.data.data;
        const productData = productRes.data.data;

        setShop(shopData);
        setProducts(productData);

        const uniqueCategories = [
          ...new Set(productData.map((p: any) => p.category)),
        ];

        setCategories(uniqueCategories);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ================= SHOP IMAGES =================
  const images =
    shop?.shopImages?.length > 0
      ? shop.shopImages.map(
          (img: string) => `http://localhost:8000${img}`
        )
      : shop?.shopImage
      ? [`http://localhost:8000${shop.shopImage}`]
      : ["/placeholder.png"];

  // ================= GROUP PRODUCTS =================
  const groupedProducts = categories.map((cat) => ({
    category: cat,
    items: products.filter((p) => p.category === cat),
  }));

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-72 bg-gray-300 rounded-xl mb-6"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">

      {/* ================= HERO (SHOP ONLY IMAGES) ================= */}
      <ShopCarousel images={images} />

      {/* ================= SHOP INFO ================= */}
      <div className="relative -mt-28 mb-10 px-6 text-white z-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          {shop?.shopName}
        </h1>

        <p className="text-sm opacity-90 mt-1">
          {shop?.businessType} • Mangalore
        </p>

        <div className="flex gap-3 mt-3">
          <span className="bg-green-500 px-3 py-1 rounded-full text-sm">
            ⭐ 4.5
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            Open Now
          </span>
        </div>
      </div>

      {/* ================= TRUST STRIP  ================= */}
      <TrustStrip />

      {/* ================= FEATURED CATEGORIES ================= */}
      <FeaturedCategories />

      {/* ================= MID ADS ================= */}
      <MidAdCarousel />

      {/* ================= PRODUCTS ================= */}
      {groupedProducts.map(({ category, items }) => (
        <div key={category} className="mb-12">

          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">{category}</h2>
            <button className="text-blue-600 text-sm">
              View All →
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto">
            {items.map((product) => (
              <div
  key={product._id}
  className="min-w-[220px] bg-white border border-slate-200 rounded-3xl p-4 shadow-sm hover:shadow-md transition"
>
  <img
    onClick={() => navigate(`/product/${product._id}`)}
    src={`http://localhost:8000${product.images?.[0]}`}
    className="h-40 w-full object-cover rounded-2xl cursor-pointer border border-slate-100"
  />

  <p className="mt-3 text-sm line-clamp-2 font-medium">
    {product.name}
  </p>

  <p className="mt-1 text-green-600 font-semibold text-lg">
    ₹{product.finalPrice}
  </p>

  <button
    onClick={() =>
      addToCart({
        id: product._id,
        name: product.name,
        price: product.finalPrice,
        image: product.images?.[0],
        shop: id,
        quantity: 1,
      })
    }
    className="mt-3 w-full bg-blue-600 text-white py-2 rounded-2xl shadow-sm hover:bg-blue-700"
  >
    Add to Cart
  </button>
</div>
            ))}
          </div>

        </div>
      ))}

      <NearbyShops />

<HotSelling
  products={products.slice(0, 10)}
/>

<Recommended
  products={[...products]
    .sort(() => 0.5 - Math.random())
    .slice(0, 10)}
/>

    </div>
  );
};

export default ShopProducts;
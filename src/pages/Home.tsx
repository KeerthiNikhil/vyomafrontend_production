import HeroCarousel from "@/components/carousel/HeroCarousel";
import ServiceHighlights from "@/components/home/ServiceHighlights";
import FeaturedCategories from "@/components/categories/FeaturedCategories";
import TopShops from "@/components/shops/TopShops";
import NearbyShops from "@/components/shops/NearbyShops";
import HotSelling from "@/components/products/HotSelling";
import Recommended from "@/components/products/Recommended";
import MidAdCarousel from "@/components/carousel/MidAdCarousel";
import axios from "@/lib/axios";
import { useEffect, useMemo, useState } from "react";
import VendorWarningModal from "@/components/VendorWarningModal";
import VendorEntryModal from "@/components/VendorEntryModal";

const Home = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [showEntry, setShowEntry] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/products");
        setProducts(res.data.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, []);

  const shuffledProducts = useMemo(() => {
    return [...products].sort(() => Math.random() - 0.5);
  }, [products]);

  const hotSellingProducts = shuffledProducts.slice(0, 6);
  const recommendedProducts = shuffledProducts.slice(6, 12);

  const handleAgree = () => {
    setShowWarning(false);
    setShowEntry(true);
  };

  return (
    <>
      <div className="p-4 text-right">
        <button
          onClick={() => setShowWarning(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Become a Vendor
        </button>
      </div>

      <VendorWarningModal
        open={showWarning}
        onClose={() => setShowWarning(false)}
        onConfirm={handleAgree}
      />

      <VendorEntryModal
        open={showEntry}
        onClose={() => setShowEntry(false)}
      />

      <HeroCarousel />
      <ServiceHighlights />
      <FeaturedCategories />
      <TopShops />
      <MidAdCarousel />
      <NearbyShops />

      <HotSelling products={hotSellingProducts} />

      <Recommended products={recommendedProducts} />
    </>
  );
};

export default Home;
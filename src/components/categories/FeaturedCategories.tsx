import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import FeaturedCategoryCard from "./FeaturedCategoryCard";

const API = "http://localhost:8000";

const FeaturedCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/products");

        const products = res.data.data || [];

        const grouped: Record<string, any[]> = {};

        // ✅ GROUP PRODUCTS BY CATEGORY
        products.forEach((product: any) => {
          const category = product.category || "Others";

          if (!grouped[category]) {
            grouped[category] = [];
          }

          grouped[category].push(product);
        });

        // ✅ FORMAT CATEGORY CARDS
        const formatted = Object.entries(grouped)
          .map(([category, items]: any) => {

            const random =
              items[Math.floor(Math.random() * items.length)];

            console.log("CATEGORY PRODUCT =", random);

            // ✅ SAFE IMAGE
            const imageUrl =
              random.images?.[0] ||
              random.image ||
              "/placeholder.png";

            return {
              title: category,

              subtitle: `${items.length}+ Products`,

              image:
                imageUrl.startsWith("http")
                  ? imageUrl
                  : imageUrl === "/placeholder.png"
                  ? imageUrl
                  : `${API}${imageUrl}`,

              slug: category
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/&/g, "and"),
            };
          })
          .slice(0, 6);

        setCategories(formatted);

      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

  if (!categories.length) return null;

  return (
    <section className="pt-2 py-10 mb-0">

      <div className="max-w-7xl mx-auto px-0">

        <h2 className="text-xl sm:text-2xl font-bold mb-1 pb-4">
          Featured Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">

          {categories.map((cat) => (

            <FeaturedCategoryCard
              key={cat.slug}
              title={cat.title}
              subtitle={cat.subtitle}
              image={cat.image}
              slug={cat.slug}
            />

          ))}

        </div>

      </div>

    </section>
  );
};

export default FeaturedCategories;
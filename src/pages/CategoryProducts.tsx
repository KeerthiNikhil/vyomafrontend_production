import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "@/lib/axios";
import ProductCard from "@/components/products/ProductCard";

const API = "http://localhost:8000";

const CategoryProducts = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/products");

        const allProducts = res.data.data || [];

        const filtered = allProducts.filter((p: any) =>
          p.category
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/&/g, "and") === slug
        );

        setProducts(filtered);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold capitalize mb-8">
        {slug?.replace(/-/g, " ")}
      </h1>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {products.map((product: any) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={Math.max(product.finalPrice || 0, 0)}
              image={
                product.images?.[0]
                  ? `${API}${product.images[0]}`
                  : "/placeholder.png"
              }
              weight={product.unit || "200 g"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
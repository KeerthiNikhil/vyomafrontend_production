import ProductCard from "@/components/products/ProductCard";

const API = "http://localhost:8000";

const Recommended = ({ products = [] }: any) => {
  if (!products.length) return null;

  // ✅ only 6 items
  const limitedProducts = products.slice(0, 6);

  return (
    <section className="py-2">
      <div className="max-w-7xl mx-auto px-0">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-1">
            Recommended For You
          </h2>

          <p className="text-gray-600">
            Personalized picks just for you 🚀
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {limitedProducts.map((product: any) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={Math.max(product.finalPrice || 0, 0)}
              image={
                product.images?.[0]?.startsWith("http")
                  ? product.images[0]
                  : product.images?.[0]
                  ? `${API}${product.images[0]}`
                  : "/placeholder.png"
              }
              weight={product.unit || "200 g"}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recommended;
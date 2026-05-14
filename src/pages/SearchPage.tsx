import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

const SearchPage = () => {

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  const [results, setResults] = useState<any>(null);

  useEffect(() => {

    const fetchResults = async () => {

      const res = await axios.get(
        `http://localhost:8000/api/v1/search?q=${query}`
      );

      setResults(res.data.data);

    };

    if (query) fetchResults();

  }, [query]);

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Search results for "{query}"
      </h1>

      {/* Shops */}

      <h2 className="font-semibold mb-2">Shops</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {results?.shops?.map((shop:any) => (

          <div key={shop._id} className="border p-3 rounded">

            <img
              src={`http://localhost:8000${shop.shopImages?.[0]
  ? `http://localhost:8000${shop.shopImages[0]}`
  : "/placeholder.png"}`}
              className="h-32 w-full object-cover rounded"
            />

            <p className="mt-2 font-semibold">
              {shop.shopName}
            </p>

          </div>

        ))}

      </div>

      {/* Products */}

      <h2 className="font-semibold mt-8 mb-2">Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {results?.products?.map((product:any) => (

          <div key={product._id} className="border p-3 rounded">

            <img
              src={
  product.images?.[0]?.startsWith("http")
    ? product.images[0]
    : `http://localhost:8000${product.images?.[0]}`
}
              className="h-32 w-full object-cover rounded"
            />

            <p className="mt-2 font-semibold">
              {product.name}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default SearchPage;
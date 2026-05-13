import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import {
  inputStyle,
  selectStyle,
  primaryButton,
  cardStyle,
} from "@/styles/uiStyles";

const ManageProduct = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState(""); 
  const [category, setCategory] = useState("all");
  const [subCategory, setSubCategory] = useState("all");
const [subCategories, setSubCategories] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState("");
  const [editProduct, setEditProduct] = useState<any>(null);

  /* FETCH PRODUCTS */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/products/vendor-products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        }
      );

      setProducts(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/categories/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories(res.data.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  fetchCategories();
}, []);

useEffect(() => {
  const uniqueSubs = [
    ...new Set(products.map((p) => p.subCategory).filter(Boolean)),
  ];
  setSubCategories(uniqueSubs);
}, [products]);

  /* DELETE */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/v1/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* FILTER */
  const filtered = products.filter((p) => {
  const matchSearch =
    p.name?.toLowerCase().includes(search.toLowerCase());

  const matchCategory =
    category === "all" ||
    p.category === category ||
    p.category?.name === category;

  const matchSubCategory =
    subCategory === "all" ||
    p.subCategory === subCategory;

  return matchSearch && matchCategory && matchSubCategory;
});
  /* GROUP BY SHOP */
  const groupedProducts = filtered.reduce((acc: any, product: any) => {
    const shopName = product.shop?.shopName || "Other";

    if (!acc[shopName]) acc[shopName] = [];
    acc[shopName].push(product);

    return acc;
  }, {});

  const openEditModal = (product: any) => {
    setEditProduct(product);
  };
  const [categories, setCategories] = useState<any[]>([]);

  return (
    <div className="
max-w-7xl
mx-auto
p-6
space-y-8
bg-slate-50
min-h-screen
">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>
  <h1
    className="
    text-3xl
    md:text-4xl
    font-extrabold
    tracking-tight
    text-slate-900
    "
  >
    Manage Products
  </h1>

  <p className="text-slate-500 mt-1 text-sm">
    {filtered.length} products available
  </p>
</div>

        <div className="
flex
flex-col
sm:flex-row
gap-3
w-full
lg:w-auto
">

          <Input
  placeholder="🔍 Search products..."
  value={search}
  onChange={(e)=>setSearch(e.target.value)}
  className={`w-full sm:w-[260px] ${inputStyle}`}
/>

         <div className="relative">

<select
  className={selectStyle}
  value={category}
  onChange={(e)=>setCategory(e.target.value)}
>
  <option value="all">📦 All Categories</option>

  {categories.map((cat) => (
    <option key={cat._id} value={cat.name}>
      {cat.name}
    </option>
  ))}
</select>

<span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
▼
</span>

</div>

          <div className="relative">

<select
  value={subCategory}
  onChange={(e) => setSubCategory(e.target.value)}
  className={selectStyle}
>
  <option value="all">
    🧩 All Subcategories
  </option>

  {subCategories.map((sub, index) => (
    <option key={index} value={sub}>
      {sub}
    </option>
  ))}
</select>

<span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
▼
</span>

</div>
          <Button
  className={primaryButton}
            onClick={() => navigate("/vendor/products/add")}
          >
            ➕ Add Product
          </Button>

        </div>
      </div>

      {/* PRODUCTS */}
      {Object.entries(groupedProducts).map(([shopName, shopProducts]: any) => (

        <div key={shopName} className="space-y-4">

          <h2 className="
text-2xl
font-bold
text-slate-800
border-b
border-slate-200
pb-3
flex items-center gap-2
">
            🏪 {shopName}
          </h2>

          <div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
xl:grid-cols-4
gap-5
">

            {shopProducts.map((product: any) => (

  <div
    key={product._id}
    className={`
    ${cardStyle}
    p-5
    space-y-3
    group
    hover:-translate-y-1
    hover:shadow-xl
    transition-all
    duration-300
    `}
  >         

                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={
                      product.images?.[0]
                        ? `http://localhost:8000${product.images[0]}`
                        : "/no-image.png"
                    }
                    className="
w-full
h-44
object-cover
rounded-2xl
bg-slate-100
transition-transform
duration-500
group-hover:scale-105
"
                  />

                  <span className={`absolute top-1 right-1 text-[10px] px-2 py-0.5 rounded-full ${
                    product.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {product.stock > 0 ? "In Stock" : "Out"}
                  </span>
                </div>

                {/* NAME */}
                <h2 className="
text-[15px]
font-semibold
text-slate-800
line-clamp-1
">
                  {product.name}
                </h2>
                <div className="flex gap-2 flex-wrap">

  <span
    className="
    text-[11px]
    bg-blue-50
    text-blue-700
    px-2 py-1
    rounded-full
    font-medium
    "
  >
    {product.category}
  </span>

  {product.subCategory && (
    <span
      className="
      text-[11px]
      bg-slate-100
      text-slate-700
      px-2 py-1
      rounded-full
      font-medium
      "
    >
      {product.subCategory}
    </span>
  )}

</div>

                {/* PRICE + STOCK */}
                <div className="flex items-center justify-between">

  <p className="text-lg font-bold text-slate-900">
    ₹{product.price}
  </p>

  <p
    className="
    text-xs
    bg-slate-100
    px-3 py-1
    rounded-full
    text-slate-600
    font-medium
    "
  >
    📦 {product.stock}
  </p>

</div>

                {/* ACTIONS */}
               <div className="
relative
flex justify-between items-center
pt-4
">
  
  {/* Gradient Divider */}
  <div className="
  absolute
  top-0
  left-0
  w-full
  h-[1px]
  bg-gradient-to-r
  from-transparent
  via-slate-200
  to-transparent
  " /> 

<button
  onClick={() => openEditModal(product)}
  className="
w-9 h-9
rounded-xl
bg-blue-50
hover:bg-blue-100
text-blue-600
flex items-center justify-center
transition
"
>
  <Pencil size={16} />
</button>

<button
  onClick={() => handleDelete(product._id)}
  className="
w-9 h-9
rounded-xl
bg-red-50
hover:bg-red-100
text-red-500
flex items-center justify-center
transition
"
>
  <Trash2 size={16} />
</button>

</div>

              </div>

            ))}

          </div>

        </div>

      ))}

      {/* EMPTY */}
      {filtered.length === 0 && (
        <div className="
bg-white
border border-slate-200
rounded-3xl
py-20 px-10
text-center
shadow-sm
">

  <div className="text-5xl mb-4">
    📦
  </div>

  <h2 className="text-xl font-semibold text-slate-800">
    No Products Found
  </h2>

  <p className="text-slate-500 mt-2">
    Try changing filters or add a new product
  </p>

</div>
      )}

      {/* EDIT MODAL */}
      {editProduct && (
        <div className="
fixed inset-0
bg-black/50
backdrop-blur-sm
flex items-center justify-center
z-50
p-4
">

          <div className="
bg-white
w-full
max-w-md
rounded-3xl
shadow-2xl
border border-slate-200
p-7
space-y-5
animate-in fade-in zoom-in-95
">

            <h2 className="
text-2xl
font-bold
text-slate-800
">Edit Product</h2>

            <Input
              className={inputStyle}
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
            />
            <textarea
  value={editProduct.description || ""}
  onChange={(e) =>
    setEditProduct({ ...editProduct, description: e.target.value })
  }
  placeholder="Enter description..."
  className="
w-full
min-h-[110px]
rounded-2xl
border border-slate-200
bg-slate-50
px-4 py-3
text-sm
shadow-sm
focus:ring-4
focus:ring-blue-100
focus:border-blue-500
outline-none
resize-none
"
  rows={3}
/>

            <Input
              className={inputStyle}
              type="number"
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
            />

            <Input
            className={inputStyle}
              type="number"
              value={editProduct.stock}
              onChange={(e) =>
                setEditProduct({ ...editProduct, stock: e.target.value })
              }
            />

            <img
              src={`http://localhost:8000${editProduct.images?.[0]}`}
              className="
w-full
h-52
object-cover
rounded-2xl
bg-slate-100
border border-slate-200
"
            />

           <div className="flex justify-between items-center pt-3 border-t">
              <button
  className="text-gray-500 hover:text-black"
  onClick={() => setEditProduct(null)}
>
  Cancel
</button>

<button
  className="
h-11
px-6
rounded-2xl
bg-blue-600
hover:bg-blue-700
text-white
font-semibold
shadow-md
transition
"
  onClick={async () => {
  try {
    const payload = {
      name: editProduct.name,
      description: editProduct.description,
      price: Number(editProduct.price),
      stock: Number(editProduct.stock),
    };

    console.log("PAYLOAD 👉", payload);

    const res = await axios.put(
      `http://localhost:8000/api/v1/products/${editProduct._id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("SUCCESS 👉", res.data);

    toast.success("Product updated ✅");

    setEditProduct(null);
    fetchProducts();

  } catch (err: any) {
    console.log("ERROR 👉", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Update failed ❌");
  }
}}
>
  Save
</button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ManageProduct;
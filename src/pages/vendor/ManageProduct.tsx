import { useEffect, useState } from "react";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Pencil,
  Trash2,
  Upload,
  X,
  ZoomIn,
} from "lucide-react";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  inputStyle,
  selectStyle,
  primaryButton,
  cardStyle,
} from "@/styles/uiStyles";

const ManageProduct = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  /* ================= STATES ================= */

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [subCategory, setSubCategory] = useState("all");
  const [shopFilter, setShopFilter] = useState("all");

  const [subCategories, setSubCategories] =
    useState<string[]>([]);

  const [editProduct, setEditProduct] =
    useState<any>(null);

  const [newImages, setNewImages] =
    useState<File[]>([]);

  const [previewImages, setPreviewImages] =
    useState<string[]>([]);

  const [fullImage, setFullImage] =
    useState("");

  /* ================= FETCH PRODUCTS ================= */

  const fetchProducts = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8000/api/v1/products/vendor-products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(res.data.data || []);

    } catch {

      toast.error("Failed to load products");

    }

  };

  /* ================= FETCH SHOPS ================= */

  const fetchShops = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8000/api/v1/shops/my-shops",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShops(res.data.data || []);

    } catch {

      toast.error("Failed to load shops");

    }

  };

  /* ================= FETCH CATEGORIES ================= */

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

      setCategories(res.data.data || []);

    } catch {

      toast.error("Failed to load categories");

    }

  };

  useEffect(() => {

    fetchProducts();
    fetchShops();
    fetchCategories();

  }, []);

  /* ================= SUBCATEGORIES ================= */

  useEffect(() => {

    const uniqueSubs = [
      ...new Set(
        products
          .map((p) => p.subCategory)
          .filter(Boolean)
      ),
    ];

    setSubCategories(uniqueSubs);

  }, [products]);

  /* ================= IMAGE URL ================= */

  const getImageUrl = (img: string) => {

    if (!img) return "/no-image.png";

    return img.startsWith("http")
      ? img
      : `http://localhost:8000${img}`;

  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {

    if (!confirm("Delete this product?")) return;

    try {

      await axios.delete(
        `http://localhost:8000/api/v1/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product deleted");

      fetchProducts();

    } catch {

      toast.error("Delete failed");

    }

  };

  /* ================= OPEN EDIT ================= */

  const openEditModal = (product: any) => {

    setEditProduct({

      ...product,

      selectedSubCategory:
        product.subCategory || "",

      unitOptions:
        product.unitOptions?.length
          ? product.unitOptions
          : [{ label: "", price: "" }],

      productDetails:
        product.productDetails?.length
          ? product.productDetails
          : [{ title: "", content: "" }],

    });

    setNewImages([]);
    setPreviewImages([]);

  };

  /* ================= FILTER PRODUCTS ================= */

  const filtered = products.filter((p) => {

    const matchSearch =
      p.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchCategory =
      category === "all" ||
      p.category === category ||
      p.category?.name === category;

    const matchSubCategory =
      subCategory === "all" ||
      p.subCategory === subCategory;

    const matchShop =
      shopFilter === "all" ||
      p.shop?.shopName === shopFilter;

    return (
      matchSearch &&
      matchCategory &&
      matchSubCategory &&
      matchShop
    );

  });

  /* ================= GROUP PRODUCTS ================= */

  const groupedProducts = filtered.reduce(
    (acc: any, product: any) => {

      const shopName =
        product.shop?.shopName || "Other";

      if (!acc[shopName]) {

        acc[shopName] = [];

      }

      acc[shopName].push(product);

      return acc;

    },
    {}
  );

  /* ================= SHOPS ================= */

  const uniqueShops = [
    ...new Set(
      products
        .map((p) => p.shop?.shopName)
        .filter(Boolean)
    ),
  ];

  /* ================= HANDLE IMAGES ================= */

  const handleImages = (e: any) => {

    const files = Array.from(
      e.target.files
    ) as File[];

    const total =
      (editProduct.images?.length || 0) +
      files.length;

    if (total > 4) {

      toast.error("Maximum 4 images allowed");

      return;

    }

    setNewImages(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);

  };

  return (

    <div className="
    max-w-7xl
    mx-auto
    p-6
    bg-slate-50
    min-h-screen
    space-y-8
    ">

      {/* ================= HEADER ================= */}

      {/* ================= HEADER ================= */}

<div
  className="
  flex
  flex-col
  xl:flex-row
  xl:items-center
  xl:justify-between
  gap-6
  "
>

  {/* LEFT */}
  <div>

    <h1
      className="
      text-4xl
      md:text-5xl
      font-black
      tracking-tight
      text-slate-900
      "
    >
      Manage Products
    </h1>

    <p
      className="
      text-slate-500
      mt-2
      text-lg
      "
    >
      {filtered.length} products available
    </p>

  </div>

  {/* RIGHT FILTERS */}
  <div
    className="
    flex
    flex-wrap
    items-center
    gap-4
    xl:justify-end
    "
  >

    {/* SEARCH */}
    <div className="w-[280px]">

      <Input
        placeholder="🔍 Search products"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className={`
        ${inputStyle}
        h-14
        rounded-2xl
        text-base
        `}
      />

    </div>

    {/* ALL SHOPS */}
    <div className="relative w-[220px]">

      <select
        value={shopFilter}
        onChange={(e) =>
          setShopFilter(e.target.value)
        }
        className="
        w-full
        h-14
        px-5
        pr-12
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        appearance-none
        outline-none
        text-slate-800
        font-medium
        hover:border-blue-300
        focus:border-blue-500
        focus:ring-4
        focus:ring-blue-100
        transition
        "
      >

        <option value="all">
          🏪 All Shops
        </option>

        {uniqueShops.map(
          (shop: any, index) => (

            <option
              key={index}
              value={shop}
            >
              {shop}
            </option>

          )
        )}

      </select>

      {/* DROPDOWN ICON */}
      <div
        className="
        absolute
        right-4
        top-1/2
        -translate-y-1/2
        pointer-events-none
        text-slate-500
        "
      >
        ▼
      </div>

    </div>

    {/* CATEGORY */}
    <div className="relative w-[220px]">

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
        className="
        w-full
        h-14
        px-5
        pr-12
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        appearance-none
        outline-none
        text-slate-800
        font-medium
        hover:border-blue-300
        focus:border-blue-500
        focus:ring-4
        focus:ring-blue-100
        transition
        "
      >

        <option value="all">
          📦 All Categories
        </option>

        {categories.map((cat) => (

          <option
            key={cat._id}
            value={cat.name}
          >
            {cat.name}
          </option>

        ))}

      </select>

      <div
        className="
        absolute
        right-4
        top-1/2
        -translate-y-1/2
        pointer-events-none
        text-slate-500
        "
      >
        ▼
      </div>

    </div>

    {/* SUBCATEGORY */}
    <div className="relative w-[240px]">

      <select
        value={subCategory}
        onChange={(e) =>
          setSubCategory(e.target.value)
        }
        className="
        w-full
        h-14
        px-5
        pr-12
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        appearance-none
        outline-none
        text-slate-800
        font-medium
        hover:border-blue-300
        focus:border-blue-500
        focus:ring-4
        focus:ring-blue-100
        transition
        "
      >

        <option value="all">
          🧩 All Subcategories
        </option>

        {subCategories.map(
          (sub, index) => (

            <option
              key={index}
              value={sub}
            >
              {sub}
            </option>

          )
        )}

      </select>

      <div
        className="
        absolute
        right-4
        top-1/2
        -translate-y-1/2
        pointer-events-none
        text-slate-500
        "
      >
        ▼
      </div>

    </div>

    {/* ADD PRODUCT BUTTON */}
    <Button
      className="
      h-14
      px-8
      rounded-2xl
      bg-blue-600
      hover:bg-blue-700
      text-white
      font-semibold
      shadow-lg
      text-base
      "
      onClick={() =>
        navigate("/vendor/products/add")
      }
    >
      ➕ Add Product
    </Button>

  </div>

</div>

      {/* ================= PRODUCTS ================= */}

      {Object.entries(groupedProducts).map(
        ([shopName, shopProducts]: any) => (

          <div
            key={shopName}
            className="space-y-5"
          >

            <h2 className="
            text-2xl
            font-bold
            border-b
            pb-3
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
                  space-y-4
                  `}
                >

                  {/* IMAGE */}

                  <img
                    src={getImageUrl(product.images?.[0])}
                    className="
                    w-full
                    h-52
                    object-cover
                    rounded-2xl
                    "
                  />

                  {/* NAME */}

                  <h3 className="
                  font-semibold
                  text-lg
                  line-clamp-1
                  ">
                    {product.name}
                  </h3>

                  {/* PRICE */}

                  <div className="
                  flex
                  justify-between
                  items-center
                  ">

                    <p className="
                    font-bold
                    text-lg
                    ">
                      ₹{product.price}
                    </p>

                    <p className="
                    text-sm
                    text-slate-500
                    ">
                      Stock: {product.stock}
                    </p>

                  </div>

                  {/* ACTIONS */}

                  <div className="
                  flex
                  justify-between
                  pt-3
                  border-t
                  ">

                    <button
                      onClick={() =>
                        openEditModal(product)
                      }
                      className="
                      w-10
                      h-10
                      rounded-xl
                      bg-blue-50
                      flex
                      items-center
                      justify-center
                      text-blue-600
                      "
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(product._id)
                      }
                      className="
                      w-10
                      h-10
                      rounded-xl
                      bg-red-50
                      flex
                      items-center
                      justify-center
                      text-red-600
                      "
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )
      )}

      {/* ================= FULL IMAGE MODAL ================= */}

      {/* ================= FULL IMAGE VIEWER ================= */}

{fullImage && (

  <div
    className="
    fixed
    inset-0
    z-[200]
    bg-black/90
    flex
    items-center
    justify-center
    p-5
    "
  >

    <button
      onClick={() => setFullImage("")}
      className="
      absolute
      top-5
      right-5
      w-12
      h-12
      rounded-full
      bg-white
      text-black
      flex
      items-center
      justify-center
      shadow-lg
      "
    >
      <X size={24} />
    </button>

    <img
      src={fullImage}
      className="
      max-w-full
      max-h-[95vh]
      object-contain
      rounded-2xl
      shadow-2xl
      "
    />

  </div>

)}

{/* ================= EDIT MODAL ================= */}

{editProduct && (

  <div
    className="
    fixed
    inset-0
    z-50
    bg-black/50
    backdrop-blur-sm
    flex
    items-center
    justify-center
    p-4
    "
  >

    <div
      className="
      w-full
      max-w-6xl
      h-[94vh]
      bg-white
      rounded-[32px]
      shadow-2xl
      overflow-hidden
      flex
      flex-col
      "
    >

      {/* ================= HEADER ================= */}

      <div
        className="
        sticky
        top-0
        z-20
        bg-white
        border-b
        px-8
        py-5
        flex
        items-center
        justify-between
        "
      >

        <div>

          <h2
            className="
            text-4xl
            font-black
            text-slate-900
            "
          >
            Edit Product
          </h2>

          <p className="text-slate-500 mt-1">
            Update complete product details
          </p>

        </div>

        <button
          onClick={() => setEditProduct(null)}
          className="
          w-12
          h-12
          rounded-2xl
          hover:bg-slate-100
          flex
          items-center
          justify-center
          transition
          "
        >
          <X size={24} />
        </button>

      </div>

      {/* ================= BODY ================= */}

      <div
        className="
        flex-1
        overflow-y-auto
        bg-slate-50
        px-8
        py-7
        space-y-8
        "
      >

        {/* ================= BASIC INFO ================= */}

        <div className="
        bg-white
        rounded-3xl
        border
        border-slate-200
        p-6
        shadow-sm
        space-y-6
        ">

          <h3 className="
          text-xl
          font-bold
          text-slate-800
          ">
            Basic Information
          </h3>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="space-y-2">

              <label className="text-sm font-semibold text-slate-700">
                Product Name
              </label>

              <Input
                className={inputStyle}
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    name: e.target.value,
                  })
                }
              />

            </div>

            <div className="space-y-2">

              <label className="text-sm font-semibold text-slate-700">
                Brand
              </label>

              <Input
                className={inputStyle}
                value={editProduct.brand || ""}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    brand: e.target.value,
                  })
                }
              />

            </div>

          </div>

          <div className="grid md:grid-cols-3 gap-5">

            <div className="space-y-2">

              <label className="text-sm font-semibold text-slate-700">
                Category
              </label>

              <select
                className={selectStyle}
                value={editProduct.category}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    category: e.target.value,
                  })
                }
              >
                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat.name}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>

            </div>

            <div className="space-y-2">

              <label className="text-sm font-semibold text-slate-700">
                Price
              </label>

              <Input
                type="number"
                className={inputStyle}
                value={editProduct.price}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    price: e.target.value,
                  })
                }
              />

            </div>

            <div className="space-y-2">

              <label className="text-sm font-semibold text-slate-700">
                Stock
              </label>

              <Input
                type="number"
                className={inputStyle}
                value={editProduct.stock}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    stock: e.target.value,
                  })
                }
              />

            </div>

          </div>

          <div className="space-y-2">

            <label className="text-sm font-semibold text-slate-700">
              Description
            </label>

            <Textarea
              rows={6}
              className="
              rounded-3xl
              border-slate-200
              focus-visible:ring-4
              focus-visible:ring-blue-100
              min-h-[180px]
              "
              value={editProduct.description || ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  description: e.target.value,
                })
              }
            />

          </div>

        </div>

        {/* ================= PRODUCT DETAILS ================= */}

        <div className="
        bg-white
        rounded-3xl
        border
        border-slate-200
        p-6
        shadow-sm
        space-y-5
        ">

          <div className="
          flex
          items-center
          justify-between
          ">

            <h3 className="
            text-xl
            font-bold
            text-slate-800
            ">
              Product Information Sections
            </h3>

            <Button
              type="button"
              onClick={() =>
                setEditProduct({
                  ...editProduct,
                  productDetails: [
                    ...(editProduct.productDetails || []),
                    {
                      title: "",
                      content: "",
                    },
                  ],
                })
              }
            >
              + Add Section
            </Button>

          </div>

          {(editProduct.productDetails || []).map(
            (item: any, index: number) => (

              <div
                key={index}
                className="
                border
                border-slate-200
                rounded-3xl
                p-5
                bg-slate-50
                space-y-4
                "
              >

                <Input
                  className={inputStyle}
                  value={item.title}
                  placeholder="Section Title"
                  onChange={(e) => {

                    const updated = [
                      ...editProduct.productDetails,
                    ];

                    updated[index].title =
                      e.target.value;

                    setEditProduct({
                      ...editProduct,
                      productDetails: updated,
                    });

                  }}
                />

                <Textarea
                  rows={5}
                  className="
                  rounded-3xl
                  border-slate-200
                  min-h-[130px]
                  "
                  value={item.content}
                  placeholder="Enter details..."
                  onChange={(e) => {

                    const updated = [
                      ...editProduct.productDetails,
                    ];

                    updated[index].content =
                      e.target.value;

                    setEditProduct({
                      ...editProduct,
                      productDetails: updated,
                    });

                  }}
                />

              </div>

            )
          )}

        </div>

        {/* ================= PRODUCT IMAGES ================= */}

        <div className="
        bg-white
        rounded-3xl
        border
        border-slate-200
        p-6
        shadow-sm
        space-y-5
        ">

          <div className="
          flex
          items-center
          justify-between
          ">

            <h3 className="
            text-xl
            font-bold
            text-slate-800
            ">
              Product Images
            </h3>

            <label
              className="
              cursor-pointer
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-3
              rounded-2xl
              text-sm
              font-semibold
              flex
              items-center
              gap-2
              transition
              "
            >

              <Upload size={18} />

              Replace Images

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImages}
              />

            </label>

          </div>

          <div className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-4
          ">

            {(previewImages.length
              ? previewImages
              : editProduct.images || []
            ).map((img: any, index: number) => (

              <div
                key={index}
                className="
                relative
                group
                rounded-3xl
                overflow-hidden
                border
                border-slate-200
                "
              >

                <img
                  src={
                    previewImages.length
                      ? img
                      : getImageUrl(img)
                  }
                  onClick={() =>
                    setFullImage(
                      previewImages.length
                        ? img
                        : getImageUrl(img)
                    )
                  }
                  className="
                  w-full
                  h-64
                  object-cover
                  cursor-pointer
                  transition
                  group-hover:scale-105
                  "
                />

                <div
                  className="
                  absolute
                  inset-0
                  bg-black/40
                  opacity-0
                  group-hover:opacity-100
                  transition
                  flex
                  items-center
                  justify-center
                  "
                >

                  <ZoomIn
                    className="text-white"
                    size={28}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* ================= FOOTER ================= */}

      <div
        className="
        border-t
        bg-white
        px-8
        py-5
        flex
        items-center
        justify-between
        "
      >

        <Button
          className="
          rounded-2xl
          px-8
          h-12
          bg-blue-600
          hover:bg-blue-700
          text-white
          shadow-lg
          "
          onClick={() =>
            setEditProduct(null)
          }
        >
          Cancel
        </Button>

        <Button
          className="
          rounded-2xl
          px-8
          h-12
          bg-blue-600
          hover:bg-blue-700
          text-white
          shadow-lg
          "
        >
          Save Product
        </Button>

      </div>

    </div>

  </div>

)}

    </div>

  );

};

export default ManageProduct;
import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ChevronDown,
  Search,
  Check,
} from "lucide-react";

const inputStyle =
  "h-12 rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500";
const textareaStyle =
  "min-h-[120px] rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500";

  const SearchableSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled = false,
}: any) => {

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  
  const filteredOptions = options.filter(
    (item: any) =>
      item.label
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (

    <div className="relative">

      {/* SELECT BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="
        w-full
        h-14
        px-5
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        flex
        items-center
        justify-between
        hover:border-blue-400
        transition
        "
      >

        <span className="
        text-slate-800
        font-medium
        truncate
        ">

          {value || placeholder}

        </span>

        <ChevronDown
          size={18}
          className={`
          text-slate-500
          transition-transform
          ${open ? "rotate-180" : ""}
          `}
        />

      </button>

      {/* DROPDOWN */}
      {open && (

        <div className="
        absolute
        z-50
        mt-2
        w-full
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-xl
        overflow-hidden
        ">

          {/* SEARCH */}
          <div className="
          flex
          items-center
          gap-2
          px-4
          py-3
          border-b
          border-slate-100
          ">

            <Search
              size={16}
              className="text-slate-400"
            />

            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search section..."
              className="
              w-full
              outline-none
              text-sm
              "
            />

          </div>

          {/* OPTIONS */}
          <div className="
          max-h-72
          overflow-y-auto
          ">

            {filteredOptions.length > 0 ? (

              filteredOptions.map(
                (item: any, index: number) => {

                  const selected =
                    value === item.label;

                  return (

                    <button
                      key={index}
                      type="button"
                      onClick={() => {

                        onChange(item.label);

                        setOpen(false);

                        setSearch("");

                      }}
                      className={`
                      w-full
                      px-4
                      py-3
                      flex
                      items-center
                      justify-between
                      text-left
                      hover:bg-blue-50
                      transition

                      ${
                        selected
                          ? "bg-blue-50"
                          : ""
                      }
                      `}
                    >

                      <span className="
                      flex
                      items-center
                      gap-3
                      ">

                        <span className="text-lg">
                          {item.icon}
                        </span>

                        <span className="
                        font-medium
                        text-slate-700
                        ">
                          {item.label}
                        </span>

                      </span>

                      {selected && (
                        <Check
                          size={16}
                          className="
                          text-blue-600
                          "
                        />
                      )}

                    </button>

                  );
                }
              )

            ) : (

              <div className="
              p-4
              text-sm
              text-slate-400
              text-center
              ">

                No sections found

              </div>

            )}

          </div>

        </div>

      )}

    </div>

  );
};

const SelectField = ({
  value,
  onChange,
  children,
  disabled = false,
}: any) => {
  return (
    <div className="relative">

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="
        w-full
        h-12
        px-5
        pr-12
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        outline-none
        appearance-none
        transition
        hover:border-blue-400
        focus:border-blue-500
        focus:ring-4
        focus:ring-blue-100
        disabled:bg-slate-100
        "
      >
        {children}
      </select>

      <ChevronDown
        size={16}
        className="
        absolute
        right-4
        top-1/2
        -translate-y-1/2
        text-slate-400
        pointer-events-none
        "
      />

    </div>
  );
};


const AddProduct = () => {

  const token = localStorage.getItem("token");

  const [uploadType,setUploadType] = useState("single");

  const [shops,setShops] = useState<any[]>([]);
  const [shopId,setShopId] = useState("");

  const [name,setName] = useState("");
  const [category,setCategory] = useState("");
  const [price,setPrice] = useState("");
  const [stock,setStock] = useState("");
  const [description,setDescription] = useState("");

  const [discountType,setDiscountType] = useState("");
  const [discountValue,setDiscountValue] = useState("");
  const [offers, setOffers] = useState([
  {
    title: "",
    type: "product",
  },
]);
const [rewardCoins, setRewardCoins] =
  useState("");
 const [deliveryFee, setDeliveryFee] =
  useState("");
  const [images,setImages] = useState<File[]>([]);

  const [file,setFile] = useState<any>(null);

  const [expiryDate,setExpiryDate] = useState("");
  const [weight,setWeight] = useState("");
  const [size,setSize] = useState("");
  const [brand,setBrand] = useState("");
  const [modelNumber,setModelNumber] = useState("");
  const [author,setAuthor] = useState("");
  const [ageGroup,setAgeGroup] = useState("");
  const [material,setMaterial] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [deliveryTime, setDeliveryTime] = useState("");
const [returnPolicy, setReturnPolicy] = useState("");
const [codAvailable, setCodAvailable] = useState(true);
const [unitOptions, setUnitOptions] = useState<any[]>([
  { label: "", price: "" }
]);
const [productDetails, setProductDetails] = useState([
  { title: "", content: "" }
]);
  /* ================= GET SHOPS ================= */

  useEffect(()=>{

    const fetchShops = async()=>{

      try{

        const res = await axios.get(
          "http://localhost:8000/api/v1/shops/my-shops",
          {headers:{Authorization:`Bearer ${token}`}}
        );

        setShops(res.data.data);

      }catch{

        toast.error("Failed to load shops");

      }

    };

    fetchShops();

  },[]);



  /* ================= HANDLE IMAGE ================= */
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

  const handleImages = (e:any)=>{

  const files = Array.from(e.target.files);

  const newImages = [...images, ...files];

  if(newImages.length > 4){

    toast.error("Maximum 4 images allowed");
    return;

  }

  setImages(newImages);

};

const [subCategories, setSubCategories] = useState<string[]>([]);
const [selectedSubCategory, setSelectedSubCategory] = useState("");
  /* ================= SINGLE PRODUCT ================= */

  const handleSubmit = async()=>{

   if (!shopId || !name || !category || !stock) {
  toast.error("Fill required fields");
  return;
}

const mergedUnits = [
  ...(weight && price
    ? [{ label: weight, price }]
    : []),
  ...unitOptions,
];

const validUnits = mergedUnits.filter(
  (u: any) => u.label && u.price
);


console.log("VALID UNITS =", validUnits);

if (!validUnits.length) {
  toast.error("Add at least one unit option");
  return;
}

    try{

      const formData = new FormData();

      formData.append("shop",shopId);
      formData.append("name",name);
      formData.append("category",category);
      formData.append("subCategory", selectedSubCategory);
      const basePrice =
  validUnits.length > 0
    ? validUnits[0].price
    : price;

formData.append("price", String(basePrice));
      formData.append("stock",stock);
      formData.append("description",description);
      formData.append("discountType",discountType);
      formData.append("discountValue",discountValue);
      formData.append(
  "offers",
  JSON.stringify(
    offers.filter(
      (o) => o.title
    )
  )
);
formData.append(
  "rewardCoins",
  rewardCoins
);
formData.append(
  "deliveryFee",
  deliveryFee
);
      formData.append(
  "unitOptions",
  JSON.stringify(validUnits)
);;
formData.append(
  "productDetails",
  JSON.stringify(
    productDetails.filter(
      (x) => x.title && x.content
    )
  )
);
      images.forEach((img)=>{
        formData.append("images",img);
      });

      formData.append("expiryDate",expiryDate);
      formData.append("weight",weight);
      formData.append("size",size);
      formData.append("brand",brand);
      formData.append("deliveryTime", deliveryTime);
formData.append("returnPolicy", returnPolicy);
formData.append("codAvailable", String(codAvailable));
      formData.append("modelNumber",modelNumber);
      formData.append("author",author);
      formData.append("ageGroup",ageGroup);
      formData.append("material",material);

      await axios.post(
        "http://localhost:8000/api/v1/products",
        formData,
        {
          headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"multipart/form-data"
          }
        }
      );

      toast.success("Product Added Successfully 🚀");

    }catch(error:any){

      toast.error(
        error.response?.data?.message || "Product creation failed"
      );

    }

  };


  /* ================= BULK UPLOAD ================= */

  const handleBulkUpload = async()=>{

    if(!shopId){

      toast.error("Select shop");
      return;

    }

    if(!file){

      toast.error("Select Excel file");
      return;

    }

    try{

      const formData = new FormData();

      formData.append("file",file);
      formData.append("shopId",shopId);

      await axios.post(
        "http://localhost:8000/api/v1/products/bulk-upload",
        formData,
        {
          headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"multipart/form-data"
          }
        }
      );

      toast.success("Products uploaded successfully 🚀");

    }catch{

      toast.error("Upload failed");

    }

  };

  const sectionOptions = [
  {
    label: "✨ Features",
    icon: "✨",
  },
  {
    label: "🧪 Ingredients",
    icon: "🧪",
  },
  {
    label: "📦 Specifications",
    icon: "📦",
  },
  {
    label: "🛡 Warranty",
    icon: "🛡",
  },
  {
    label: "📖 Usage Instructions",
    icon: "📖",
  },
  {
    label: "🥗 Nutrition Facts",
    icon: "🥗",
  },
  {
    label: "💊 Medical Information",
    icon: "💊",
  },
  {
    label: "👕 Fabric & Material",
    icon: "👕",
  },
  {
    label: "📚 Book Details",
    icon: "📚",
  },
  {
    label: "⚡ Technical Details",
    icon: "⚡",
  },
];

  return(

    <div className="max-w-4xl mx-auto p-6 space-y-6">

      <h1 className="
          text-3xl
          md:text-4xl
          font-extrabold
          tracking-tight
          text-slate-900
          ">
        Add Product
      </h1>


{/* SWITCH */}

<div className="flex gap-4 mb-4">

<Button
onClick={()=>setUploadType("single")}
className={`${uploadType==="single"
? "bg-blue-600 text-white"
: "bg-gray-200"} px-6 py-2`}
>

📦 Single Product

</Button>


<Button
onClick={()=>setUploadType("bulk")}
className={`${uploadType==="bulk"
? "bg-blue-600 text-white"
: "bg-gray-200"} px-6 py-2`}
>

📊 Bulk Upload

</Button>

</div>



{/* ================= BULK UPLOAD ================= */}

{uploadType==="bulk" &&(

<div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 md:p-10 space-y-6">

<h2 className="text-lg font-semibold">

Upload Excel File

</h2>


<input
type="file"
accept=".xlsx,.csv"
onChange={(e:any)=>setFile(e.target.files[0])}
className="border p-2 rounded w-full"
/>


<Button
onClick={handleBulkUpload}
>

Upload Products

</Button>

</div>

)}



{/* ================= SINGLE PRODUCT ================= */}

{uploadType==="single" &&(

<div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 md:p-10 space-y-6">

<SelectField
  value={shopId}
  onChange={(e:any)=>setShopId(e.target.value)}
>
  <option value="">Select Shop</option>

  {shops.map((shop) => (
    <option key={shop._id} value={shop._id}>
      {shop.shopName}
    </option>
  ))}
</SelectField>



<Input
className={inputStyle}
placeholder="Product Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>


<SelectField
  value={category}
  onChange={(e:any) => {
    const selected = categories.find(
      (cat) => cat.name === e.target.value
    );

    setCategory(e.target.value);
    setSubCategories(selected?.subCategories || []);
    setSelectedSubCategory("");
  }}
>
  <option value="">Select Category</option>

  {categories.map((cat) => (
    <option key={cat._id} value={cat.name}>
      {cat.name}
    </option>
  ))}
</SelectField>

<SelectField
  value={selectedSubCategory}
  onChange={(e:any)=>setSelectedSubCategory(e.target.value)}
  disabled={!category}
>
  <option value="">Select Subcategory</option>

  {subCategories.map((sub, index) => (
    <option key={index} value={sub}>
      {sub}
    </option>
  ))}
</SelectField>


<div className="grid md:grid-cols-3 gap-4">

  {/* Return Policy */}
  <div className="md:col-span-1">
    <label className="text-sm font-medium text-slate-700 mb-2 block">
      Return Policy
    </label>

    <Input
      className={inputStyle}
      placeholder="7 Days Return / No Return"
      value={returnPolicy}
      onChange={(e) => setReturnPolicy(e.target.value)}
    />
  </div>

  {/* COD */}
  <div>
    <label className="text-sm font-medium text-slate-700 mb-2 block">
      Cash On Delivery
    </label>

   <SelectField
  value={codAvailable ? "yes" : "no"}
  onChange={(e:any)=>setCodAvailable(e.target.value === "yes")}
>
  <option value="yes">✅ Available</option>
  <option value="no">❌ Not Available</option>
</SelectField>
  </div>

  {/* Stock */}
  <div>
    <label className="text-sm font-medium text-slate-700 mb-2 block">
      Stock Quantity
    </label>

    <Input
    className={inputStyle}
      type="number"
      placeholder="100"
      value={stock}
      onChange={(e) => setStock(e.target.value)}
    />
  </div>

</div>


<Textarea
  className={textareaStyle}
  placeholder="Description"
  value={description}
  onChange={(e)=>setDescription(e.target.value)}
/>
<div className="space-y-3">
  <p className="font-medium text-lg">
    Product Information Sections
  </p>

  <p className="text-sm text-gray-500">
    Example: Features, Ingredients, Warranty, Usage, Specifications
  </p>

  {productDetails.map((item, index) => (
    <div
  key={index}
  className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm"
>

      <SearchableSelect
  value={item.title}
  placeholder="📂 Select Section"
  options={sectionOptions}
  onChange={(selected: string) => {

    const updated = [...productDetails];

    updated[index].title = selected;

    setProductDetails(updated);

  }}
/>


      <Textarea
       className={textareaStyle}
        placeholder="Enter details..."
        value={item.content}
        onChange={(e) => {
          const updated = [...productDetails];
          updated[index].content = e.target.value;
          setProductDetails(updated);
        }}
      />
    </div>
  ))}

  <Button
    type="button"
    className="rounded-2xl h-11 px-5 border-slate-200 shadow-sm hover:bg-slate-50"
    onClick={() =>
      setProductDetails([
        ...productDetails,
        { title: "", content: "" }
      ])
    }
  >
    + Add Section
  </Button>
</div>
<Input
  className={inputStyle}
  type="number"
  placeholder="Delivery Fee"
  value={deliveryFee}
  onChange={(e) =>
    setDeliveryFee(e.target.value)
  }
/>

<div className="grid grid-cols-2 gap-3">
  <Input
    className={inputStyle}
    placeholder="Base Unit (500g / 1L / 1 piece)"
    value={weight}
    onChange={(e) => setWeight(e.target.value)}
  />

  <Input
    className={inputStyle}
    type="number"
    placeholder="Base Price"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
  />
</div>


<div className="space-y-3">
  <p className="font-medium">
  Product Variants
</p>

<p className="text-sm text-gray-500">
  Example: 500g, 1L, Small, Medium, XL, 64GB, Black, Paperback
</p>

  {unitOptions.map((unit, index) => (
    <div key={index} className="grid grid-cols-2 gap-3">
      <Input
      className={inputStyle}
        placeholder="Variant (500g / 1L / M / 64GB / Black)"
        value={unit.label}
        onChange={(e) => {
          const updated = [...unitOptions];
          updated[index].label = e.target.value;
          setUnitOptions(updated);
        }}
      />

      <Input
        className={inputStyle}
        type="number"
        placeholder="Price"
        value={unit.price}
        onChange={(e) => {
          const updated = [...unitOptions];
          updated[index].price = e.target.value;
          setUnitOptions(updated);
        }}
      />
    </div>
  ))}

  <Button
    type="button"
    className="rounded-2xl h-11 px-5 border-slate-200 shadow-sm hover:bg-slate-50"
    onClick={() =>
      setUnitOptions([
        ...unitOptions,
        { label: "", price: "" },
      ])
    }
  >
    + Add Unit
  </Button>
</div>

<div className="space-y-2">

  <div className="grid md:grid-cols-2 gap-4">

    <SelectField
      value={discountType}
      onChange={(e:any)=>setDiscountType(e.target.value)}
    >
      <option value="">Discount Type</option>
      <option value="percentage">
        Percentage
      </option>

      <option value="flat">
        Flat
      </option>
    </SelectField>

    <Input
      className={inputStyle}
      type="number"
      placeholder="Discount Value"
      value={discountValue}
      onChange={(e)=>setDiscountValue(e.target.value)}
    />

  </div>

  {/* NOTE */}
  <p className="
  text-sm
  text-slate-500
  px-1
  ">

    ℹ️ If there is no discount,
    select <span className="font-medium">0</span>
    or leave discount type empty.

  </p>

</div>

<div className="space-y-4">

  <h3 className="font-semibold text-lg">
    Product Offers
  </h3>

  {offers.map((offer, index) => (

    <div
      key={index}
      className="
      grid
      md:grid-cols-2
      gap-3
      "
    >

      <Input
        className={inputStyle}
        placeholder="Buy 2 Kg+ & get 5% OFF"
        value={offer.title}
        onChange={(e) => {

          const updated = [...offers];

          updated[index].title =
            e.target.value;

          setOffers(updated);

        }}
      />

      <SelectField
        value={offer.type}
        onChange={(e:any) => {

          const updated = [...offers];

          updated[index].type =
            e.target.value;

          setOffers(updated);

        }}
      >
        <option value="product">
          Product Offer
        </option>

        <option value="category">
          Category Offer
        </option>

        <option value="global">
          Vyoma Offer
        </option>
      </SelectField>

    </div>

  ))}

  <Button
    type="button"
    onClick={() =>
      setOffers([
        ...offers,
        {
          title: "",
          type: "product",
        },
      ])
    }
  >
    + Add Offer
  </Button>

</div>

<div>
  <Input
  className={inputStyle}
  type="number"
  placeholder="Reward Coins"
  value={rewardCoins}
  onChange={(e) =>
    setRewardCoins(e.target.value)
  }
/>

<p className="text-sm font-medium text-gray-600">

Upload Product Images (Max 4)

</p>

<label className="block cursor-pointer">
  <div className="h-28 rounded-3xl border-2 border-dashed border-slate-300 bg-gradient-to-b from-white to-slate-50 shadow-sm hover:border-blue-400 hover:bg-blue-50/30 transition flex flex-col items-center justify-center text-center px-4">
    <span className="text-3xl mb-2">📷</span>
    <p className="font-medium text-slate-700">
      Upload Product Images
    </p>
    <p className="text-sm text-slate-500">
      PNG / JPG / WEBP • Max 4 images
    </p>
  </div>

  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleImages}
    className="hidden"
  />
</label>
<div className="flex gap-3 mt-3 flex-wrap">
  {images.map((img, index) => (
    <div key={index} className="relative">

      {/* IMAGE */}
      <img
        src={URL.createObjectURL(img)}
        className="w-20 h-20 object-cover rounded-md border"
      />

      {/* ❌ REMOVE BUTTON */}
      <button
        onClick={() => {
          const updated = images.filter((_, i) => i !== index);
          setImages(updated);
        }}
        className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shadow"
      >
        ✕
      </button>

    </div>
  ))}
</div>
</div>


<div className="flex justify-end pt-4">

<Button
onClick={handleSubmit}
className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-md"
>

Add Product

</Button>

</div>

</div>

)}

</div>

);

};

export default AddProduct;
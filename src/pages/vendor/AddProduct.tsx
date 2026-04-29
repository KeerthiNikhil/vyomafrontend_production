import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  const [units,setUnits] = useState("");

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

    if(!shopId || !name || !category || !price || !stock){

      toast.error("Fill required fields");
      return;

    }

    try{

      const formData = new FormData();

      formData.append("shop",shopId);
      formData.append("name",name);
      formData.append("category",category);
      formData.append("subCategory", selectedSubCategory);
      formData.append("price",price);
      formData.append("stock",stock);
      formData.append("description",description);
      formData.append("discountType",discountType);
      formData.append("discountValue",discountValue);
      formData.append("units",units);

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


  return(

    <div className="max-w-4xl mx-auto p-6 space-y-6">

      <h1 className="text-3xl font-bold text-gray-800">
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

<div className="bg-white shadow-md rounded-xl p-8 space-y-5 border">

<h2 className="text-lg font-semibold">

Upload Excel File

</h2>


<select
value={shopId}
onChange={(e)=>setShopId(e.target.value)}
className="w-full border rounded-md px-3 py-2"
>

<option value="">Select Shop</option>

{shops.map((shop)=>(
<option key={shop._id} value={shop._id}>
{shop.shopName}
</option>
))}

</select>


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

<div className="bg-white shadow-md rounded-xl p-8 space-y-5 border">

<select
value={shopId}
onChange={(e)=>setShopId(e.target.value)}
className="w-full border rounded-md px-3 py-2"
>

<option value="">Select Shop</option>

{shops.map((shop)=>(
<option key={shop._id} value={shop._id}>
{shop.shopName}
</option>
))}

</select>


<Input
placeholder="Product Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>


<select
  value={category}
  onChange={(e) => {
    const selected = categories.find(
      (cat) => cat.name === e.target.value
    );

    setCategory(e.target.value);
    setSubCategories(selected?.subCategories || []);
    setSelectedSubCategory("");
  }}
  className="w-full border rounded-md px-3 py-2"
>
  <option value="">Select Category</option>

  {categories.map((cat) => (
    <option key={cat._id} value={cat.name}>
      {cat.name}
    </option>
  ))}
</select>

<select
  value={selectedSubCategory}
  onChange={(e) => setSelectedSubCategory(e.target.value)}
  className="w-full border rounded-md px-3 py-2"
  disabled={!category}
>
  <option value="">Select Subcategory</option>

  {subCategories.map((sub, index) => (
    <option key={index} value={sub}>
      {sub}
    </option>
  ))}
</select>


<div className="grid md:grid-cols-2 gap-4">
  <div className="grid md:grid-cols-3 gap-4">

  <Input
    placeholder="Delivery Time (30 mins / 2 days)"
    value={deliveryTime}
    onChange={(e) => setDeliveryTime(e.target.value)}
  />

  <Input
    placeholder="Return Policy (No Return / 7 Days Return)"
    value={returnPolicy}
    onChange={(e) => setReturnPolicy(e.target.value)}
  />

  <select
    value={codAvailable ? "yes" : "no"}
    onChange={(e) => setCodAvailable(e.target.value === "yes")}
    className="border rounded-md px-3 py-2"
  >
    <option value="yes">COD Available</option>
    <option value="no">No COD</option>
  </select>

</div>

<Input
type="number"
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>

<Input
type="number"
placeholder="Stock"
value={stock}
onChange={(e)=>setStock(e.target.value)}
/>

</div>


<Textarea
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>


<Input
placeholder="Units (example: 500g,1kg or S,M,L)"
value={units}
onChange={(e)=>setUnits(e.target.value)}
/>


<div className="grid md:grid-cols-2 gap-4">

<select
value={discountType}
onChange={(e)=>setDiscountType(e.target.value)}
className="border rounded-md px-3 py-2"
>

<option value="">Discount Type</option>
<option value="percentage">Percentage</option>
<option value="flat">Flat</option>

</select>

<Input
type="number"
placeholder="Discount Value"
value={discountValue}
onChange={(e)=>setDiscountValue(e.target.value)}
/>

</div>


<div>

<p className="text-sm font-medium text-gray-600">

Upload Product Images (Max 4)

</p>

<input
type="file"
multiple
accept="image/*"
onChange={handleImages}
className="w-full border rounded-md px-3 py-2"
/>
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
className="bg-blue-700 text-white px-6 py-2"
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
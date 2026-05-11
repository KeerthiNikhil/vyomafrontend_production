import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import axios from "@/lib/axios";

const inputStyle =
  "h-12 rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500";

const textareaStyle =
  "min-h-[120px] rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500";
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
          w-full h-12 px-5 pr-14
          rounded-2xl
          border border-slate-200
          bg-gradient-to-b from-white to-slate-50
          shadow-sm
          appearance-none
          outline-none
          cursor-pointer
          text-slate-800
          font-medium
          transition-all duration-200
          hover:border-blue-300
          hover:shadow-md
          focus:border-blue-500
          focus:ring-4 focus:ring-blue-100
          disabled:bg-slate-100
          disabled:text-slate-400
          disabled:cursor-not-allowed
        "
      >
        {children}
      </select>

      <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
        ▼
      </span>
    </div>
  );
};

const ShopCreate = () => {
  const [step, setStep] = useState(1);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [gstNumber, setGstNumber] = useState("");
  const [udyamNumber, setUdyamNumber] = useState("");
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState("");
  const [fssaiNumber, setFssaiNumber] = useState("");

  const [shopImages, setShopImages] = useState<File[]>([]);
  useEffect(() => {
    if (businessType !== "Food & Beverages") {
      setFssaiNumber("");
    }
  }, [businessType]);

  const addMoreImages = async () => {
  if (!shopImages.length) {
    toast.error("Select images first");
    return;
  }

  try {
    const formData = new FormData();

    shopImages.forEach((img) => {
      formData.append("shopImages", img);
    });

    await axios.post(
      `/shops/69a911b0fe07f41eac77ab02/add-images`, // ✅ your shop id
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Images added successfully 🎉");
  } catch (err) {
    toast.error("Upload failed ❌");
  }
};
  const handleFetchLocation = () => {
  if (!navigator.geolocation) {
    toast.error("Geolocation not supported");
    return;
  }

  setIsFetching(true);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setLatitude(lat.toString());
      setLongitude(lng.toString());

      // 🔥 OPTIONAL: Auto-fill address using reverse geocoding
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        {
          headers: {
            "User-Agent": "vyoma-app",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.display_name) {
            setAddress(data.display_name); // ✅ auto address (readonly)
          }
        });

      toast.success("Live location detected ✅");
      setIsFetching(false);
    },
    (error) => {
      toast.error("Please allow location access ❌");
      setIsFetching(false);
    },
    {
      enableHighAccuracy: true, // 🔥 important
      timeout: 10000,
    }
  );
};

  const handleSubmit = async () => {
   if (shopImages.length === 0) {
  toast.error("Please upload at least one image");
  return;
}

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("shopName", shopName);
      formData.append("ownerName", ownerName);
      formData.append("businessType", businessType);
      formData.append("description", description);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("gstNumber", gstNumber);
      formData.append("udyamNumber", udyamNumber);
      formData.append("fssaiNumber", fssaiNumber);
      formData.append("tradeLicenseNumber", tradeLicenseNumber);
      shopImages.forEach((img) => {
  formData.append("shopImages", img);
});

      await axios.post(
  "/shops/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Shop created successfully 🎉");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

 

  const renderBlueInfo = () => {
    if (step === 1)
      return (
        <>
          <h1 className="text-3xl font-bold mb-4">Build Your Shop 🚀</h1>
          <p className="text-blue-100">
            Enter your business details to start selling products.
          </p>
        </>
      );

    if (step === 2)
      return (
        <>
          <h1 className="text-3xl font-bold mb-4">Set Your Location 📍</h1>
          <p className="text-blue-100">
            Help customers find your shop easily.
          </p>
        </>
      );

    return (
      <>
        <h1 className="text-3xl font-bold mb-4">Verification Details 📄</h1>
        <p className="text-blue-100">
          Add legal information to complete shop setup.
        </p>
      </>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">

      {/* LEFT INFO PANEL */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-start justify-center pt-16 overflow-y-auto pt-32 p-10">
        <div className="max-w-md">{renderBlueInfo()}</div>
      </div>

      {/* FORM */}
      <div className="w-full lg:w-1/2 flex items-start justify-center pt-16 overflow-y-auto pt-32 p-6 bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8  flex flex-col justify-between">

          <div className="space-y-5">

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <Input
                  className={inputStyle}
                  placeholder="Shop Name"
                  value={shopName}
                  onChange={(e)=>setShopName(e.target.value)}
                />

                <Input
                className={inputStyle}
                  placeholder="Owner Name"
                  value={ownerName}
                  onChange={(e)=>setOwnerName(e.target.value)}
                />

                <SelectField
  value={businessType}
  onChange={(e:any)=>setBusinessType(e.target.value)}
>
  <option value="">Select Business Type</option>
  <option>Food & Beverages</option>
  <option>Clothing</option>
  <option>Electronics</option>
  <option>Pharmacy</option>
  <option>Beauty & Personal Care</option>
  <option>Grocery</option>
  <option>Home Appliances</option>
  <option>Sports & Fitness</option>
  <option>Books</option>
  <option>Toys</option>
</SelectField>

                <Textarea
                 className={textareaStyle}
                  placeholder="Business Description"
                  value={description}
                  onChange={(e)=>setDescription(e.target.value)}
                />

                <Input
                  className={inputStyle}
                  type="email"
                  placeholder="Business Email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                />

                <Input
                  className={inputStyle}
                  placeholder="Shop Contact Number"
                  value={phone}
                  onChange={(e)=>setPhone(e.target.value)}
                />
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <Textarea
                  className={textareaStyle}
                  placeholder="Shop Address"
                  value={address}
                  onChange={(e)=>setAddress(e.target.value)}
                />

                <button
                  onClick={handleFetchLocation}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md flex items-center gap-2"
                >
                  <MapPin size={16}/> Detect Location
                </button>

                <Input className={inputStyle} value={latitude} readOnly placeholder="Latitude"/>
                <Input className={inputStyle} value={longitude} readOnly placeholder="Longitude"/>

    <div className="space-y-3">

  <label className="block cursor-pointer">
    
    <div
      className="
        h-28 rounded-3xl
        border-2 border-dashed border-slate-300
        bg-gradient-to-b from-white to-slate-50
        shadow-sm
        hover:border-blue-400
        hover:bg-blue-50/30
        transition
        flex flex-col items-center justify-center
      "
    >
      <span className="text-3xl mb-2">🏪</span>

      <p className="font-medium text-slate-700">
        Upload Shop Images
      </p>

      <p className="text-sm text-slate-500">
        PNG / JPG / WEBP • Max 3 images
      </p>
    </div>

    <input
      type="file"
      multiple
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);

        setShopImages((prev) => {
          const combined = [...prev, ...newFiles];

          if (combined.length > 3) {
            toast.error("Max 3 images allowed");
            return prev;
          }

          return combined;
        });
      }}
    />

  </label>



  {/* IMAGE PREVIEW */}
  <div className="flex gap-3 flex-wrap">

    {shopImages.map((file, index) => (
      <div key={index} className="relative">

        <img
          src={URL.createObjectURL(file)}
          className="
            h-20 w-20
            object-cover
            rounded-2xl
            border border-slate-200
            shadow-sm
          "
        />

        <button
          type="button"
          onClick={() =>
            setShopImages((prev) =>
              prev.filter((_, i) => i !== index)
            )
          }
          className="
            absolute -top-2 -right-2
            bg-red-500 text-white
            w-5 h-5 rounded-full
            text-xs shadow
          "
        >
          ✕
        </button>

      </div>
    ))}

  </div>

  <button
    type="button"
    onClick={addMoreImages}
    className="
      w-full h-12
      rounded-2xl
      bg-blue-600
      hover:bg-blue-700
      text-white
      font-medium
      shadow-md
      transition
    "
  >
    Upload Images
  </button>

  <p className="text-xs text-slate-500">
    Upload up to 3 images for shop banner carousel
  </p>

</div>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <Input
                  className={inputStyle}
                  placeholder="GST Number (Optional)"
                  value={gstNumber}
                  onChange={(e)=>setGstNumber(e.target.value)}
                />

                <Input
                  className={inputStyle}
                  placeholder="Udyam Number"
                  value={udyamNumber}
                  onChange={(e)=>setUdyamNumber(e.target.value)}
                />

                <Input
  className={`${inputStyle} ${
    businessType !== "Food & Beverages"
      ? "bg-slate-100 cursor-not-allowed"
      : ""
  }`}
  placeholder="FSSAI Number"
  value={fssaiNumber}
  onChange={(e)=>setFssaiNumber(e.target.value)}
  disabled={businessType !== "Food & Beverages"}
/>

                <Input
                  className={inputStyle}
                  placeholder="Trade License Number"
                  value={tradeLicenseNumber}
                  onChange={(e)=>setTradeLicenseNumber(e.target.value)}
                />
              </>
            )}

          </div>

          {/* BUTTONS */}
<div className="flex justify-between gap-4 mt-8">

  {step > 1 ? (
    <button
      type="button"
      onClick={() => setStep(step - 1)}
      className="
        flex-1 h-12
        rounded-2xl
        border border-slate-200
        bg-white
        text-slate-700
        font-medium
        shadow-sm
        hover:bg-slate-50
        hover:border-slate-300
        transition
      "
    >
      ← Back
    </button>
  ) : (
    <div className="flex-1" />
  )}

  {step < 3 ? (
    <button
      type="button"
      onClick={() => setStep(step + 1)}
      className="
        flex-1 h-12
        rounded-2xl
        bg-blue-600
        hover:bg-blue-700
        text-white
        font-medium
        shadow-md
        transition
      "
    >
      Next →
    </button>
  ) : (
    <button
      type="button"
      onClick={handleSubmit}
      disabled={isSubmitting}
      className="
        flex-1 h-12
        rounded-2xl
        bg-blue-600
        hover:bg-blue-700
        text-white
        font-medium
        shadow-md
        transition
        disabled:opacity-50
      "
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  )}

</div>

        </div>
      </div>
    </div>
  );
};

export default ShopCreate;
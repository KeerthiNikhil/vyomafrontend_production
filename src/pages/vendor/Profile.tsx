import { useState,useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/lib/axios";

const inputStyle =
  "h-12 rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500";

const cardStyle =
  "rounded-3xl border border-slate-200 shadow-sm bg-white";

const buttonStyle =
  "h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-md text-white";

const selectStyle =
  "w-full h-12 px-5 rounded-2xl border border-slate-200 bg-white shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [shops, setShops] = useState([]);
  const [image, setImage] = useState(null);
const [preview, setPreview] = useState("");

  const [profile, setProfile] = useState({
  name: "",
  email: "",
  phone: "",
  shopName: "",
  address: "",
  shopId: "",
  avatar: "",
});

const handleImageChange = (e: any) => {
  const file = e.target.files[0];
  if (!file) return;

  setImage(file);
  setPreview(URL.createObjectURL(file));
};

  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
  try {
    // 1. Update USER
    await axios.put("/vendor/profile", {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    });

    // 2. Update SHOP
    if (profile.shopId) {
      await axios.put(`/shops/${profile.shopId}`, {
        name: profile.shopName,
        address: profile.address,
      });
    }

    alert("Profile updated ✅");

  } catch (err) {
    console.log(err);
    alert("Update failed ❌");
  }
};

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get("/vendor/profile");
      const data = res.data.data;

      const firstShop = data.shops?.[0];

setProfile({
  name: data.user.name || "",
  email: data.user.email || "",
  phone: data.user.phone || "",
  shopId: firstShop?._id || "",
  shopName: firstShop?.name || "",
  address: firstShop?.address || "",
  avatar: data.user.avatar || "",
});

setShops(data.shops);
    } catch (err) {
      console.log("FETCH ERROR 👉", err);
    }
  };

  fetchProfile(); // ✅ MUST CALL

}, []);
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Profile Settings
        </h1>
        <p className="text-gray-500">
          Manage your shop account information
        </p>
      </div>

     {/* PROFILE OVERVIEW */}
<Card
  className={cardStyle}>
  <CardContent className="p-8 flex items-center justify-between">


    {/* LEFT SIDE */}
    <div className="flex items-center gap-5">

      {/* Avatar */}
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full flex items-center justify-center text-2xl font-semibold shadow-md">
         {preview || profile.avatar ? (
  <img
    src={preview || profile.avatar}
    className="w-16 h-16 rounded-full object-cover"
  />
) : (
  profile?.name?.charAt(0)?.toUpperCase() || "V"
)}
        </div>

        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
      </div>

      {editMode && (
  <input
  className={inputStyle} type="file" onChange={handleImageChange} />
)}

      {/* Store Info */}
      <div className="space-y-1">
      <h2 className="text-xl font-semibold">
  {profile.name || "No Name"}
</h2>

<p className="text-sm text-gray-500">
  {profile.email || "No Email"}
</p>

<p className="text-sm text-blue-600 font-medium">
  🏪 {profile.shopName || "No Shop Selected"}
</p>

        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
          Active Account
        </span>
      </div>

    </div>

    {/* RIGHT SIDE BUTTON */}
    <div>
      <Button
        variant="outline"
        size="sm"
        className={buttonStyle}

        onClick={() => setEditMode(!editMode)}
      >
        {editMode ? "Cancel" : "Edit Profile"}
      </Button>
    </div>
</CardContent>
</Card>
      {/* ACCOUNT DETAILS */}
      <Card
        className={cardStyle}>
        <CardContent className="p-8 space-y-6">

          <h2 className="text-lg font-semibold">
            Account Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
  Shop Name
</label>
<Input
className={inputStyle}
  value={profile.shopName || ""}
  disabled={!editMode}
  onChange={(e) => handleChange("shopName", e.target.value)}
/>
<select
  className={selectStyle}
  value={profile.shopId}
  onChange={(e) => {
    const selected = shops.find(
      (s: any) => s._id === e.target.value
    );

    if (!selected) return;

    setProfile({
      ...profile,
      shopId: selected._id,
      shopName: selected.name,
      address: selected.address,
    });
  }}
>
  {shops.map((shop: any) => (
    <option key={shop._id} value={shop._id}>
      {shop.name}
    </option>
  ))}
</select>
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Email
              </label>
              <Input
              className={inputStyle}
                value={profile.email || ""}
                disabled={!editMode}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Phone
              </label>
              <Input
              className={inputStyle}
                value={profile.phone || ""}
                disabled={!editMode}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Address
              </label>
              <Input
              className={inputStyle}
                value={profile.address || ""}
                disabled={!editMode}
                onChange={(e) =>
                  handleChange("address", e.target.value)
                }
              />
            </div>

          </div>

          {editMode && (
            <div className="flex justify-end">
              <Button
  className={buttonStyle}

  onClick={handleSave}
>
  Save Changes
</Button>
            </div>
          )}

        </CardContent>
      </Card>

      {/* STORE STATS */}
      <div className="grid md:grid-cols-3 gap-6">

        <Card
          className={cardStyle}>
          <CardContent className="p-8">
            <p className="text-gray-500 text-sm">
              Total Products
            </p>
            <h2 className="text-2xl font-bold">
              48
            </h2>
          </CardContent>
        </Card>

        <Card
          className={cardStyle}>
          <CardContent className="p-8">
            <p className="text-gray-500 text-sm">
              Total Orders
            </p>
            <h2 className="text-2xl font-bold">
              326
            </h2>
          </CardContent>
        </Card>

        <Card
          className={cardStyle}>
          <CardContent className="p-8">
            <p className="text-gray-500 text-sm">
              Total Revenue
            </p>
            <h2 className="text-2xl font-bold text-green-600">
              ₹85,240
            </h2>
          </CardContent>
        </Card>

      </div>


    </div>
  );
};

export default Profile;
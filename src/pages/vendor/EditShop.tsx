import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "@/lib/axios";
import { toast } from "sonner";

const EditShop = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {

    const fetchShop = async () => {

      try {

        const res = await axios.get(`/shops/${id}`);

        const shop = res.data.data;

        setShopName(shop.shopName || "");
        setOwnerName(shop.ownerName || "");
        setBusinessType(shop.businessType || "");
        setPhone(shop.phone || "");
        setEmail(shop.email || "");
        setAddress(shop.address || "");
        setDescription(shop.description || "");

      } catch (error) {

        toast.error("Failed to load shop");

      } finally {

        setLoading(false);

      }
    };

    fetchShop();

  }, [id]);

  const handleUpdate = async () => {

    try {

      await axios.put(
        `/shops/${id}`,
        {
          shopName,
          ownerName,
          businessType,
          phone,
          email,
          address,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Shop updated successfully");

      navigate("/vendor/shops");

    } catch (error: any) {

      toast.error(
        error.response?.data?.message ||
        "Update failed"
      );

    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (

    <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm space-y-5">

      <h1 className="text-3xl font-bold">
        Edit Shop
      </h1>

      <input
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
        placeholder="Shop Name"
        className="w-full h-12 px-4 rounded-2xl border"
      />

      <input
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        placeholder="Owner Name"
        className="w-full h-12 px-4 rounded-2xl border"
      />

      <input
        value={businessType}
        onChange={(e) => setBusinessType(e.target.value)}
        placeholder="Business Type"
        className="w-full h-12 px-4 rounded-2xl border"
      />

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
        className="w-full h-12 px-4 rounded-2xl border"
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full h-12 px-4 rounded-2xl border"
      />

      <textarea
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
        className="w-full p-4 rounded-2xl border min-h-[100px]"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-4 rounded-2xl border min-h-[120px]"
      />

      <button
        onClick={handleUpdate}
        className="
        w-full
        h-12
        rounded-2xl
        bg-blue-600
        hover:bg-blue-700
        text-white
        font-medium
        "
      >
        Update Shop
      </button>

    </div>
  );
};

export default EditShop;
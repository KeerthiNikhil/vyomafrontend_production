import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";

const MyShops = () => {

  const [shops, setShops] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchShops = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const res = await axios.get(
          "/shops/my-shops",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setShops(res.data.data);

      } catch (error) {

        console.log(error);

      }
    };

    fetchShops();

  }, []);

  return (

    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        My Shops
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

      {shops.map((shop: any) => (

  <div
    key={shop._id}
    className="
    bg-white
    rounded-3xl
    overflow-hidden
    border
    border-slate-200
    shadow-sm
    hover:shadow-xl
    transition-all
    duration-300
    "
  >

    {/* IMAGE */}
    <div className="relative">

      <img
  src={
    shop.shopImages?.[0] ||
    "https://placehold.co/600x400?text=No+Shop+Image"
  }
  alt={shop.shopName}
  className="
  h-56
  w-full
  object-cover
  bg-slate-100
  "
/>

      {/* STATUS BADGE */}
     <div
  className={`
  absolute top-4 right-4
  px-3 py-1 rounded-full
  text-white text-xs font-semibold

  ${
    shop.isOpen
      ? "bg-green-500"
      : "bg-red-500"
  }
  `}
>
  {shop.isOpen ? "Open" : "Closed"}
</div>
</div>
    {/* CONTENT */}
    <div className="p-5 space-y-4">

      {/* SHOP NAME */}
      <div>

        <h2 className="
        text-2xl
        font-bold
        text-slate-900
        ">
          {shop.shopName}
        </h2>

        <p className="
        text-slate-500
        text-sm
        mt-2
        line-clamp-2
        ">
          {shop.address}
        </p>

      </div>

      {/* INFO */}
      <div className="
      flex
      flex-wrap
      gap-2
      ">

        <span className="
        px-3
        py-1
        rounded-full
        bg-blue-50
        text-blue-700
        text-xs
        font-medium
        ">
          Vendor Shop
        </span>

        <span className="
        px-3
        py-1
        rounded-full
        bg-slate-100
        text-slate-600
        text-xs
        ">
          Created Recently
        </span>

      </div>

      {/* BUTTONS */}
      <div className="
      flex
      gap-3
      pt-2
      ">

        <button
  onClick={() =>
    navigate(`/vendor/shops/edit/${shop._id}`)
  }
  className="
  flex-1
  h-11
  rounded-2xl
  bg-blue-600
  hover:bg-blue-700
  text-white
  font-medium
  transition
  "
>
  Edit Shop
</button>
<button
  onClick={async () => {

    try {

      await axios.put(
        `/shops/${shop._id}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setShops((prev: any) =>
        prev.map((s: any) =>
          s._id === shop._id
            ? {
                ...s,
                isOpen: !s.isOpen,
              }
            : s
        )
      );

    } catch (error) {

      console.log(error);

    }

  }}
  className="
  flex-1
  h-11
  rounded-2xl
  bg-black
  text-white
  "
>
  {shop.isOpen ? "Close Shop" : "Open Shop"}
</button>
        

      </div>

    </div>

  </div>

))}
      </div>

    </div>
  );
};

export default MyShops;
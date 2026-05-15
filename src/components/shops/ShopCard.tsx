import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

interface Shop {
  _id: string;
  shopName: string;
  ownerName?: string;
  businessType: string;
  address: string;
  phone: string;
  shopImages?: string[];
}

interface ShopCardProps {
  shop: Shop;
  isLive?: boolean;
}

const ShopCard = ({ shop, isLive = false }: ShopCardProps) => {
  const navigate = useNavigate();

  const openShop = () => {
    navigate(`/shop/${shop._id}`);
  };

  return (
    <div
      onClick={openShop}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={
  shop.shopImages?.[0]
    ? shop.shopImages[0].startsWith("http")
      ? shop.shopImages[0]
      : `http://localhost:8000${shop.shopImages[0]}`
    : "/placeholder.png"
}
          alt={shop.shopName}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
          }}
          className="w-full h-44 object-cover rounded-t-xl bg-gray-100"
        />

        {/* CATEGORY */}
        <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-medium shadow">
          {shop.businessType}
        </div>

        {/* LIVE badge */}
        {isLive && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
            LIVE
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-sm sm:text-base font-semibold mb-1">
          {shop.shopName}
        </h3>

        <div className="flex items-center text-gray-500 text-xs sm:text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          {shop.address}
        </div>

        <div className="flex items-center justify-between">
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
            ⭐ 4.5
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openShop();
            }}
            className="bg-black text-white text-xs px-4 py-1.5 rounded-md hover:bg-gray-800 transition"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ShopCard);
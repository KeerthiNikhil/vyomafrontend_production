import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

type NearbyShopCardProps = {
  shopId: string;
  name: string;
  location: string;
  rating: number;
  image: string;
};

const NearbyShopCard = ({
  shopId,
  name,
  location,
  rating,
  image,
}: NearbyShopCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">

      {/* ⭐ IMAGE */}
      <div className="h-24 sm:h-36 w-full overflow-hidden">
       <img
  src={
  image
    ? image.startsWith("http")
      ? image
      : `http://localhost:8000${image}`
    : "/placeholder.png"
}
  alt={name}
  onError={(e) => {
    e.currentTarget.src = "/placeholder.png";
  }}
  className="w-full h-full object-cover bg-gray-100"
/>

      {/* ⭐ CONTENT */}
      <div className="p-2 sm:p-4">

        <h3 className="text-xs sm:text-sm font-semibold leading-tight">
          {name}
        </h3>

        <div className="flex items-center text-[10px] sm:text-xs text-gray-500 mt-1">
          <MapPin className="w-3 h-3 mr-1" />
          {location}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium">
            <Star className="w-3 h-3 fill-green-600" />
            {rating}
          </div>

          <button
            onClick={() => navigate(`/shop/${shopId}`)}
            className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearbyShopCard;

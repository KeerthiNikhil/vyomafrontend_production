import React from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";

interface Props {
  id: string;
  name: string;
  price: number;
  image: string;
  shop?: string;
  weight?: string;
  originalPrice?: number;
}

const ProductCard: React.FC<Props> = ({
  id,
  name,
  price,
  image,
  shop,
  weight,
  originalPrice,
}) => {

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

const inWishlist = isInWishlist(id);

  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 w-full flex flex-col h-full">

      {/* Product Image */}
     <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">

  {/* ❤️ Wishlist Button */}
  <button
    onClick={() =>
      inWishlist
        ? removeFromWishlist(id)
        : addToWishlist({
  _id: id,
  name,
  price,
  image
})
    }
    className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow"
  >
    <Heart
      className={`w-4 h-4 ${
        inWishlist ? "text-red-500 fill-red-500" : "text-gray-500"
      }`}
    />
  </button>

  <img
    src={image}
    alt={name}
    className="w-full h-full object-cover"
  />
</div>

      {/* Product Name */}
      <h3 className="mt-3 font-semibold">{name}</h3>

      {/* Weight */}
      {weight && (
        <p className="text-sm text-gray-500">{weight}</p>
      )}

      {/* Price */}
      <div className="mt-2">

        {originalPrice && (
          <p className="text-sm text-gray-400 line-through">
            ₹ {originalPrice}
          </p>
        )}

        <p className="text-blue-600 font-bold text-lg">
          ₹ {price}
        </p>

        {originalPrice && (
          <p className="text-green-600 text-sm font-medium">
            {Math.round(
              ((originalPrice - price) / originalPrice) * 100
            )}% OFF
          </p>
        )}

      </div>

      {/* Add to Cart Button */}
      {/* PUSH BUTTONS TO BOTTOM */}
<div className="mt-auto pt-3 flex gap-2">

  {/* VIEW */}
  <button
    onClick={() => window.location.href = `/product/${id}`}
    className="flex-1 border text-sm py-2 rounded-md hover:bg-gray-100"
  >
    View
  </button>

  {/* ADD TO CART */}
  <button
    onClick={() =>
      addToCart({
        id,
        name,
        price,
        image,
        shop,
        quantity: 1,
      })
    }
    className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700"
  >
    Add
  </button>

</div>

    </div>
  );
};

export default ProductCard;
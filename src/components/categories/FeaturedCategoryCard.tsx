import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  subtitle: string;
  image: string;
  slug: string; // ✅ added
};

const FeaturedCategoryCard = ({ title, subtitle, image, slug }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative h-[180px] rounded-2xl overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/category/${slug}`)} // ✅ navigation
    >
      {/* IMAGE */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* CONTENT */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs opacity-90">{subtitle}</p>

        <button 
        type="button"
        className="mt-2 text-[11px] px-3 py-1 rounded-full bg-white text-black font-medium">
          SHOP NOW
        </button>
      </div>
    </div>
  );
};

export default FeaturedCategoryCard;

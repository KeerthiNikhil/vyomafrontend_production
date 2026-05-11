import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, ShoppingCart, Search, Heart, LogOut } from "lucide-react";
import { Wallet } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

import logo from "@/assets/images/logo.jpg.png";

const Navbar = () => {

  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(0);
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const [searchQuery, setSearchQuery] = useState("");

  const [user, setUser] = useState<{
    name: string;
    role: string;
  } | null>(null);

  /* Cart Count */

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /* Wishlist Count */

  const wishlistCount = wishlist.length;

  /* Get User */

 useEffect(() => {

  const token = localStorage.getItem("token");

  if (token) {

    setUser({
      name: localStorage.getItem("name") || "",
      role: localStorage.getItem("role") || "",
    });

    // ✅ Dynamic wallet balance
    const savedWallet =
      localStorage.getItem("walletBalance");

    setWalletBalance(Number(savedWallet) || 0);

  }

}, [window.location.pathname]);

  /* Logout */

  const handleLogout = () => {

    localStorage.clear();
    setUser(null);
    navigate("/");

  };

  /* Search */

  const handleSearch = (e: React.FormEvent) => {

    e.preventDefault();

    if (!searchQuery.trim()) return;

    navigate(`/search?q=${searchQuery}`);

    setSearchQuery("");

  };

 const goToVendorApp = () => {
  navigate("/vendor/dashboard");
};

  return (

<header className="sticky top-0 z-50 bg-white shadow-sm">

<div className="max-w-7xl mx-auto px-4 sm:px-6">

{/* TOP ROW */}

<div className="h-16 flex items-center justify-between">

{/* LOGO */}

<Link
to="/"
className="flex items-center gap-1 leading-none"
>

<img
src={logo}
alt="Vyoma"
className="h-10 w-auto object-contain"
/>

<span className="text-xl sm:text-2xl font-extrabold text-blue-900">
VYOMA
</span>

</Link>


{/* DESKTOP SEARCH */}

<form
onSubmit={handleSearch}
className="hidden md:flex items-center w-[420px]"
>

<div className="flex items-center w-full bg-gray-100 rounded-full px-4">

<Search className="text-gray-400 w-4 h-4 mr-2" />

<Input
type="text"
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
placeholder="Search shops or products..."
className="
border-none
ring-0
focus:ring-0
focus:outline-none
bg-transparent
shadow-none
"
/>

</div>

</form>


{/* RIGHT SECTION */}

<div className="flex items-center gap-3 sm:gap-5">


{/* Wishlist */}

<Link to="/wishlist">

<Button
variant="ghost"
className="p-2 rounded-full relative hover:bg-blue-50"
>

<Heart className="w-5 h-5 text-gray-700" />

{wishlistCount > 0 && (

<span className="
absolute -top-1 -right-1
min-w-[18px]
h-[18px]
px-1
bg-red-500
text-white
text-[10px]
font-semibold
rounded-full
flex items-center justify-center
">

{wishlistCount}

</span>

)}

</Button>

</Link>

{/* Vyoma Wallet */}

<Link to="/wallet">

<Button
variant="ghost"
className="
hidden sm:flex
items-center gap-2
px-4 py-2
rounded-full
bg-blue-50
hover:bg-blue-100
text-blue-700
font-medium
"
>

<Wallet className="w-4 h-4" />

<span className="text-sm">
₹{walletBalance}
</span>

</Button>

</Link>

{/* User */}

{!user && (

<Link to="/login">

<Button
variant="ghost"
className="p-2 rounded-full hover:bg-blue-50"
>

<User className="w-5 h-5 text-gray-700" />

</Button>

</Link>

)}


{user && (

<div className="flex items-center gap-2">

<div className="
w-8 h-8
bg-blue-600
text-white
rounded-full
flex items-center justify-center
text-sm
font-semibold
">

{user.name.charAt(0).toUpperCase()}

</div>

<span className="hidden sm:block text-sm font-medium">
Hi, {user.name}
</span>

<Button
onClick={handleLogout}
variant="ghost"
className="p-2 rounded-full"
>

<LogOut className="w-5 h-5 text-red-500" />

</Button>

</div>

)}

{user?.role === "vendor" && (
  <button onClick={goToVendorApp}>
    🏪 Switch to Vendor
  </button>
)}


{/* Cart */}

<Link to="/cart">

<Button
variant="ghost"
className="p-2 rounded-full relative hover:bg-blue-50"
>

<ShoppingCart className="w-5 h-5 text-gray-700" />

{totalItems > 0 && (

<span className="
absolute -top-1 -right-1
min-w-[18px]
h-[18px]
px-1
bg-blue-600
text-white
text-[10px]
font-semibold
rounded-full
flex items-center justify-center
">

{totalItems}

</span>

)}

</Button>

</Link>

</div>

</div>

{/* MOBILE WALLET */}

<Link to="/wallet" className="sm:hidden">

<Button
variant="ghost"
className="
p-2 rounded-full
relative
hover:bg-blue-50
"
>

<Wallet className="w-5 h-5 text-blue-700" />

</Button>

</Link>

{/* MOBILE SEARCH */}

<div className="md:hidden pb-3">

<form onSubmit={handleSearch}>

<div className="flex items-center bg-gray-100 rounded-full px-4">

<Search className="text-gray-400 w-4 h-4 mr-2" />

<Input
type="text"
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
placeholder="Search shops or products..."
className="
border-none
ring-0
focus:ring-0
focus:outline-none
bg-transparent
shadow-none
"
/>

</div>

</form>

</div>

</div>

</header>

  );
};

export default Navbar;
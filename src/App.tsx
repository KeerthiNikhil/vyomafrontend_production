import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import "./index.css"
import MainLayout from "@/layouts/MainLayout";
import VendorLayout from "@/layouts/VendorLayout";
import AdminLayout from "@/layouts/AdminLayout";

// User pages
import Home from "./pages/Home";
import ShopProducts from "./pages/ShopProducts";
import CategoryProducts from "@/pages/CategoryProducts";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ProductDetails from "@/pages/ProductDetails";
import Wishlist from "@/components/products/Wishlist";
import SearchPage from "./pages/SearchPage";
import WalletPage from "@/pages/Wallet";
import OrdersPage from "@/pages/orders/OrdersPage";
// Vendor pages
import VendorVerify from "@/pages/vendor/VendorVerify";
import VendorDashboard from "@/pages/vendor/ShopDashboard";
import CreateShop from "@/pages/vendor/ShopCreate";
import Profile from "@/pages/vendor/Profile"; 
import AddProduct from "@/pages/vendor/AddProduct";
import ManageProduct from "@/pages/vendor/ManageProduct";
import AddCategory from "@/pages/vendor/AddCategory";
import EditCategory from "@/pages/vendor/EditCategory";
import PendingOrders from "@/pages/vendor/PendingOrders";
import DeliveredOrders from "@/pages/vendor/DeliveredOrders";
import Payments from "@/pages/vendor/Payments";
import DeliveryBoys from "@/pages/vendor/DeliveryBoys";
import AssignDelivery from "@/pages/vendor/AsignDelivery";
import Reviews from "@/pages/vendor/Reviews";
import Subscription from "@/pages/vendor/Subscription";
//=======ADMIN 
import AdminDashboard from "@/pages/admin/Dashboard";
import ActiveProducts from "@/pages/admin/ActiveProducts";
import Banners from "@/pages/admin/Banners";
import DisabledProducts from "@/pages/admin/DisabledProducts";
import AdminLogin from "@/pages/admin/Login";
import AdminPayments from "@/pages/admin/Payments";
import AdminReviews from "@/pages/admin/Reviews";
import AdminVendors from"@/pages/admin/Vendors";

function App() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // clean URL
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= USER ROUTES ================= */}
        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/shop/:id" element={<ShopProducts />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route
  path="/orders"
  element={<OrdersPage />}
/>
          
          <Route
  path="/category/:slug"
  element={<CategoryProducts />}
/>
          <Route
            path="/shop/:id/category/:slug"
            element={<CategoryProducts />}
          />

          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        </Route>

        {/* ================= VENDOR VERIFY (NO LAYOUT) ================= */}
        <Route path="/vendor/verify" element={<VendorVerify />} />

        {/* ================= VENDOR ROUTES ================= */}
        <Route path="/vendor" element={<VendorLayout />}>
         <Route index element={<VendorDashboard />} />

          <Route path="dashboard" element={<VendorDashboard />} />
         <Route path="profile" element={<Profile />} /> 
          <Route path="create-shop" element={<CreateShop />} />

          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/manage" element={<ManageProduct />} />

          <Route path="category/add" element={<AddCategory />} />
          <Route path="category/edit" element={<EditCategory />} />

          <Route path="orders/pending" element={<PendingOrders />} />
          <Route path="orders/delivered" element={<DeliveredOrders />} />

          <Route path="payments" element={<Payments />} />

          <Route path="delivery/boys" element={<DeliveryBoys />} />
          <Route path="delivery/assign" element={<AssignDelivery />} />

          <Route path="reviews" element={<Reviews />} />
          <Route path="subscription" element={<Subscription />} />

        </Route>

         {/* Admin route */}
        <Route path="/admin" element={<AdminLayout />}>

        <Route index element={<AdminDashboard />} /> {/* /admin */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products/active" element={<ActiveProducts />} />
        <Route path="banners" element={<Banners/>} />
        <Route path="products/disabled" element={<DisabledProducts />} />
        
        <Route path="payments" element={< AdminPayments/>} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="vendors" element={<AdminVendors />} />
        <Route path="login" element={<AdminLogin/>} />
</Route>
      </Routes>

    
    </BrowserRouter>
  );
}

export default App;
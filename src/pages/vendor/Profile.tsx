import { useState, useEffect } from "react";

import axios from "@/lib/axios";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  User,
  Store,
  Mail,
  Phone,
  MapPin,
  Camera,
  ShoppingBag,
  Package,
  IndianRupee,
  Pencil,
  Save,
  ChevronDown,
} from "lucide-react";

const inputStyle =
  "w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition-all outline-none focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500";

const cardStyle =
  "rounded-3xl border border-slate-200 shadow-sm bg-white";

const buttonStyle =
  "h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-md text-white transition-all";

const selectWrapperStyle =
  "relative w-full";

const selectStyle =
  "appearance-none w-full h-14 rounded-2xl border border-slate-200 bg-white px-5 pr-14 text-slate-700 shadow-sm transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500";

const Profile = () => {

  const [editMode, setEditMode] =
    useState(false);

  const [shops, setShops] =
    useState<any[]>([]);

  const [image, setImage] =
    useState<any>(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
    });

  const [profile, setProfile] =
    useState({
      name: "",
      email: "",
      phone: "",
      shopName: "",
      address: "",
      shopId: "",
      avatar: "",
    });

  /* IMAGE */
  const handleImageChange = (
    e: any
  ) => {

    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  /* CHANGE */
  const handleChange = (
    field: string,
    value: string
  ) => {

    setProfile({
      ...profile,
      [field]: value,
    });
  };

  /* FETCH */
  useEffect(() => {

    const fetchProfile = async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem("token");

        /* PROFILE */
        const profileRes =
          await axios.get(
            "/vendor/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          profileRes.data.data;

        const firstShop =
          data.shops?.[0];

        setProfile({
          name:
            data.user?.name || "",
          email:
            data.user?.email || "",
          phone:
            data.user?.phone || "",
          shopId:
            firstShop?._id || "",
          shopName:
            firstShop?.name || "",
          address:
            firstShop?.address || "",
          avatar:
            data.user?.avatar || "",
        });

        setShops(data.shops || []);

        /* PRODUCTS */
        const productRes =
          await axios.get(
            "/products/vendor-products",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        /* ORDERS */
        const orderRes =
          await axios.get(
            "/orders",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const products =
          productRes.data.data || [];

        const orders =
          orderRes.data.data || [];

        const revenue =
          orders.reduce(
            (
              acc: number,
              order: any
            ) =>
              acc +
              (order.totalAmount ||
                0),
            0
          );

        setStats({
          totalProducts:
            products.length,
          totalOrders:
            orders.length,
          totalRevenue:
            revenue,
        });

      } catch (err) {

        console.log(
          "FETCH ERROR 👉",
          err
        );

      } finally {

        setLoading(false);
      }
    };

    fetchProfile();

  }, []);

  /* SAVE */
  const handleSave = async () => {

    try {

      const token =
        localStorage.getItem("token");

      /* USER */
      await axios.put(
        "/vendor/profile",
        {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      /* SHOP */
      if (profile.shopId) {

        await axios.put(
          `/shops/${profile.shopId}`,
          {
            name:
              profile.shopName,
            address:
              profile.address,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      /* AVATAR */
      if (image) {

        const formData =
          new FormData();

        formData.append(
          "avatar",
          image
        );

        await axios.put(
          "/vendor/avatar",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      }

      alert(
        "✅ Profile updated successfully"
      );

      setEditMode(false);

    } catch (err) {

      console.log(err);

      alert(
        "❌ Failed to update profile"
      );
    }
  };

  /* LOADING */
  if (loading) {

    return (

      <div className="
      min-h-screen
      flex items-center justify-center
      bg-slate-50
      ">

        <p className="
        text-slate-500
        text-lg
        ">
          Loading profile...
        </p>

      </div>
    );
  }

  return (

    <div className="
    min-h-screen
    bg-slate-50
    p-4
    md:p-8
    space-y-8
    ">

      {/* HEADER */}
      <div className="
      flex
      flex-col
      lg:flex-row
      lg:items-center
      lg:justify-between
      gap-4
      ">

        <div>

          <h1 className="
          text-3xl
          md:text-4xl
          font-extrabold
          tracking-tight
          text-slate-900
          ">
            Profile Settings
          </h1>

          <p className="
          text-slate-500
          mt-1
          text-sm
          md:text-base
          ">
            Manage your vendor account
            and store information
          </p>

        </div>

        <Button
          className={`
          ${buttonStyle}
          flex items-center gap-2
          `}
          onClick={() =>
            setEditMode(!editMode)
          }
        >

          <Pencil size={18} />

          {editMode
            ? "Cancel Editing"
            : "Edit Profile"}

        </Button>

      </div>

      {/* PROFILE CARD */}
      <Card className={cardStyle}>

        <CardContent className="
        p-6
        md:p-8
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-8
        ">

          {/* LEFT */}
          <div className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          gap-5
          ">

            {/* AVATAR */}
            <div className="relative">

              <div className="
              w-24 h-24
              rounded-full
              overflow-hidden
              border-4 border-white
              shadow-lg
              bg-gradient-to-br
              from-blue-600
              to-indigo-700
              flex items-center justify-center
              text-white
              text-3xl
              font-bold
              ">

                {preview ||
                profile.avatar ? (

                  <img
                    src={
                      preview ||
                      profile.avatar
                    }
                    className="
                    w-full
                    h-full
                    object-cover
                    "
                  />

                ) : (

                  profile?.name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                  "V"
                )}

              </div>

              <div className="
              absolute
              -bottom-1
              -right-1
              w-7 h-7
              rounded-full
              bg-green-500
              border-4 border-white
              " />

            </div>

            {/* DETAILS */}
            <div className="
            space-y-2
            break-all
            ">

              <h2 className="
              text-2xl
              font-bold
              text-slate-900
              ">
                {profile.name}
              </h2>

              <div className="
              flex items-center gap-2
              text-slate-500
              text-sm
              ">

                <Mail size={15} />

                {profile.email}

              </div>

              <div className="
              flex items-center gap-2
              text-blue-600
              text-sm
              font-medium
              ">

                <Store size={15} />

                {profile.shopName}

              </div>

              <span className="
              inline-flex
              items-center
              px-3 py-1
              rounded-full
              text-xs
              font-semibold
              bg-green-100
              text-green-700
              ">
                Active Account
              </span>

            </div>

          </div>

          {/* IMAGE */}
          {editMode && (

            <div className="
            w-full
            lg:w-[280px]
            space-y-3
            ">

              <label className="
              text-sm
              font-medium
              text-slate-700
              flex items-center gap-2
              ">

                <Camera size={16} />

                Update Avatar

              </label>

              <Input
                type="file"
                onChange={
                  handleImageChange
                }
                className={inputStyle}
              />

            </div>
          )}

        </CardContent>

      </Card>

      {/* FORM */}
      <Card className={cardStyle}>

        <CardContent className="
        p-6
        md:p-8
        space-y-8
        ">

          <div>

            <h2 className="
            text-xl
            font-bold
            text-slate-900
            ">
              Account Information
            </h2>

            <p className="
            text-slate-500
            text-sm
            mt-1
            ">
              Update your profile and
              shop details
            </p>

          </div>

          <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          ">

            {/* NAME */}
            <Field
              icon={<User size={16} />}
              label="Full Name"
            >

              <Input
                className={inputStyle}
                value={profile.name}
                disabled={!editMode}
                onChange={(e) =>
                  handleChange(
                    "name",
                    e.target.value
                  )
                }
              />

            </Field>

            {/* EMAIL */}
            <Field
              icon={<Mail size={16} />}
              label="Email"
            >

              <Input
                className={inputStyle}
                value={profile.email}
                disabled={!editMode}
                onChange={(e) =>
                  handleChange(
                    "email",
                    e.target.value
                  )
                }
              />

            </Field>

            {/* PHONE */}
            <Field
              icon={<Phone size={16} />}
              label="Phone"
            >

              <Input
                className={inputStyle}
                value={profile.phone}
                disabled={!editMode}
                onChange={(e) =>
                  handleChange(
                    "phone",
                    e.target.value
                  )
                }
              />

            </Field>

            {/* SHOP */}
            <Field
              icon={<Store size={16} />}
              label="Shop"
            >

              <div
                className={
                  selectWrapperStyle
                }
              >

                <select
                  className={
                    selectStyle
                  }
                  disabled={
                    !editMode
                  }
                  value={
                    profile.shopId
                  }
                  onChange={(
                    e
                  ) => {

                    const selected =
                      shops.find(
                        (
                          s: any
                        ) =>
                          s._id ===
                          e.target
                            .value
                      );

                    if (
                      !selected
                    )
                      return;

                    setProfile({
                      ...profile,
                      shopId:
                        selected._id,
                      shopName:
                        selected.name,
                      address:
                        selected.address,
                    });
                  }}
                >

                  {shops.map(
                    (
                      shop: any
                    ) => (

                      <option
                        key={
                          shop._id
                        }
                        value={
                          shop._id
                        }
                      >
                        {
                          shop.name
                        }
                      </option>
                    )
                  )}

                </select>

                <ChevronDown
                  size={18}
                  className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                  pointer-events-none
                  "
                />

              </div>

            </Field>

            {/* SHOP NAME */}
            <Field
              icon={<Store size={16} />}
              label="Shop Name"
            >

              <Input
                className={inputStyle}
                value={
                  profile.shopName
                }
                disabled={!editMode}
                onChange={(e) =>
                  handleChange(
                    "shopName",
                    e.target.value
                  )
                }
              />

            </Field>

            {/* ADDRESS */}
            <Field
              icon={
                <MapPin size={16} />
              }
              label="Address"
            >

              <Input
                className={inputStyle}
                value={
                  profile.address
                }
                disabled={!editMode}
                onChange={(e) =>
                  handleChange(
                    "address",
                    e.target.value
                  )
                }
              />

            </Field>

          </div>

          {/* SAVE */}
          {editMode && (

            <div className="
            flex
            justify-end
            ">

              <Button
                className={`
                ${buttonStyle}
                flex items-center gap-2
                `}
                onClick={handleSave}
              >

                <Save size={18} />

                Save Changes

              </Button>

            </div>
          )}

        </CardContent>

      </Card>

      {/* STATS */}
      <div className="
      grid
      grid-cols-1
      md:grid-cols-3
      gap-6
      ">

        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={
            <Package size={28} />
          }
          bg="bg-blue-100"
          text="text-blue-600"
        />

        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={
            <ShoppingBag size={28} />
          }
          bg="bg-orange-100"
          text="text-orange-600"
        />

        <StatsCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue}`}
          icon={
            <IndianRupee size={28} />
          }
          bg="bg-green-100"
          text="text-green-600"
        />

      </div>

    </div>
  );
};

/* FIELD */
const Field = ({
  label,
  icon,
  children,
}: any) => (

  <div className="space-y-2">

    <label className="
    text-sm
    font-semibold
    text-slate-700
    flex items-center gap-2
    ">

      {icon}

      {label}

    </label>

    {children}

  </div>
);

/* STATS CARD */
const StatsCard = ({
  title,
  value,
  icon,
  bg,
  text,
}: any) => (

  <Card
    className={`
    ${cardStyle}
    hover:shadow-lg
    transition-all
    duration-300
    `}
  >

    <CardContent className="
    p-7
    flex
    items-center
    justify-between
    ">

      <div>

        <p className="
        text-sm
        text-slate-500
        ">
          {title}
        </p>

        <h2 className="
        text-3xl
        font-bold
        mt-2
        text-slate-900
        ">
          {value}
        </h2>

      </div>

      <div
        className={`
        w-14 h-14
        rounded-2xl
        flex items-center justify-center
        ${bg}
        `}
      >

        <div className={text}>
          {icon}
        </div>

      </div>

    </CardContent>

  </Card>
);

export default Profile;
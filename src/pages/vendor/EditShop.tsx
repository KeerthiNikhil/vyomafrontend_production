import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "@/lib/axios";
import { toast } from "sonner";

import {
  Store,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  Trash2,
  ArrowLeft,
  Save,
} from "lucide-react";

const inputStyle = `
w-full
h-14
px-5
rounded-2xl
border border-slate-200
bg-slate-50
outline-none
transition
focus:border-blue-500
focus:ring-4
focus:ring-blue-100
`;

const textareaStyle = `
w-full
p-5
rounded-2xl
border border-slate-200
bg-slate-50
outline-none
transition
focus:border-blue-500
focus:ring-4
focus:ring-blue-100
`;

const EditShop = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  const [shopName, setShopName] =
    useState("");

  const [ownerName, setOwnerName] =
    useState("");

  const [businessType, setBusinessType] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [shopImages, setShopImages] =
    useState<string[]>([]);

  const [newImages, setNewImages] =
    useState<File[]>([]);

  useEffect(() => {

    const fetchShop = async () => {

      try {

        const res = await axios.get(
          `/shops/${id}`
        );

        const shop = res.data.data;

        setShopName(
          shop.shopName || ""
        );

        setOwnerName(
          shop.ownerName || ""
        );

        setBusinessType(
          shop.businessType || ""
        );

        setPhone(
          shop.phone || ""
        );

        setEmail(
          shop.email || ""
        );

        setAddress(
          shop.address || ""
        );

        setDescription(
          shop.description || ""
        );

        setShopImages(
          shop.shopImages || []
        );

      } catch (error) {

        toast.error(
          "Failed to load shop"
        );

      } finally {

        setLoading(false);

      }
    };

    fetchShop();

  }, [id]);

  const removeExistingImage = (
    index: number
  ) => {

    setShopImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const removeNewImage = (
    index: number
  ) => {

    setNewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleUpdate = async () => {

    try {

      setUpdating(true);

      const token =
        localStorage.getItem("token");

      const formData = new FormData();

      formData.append(
        "shopName",
        shopName
      );

      formData.append(
        "ownerName",
        ownerName
      );

      formData.append(
        "businessType",
        businessType
      );

      formData.append(
        "phone",
        phone
      );

      formData.append(
        "email",
        email
      );

      formData.append(
        "address",
        address
      );

      formData.append(
        "description",
        description
      );

      formData.append(
        "existingImages",
        JSON.stringify(shopImages)
      );

      newImages.forEach((img) => {

        formData.append(
          "shopImages",
          img
        );

      });

      await axios.put(
        `/shops/${id}`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Shop updated successfully 🎉"
      );

      navigate("/vendor/shops");

    } catch (error: any) {

      toast.error(
        error.response?.data?.message ||
        "Update failed"
      );

    } finally {

      setUpdating(false);

    }
  };

  if (loading) {

    return (

      <div className="
      h-screen
      flex
      items-center
      justify-center
      ">

        <div className="
        text-lg
        font-semibold
        text-slate-600
        ">
          Loading Shop...
        </div>

      </div>
    );
  }

  return (

    <div className="
    min-h-screen
    bg-slate-100
    p-4
    md:p-8
    ">

      <div className="
      max-w-6xl
      mx-auto
      grid
      lg:grid-cols-5
      gap-8
      ">

        {/* LEFT PANEL */}

        <div className="
        lg:col-span-2
        bg-gradient-to-br
        from-blue-600
        to-blue-800
        rounded-[32px]
        p-8
        text-white
        shadow-xl
        flex
        flex-col
        justify-between
        min-h-[700px]
        ">

          <div>

            <button
              onClick={() =>
                navigate("/vendor/shops")
              }
              className="
              flex
              items-center
              gap-2
              text-sm
              mb-8
              hover:opacity-80
              transition
              "
            >

              <ArrowLeft size={18} />
              Back to Shops

            </button>

            <div className="
            w-20 h-20
            rounded-3xl
            bg-white/20
            flex
            items-center
            justify-center
            mb-6
            ">

              <Store size={38} />

            </div>

            <h1 className="
            text-4xl
            font-bold
            leading-tight
            ">
              Edit Your Shop
            </h1>

            <p className="
            mt-5
            text-blue-100
            leading-7
            ">
              Update your shop details,
              manage banner images,
              and keep your marketplace
              profile fresh and attractive
              for customers.
            </p>

          </div>

          <div className="
          bg-white/10
          rounded-3xl
          p-6
          backdrop-blur
          ">

            <h3 className="
            font-semibold
            text-lg
            mb-4
            ">
              Quick Tips
            </h3>

            <ul className="
            space-y-3
            text-sm
            text-blue-100
            ">

              <li>
                • Use high quality shop banners
              </li>

              <li>
                • Keep business description updated
              </li>

              <li>
                • Add at least 3 carousel images
              </li>

              <li>
                • Accurate address improves discovery
              </li>

            </ul>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="
        lg:col-span-3
        bg-white
        rounded-[32px]
        shadow-xl
        p-6
        md:p-10
        space-y-8
        ">

          <div>

            <h2 className="
            text-3xl
            font-bold
            text-slate-900
            ">
              Shop Information
            </h2>

            <p className="
            text-slate-500
            mt-2
            ">
              Update your business details
            </p>

          </div>

          {/* FORM */}

          <div className="
          grid
          md:grid-cols-2
          gap-5
          ">

            <div className="space-y-2">

              <label className="
              text-sm
              font-medium
              text-slate-700
              flex
              items-center
              gap-2
              ">
                <Store size={16} />
                Shop Name
              </label>

              <input
                value={shopName}
                onChange={(e) =>
                  setShopName(
                    e.target.value
                  )
                }
                className={inputStyle}
              />

            </div>

            <div className="space-y-2">

              <label className="
              text-sm
              font-medium
              text-slate-700
              ">
                Owner Name
              </label>

              <input
                value={ownerName}
                onChange={(e) =>
                  setOwnerName(
                    e.target.value
                  )
                }
                className={inputStyle}
              />

            </div>

            <div className="space-y-2">

              <label className="
              text-sm
              font-medium
              text-slate-700
              ">
                Business Type
              </label>

              <input
                value={businessType}
                onChange={(e) =>
                  setBusinessType(
                    e.target.value
                  )
                }
                className={inputStyle}
              />

            </div>

            <div className="space-y-2">

              <label className="
              text-sm
              font-medium
              text-slate-700
              flex
              items-center
              gap-2
              ">
                <Phone size={16} />
                Phone
              </label>

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                className={inputStyle}
              />

            </div>

          </div>

          <div className="space-y-2">

            <label className="
            text-sm
            font-medium
            text-slate-700
            flex
            items-center
            gap-2
            ">
              <Mail size={16} />
              Email
            </label>

            <input
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className={inputStyle}
            />

          </div>

          <div className="space-y-2">

            <label className="
            text-sm
            font-medium
            text-slate-700
            flex
            items-center
            gap-2
            ">
              <MapPin size={16} />
              Address
            </label>

            <textarea
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
              className={`${textareaStyle} min-h-[120px]`}
            />

          </div>

          <div className="space-y-2">

            <label className="
            text-sm
            font-medium
            text-slate-700
            flex
            items-center
            gap-2
            ">
              <FileText size={16} />
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className={`${textareaStyle} min-h-[160px]`}
            />

          </div>

          {/* IMAGES */}

          <div className="space-y-5">

            <div>

              <h2 className="
              text-2xl
              font-bold
              text-slate-900
              ">
                Shop Images
              </h2>

              <p className="
              text-slate-500
              mt-1
              ">
                Remove old images or upload new banners
              </p>

            </div>

            {/* EXISTING IMAGES */}

            <div className="
            grid
            grid-cols-2
            md:grid-cols-3
            gap-4
            ">

              {shopImages.map(
                (img, index) => (

                <div
                  key={index}
                  className="
                  relative
                  rounded-3xl
                  overflow-hidden
                  border
                  border-slate-200
                  "
                >

                  <img
                    src={img}
                    className="
                    h-40
                    w-full
                    object-cover
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeExistingImage(index)
                    }
                    className="
                    absolute
                    top-3
                    right-3
                    w-8
                    h-8
                    rounded-full
                    bg-red-500
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow
                    "
                  >

                    <Trash2 size={16} />

                  </button>

                </div>

              ))}

            </div>

            {/* UPLOAD */}

            <label className="
            border-2
            border-dashed
            border-slate-300
            rounded-3xl
            p-8
            flex
            flex-col
            items-center
            justify-center
            text-center
            cursor-pointer
            hover:border-blue-400
            hover:bg-blue-50/40
            transition
            ">

              <Upload
                size={40}
                className="text-blue-600 mb-4"
              />

              <h3 className="
              text-lg
              font-semibold
              text-slate-800
              ">
                Upload New Images
              </h3>

              <p className="
              text-sm
              text-slate-500
              mt-1
              ">
                PNG, JPG or WEBP supported
              </p>

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {

                  if (!e.target.files)
                    return;

                  setNewImages(
                    Array.from(
                      e.target.files
                    )
                  );
                }}
              />

            </label>

            {/* NEW IMAGE PREVIEW */}

            {newImages.length > 0 && (

              <div className="
              grid
              grid-cols-2
              md:grid-cols-3
              gap-4
              ">

                {newImages.map(
                  (img, index) => (

                  <div
                    key={index}
                    className="
                    relative
                    rounded-3xl
                    overflow-hidden
                    border
                    border-slate-200
                    "
                  >

                    <img
                      src={URL.createObjectURL(img)}
                      className="
                      h-40
                      w-full
                      object-cover
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeNewImage(index)
                      }
                      className="
                      absolute
                      top-3
                      right-3
                      w-8
                      h-8
                      rounded-full
                      bg-red-500
                      text-white
                      flex
                      items-center
                      justify-center
                      "
                    >

                      <Trash2 size={16} />

                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* ACTION BUTTONS */}

          <div className="
          flex
          flex-col
          md:flex-row
          gap-4
          pt-4
          ">

            <button
              onClick={() =>
                navigate("/vendor/shops")
              }
              className="
              flex-1
              h-14
              rounded-2xl
              border
              border-slate-200
              bg-slate-100
              hover:bg-slate-200
              font-semibold
              transition
              "
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              disabled={updating}
              className="
              flex-1
              h-14
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              shadow-lg
              transition
              disabled:opacity-50
              flex
              items-center
              justify-center
              gap-2
              "
            >

              <Save size={18} />

              {updating
                ? "Updating..."
                : "Save Changes"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default EditShop;
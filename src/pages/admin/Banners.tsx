import { useState } from "react";
import { banners as initialBanners } from "@/data/banners";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface BannerType {
  id: number;
  title: string;
  image: string;
  priority: number;
  status: string;
}

const Banners = () => {
  const [banners, setBanners] =
    useState<BannerType[]>(initialBanners);

  const [showModal, setShowModal] = useState(false);

  const [editingBanner, setEditingBanner] =
    useState<BannerType | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    priority: "",
    status: "Active",
  });

  // ✅ OPEN ADD
  const handleAddOpen = () => {
    setEditingBanner(null);

    setFormData({
      title: "",
      image: "",
      priority: "",
      status: "Active",
    });

    setShowModal(true);
  };

  // ✅ OPEN EDIT
  const handleEdit = (banner: BannerType) => {
    setEditingBanner(banner);

    setFormData({
      title: banner.title,
      image: banner.image,
      priority: banner.priority.toString(),
      status: banner.status,
    });

    setShowModal(true);
  };

  // ✅ SAVE
  const handleSave = () => {
    if (
      !formData.title ||
      !formData.image ||
      !formData.priority
    ) {
      alert("Fill all fields");
      return;
    }

    // EDIT
    if (editingBanner) {
      setBanners((prev) =>
        prev.map((banner) =>
          banner.id === editingBanner.id
            ? {
                ...banner,
                title: formData.title,
                image: formData.image,
                priority: Number(formData.priority),
                status: formData.status,
              }
            : banner
        )
      );
    }

    // ADD
    else {
      const newBanner: BannerType = {
        id: Date.now(),
        title: formData.title,
        image: formData.image,
        priority: Number(formData.priority),
        status: formData.status,
      };

      setBanners([...banners, newBanner]);
    }

    setShowModal(false);
  };

  // ✅ DELETE
  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Delete this banner?"
    );

    if (!confirmDelete) return;

    setBanners((prev) =>
      prev.filter((banner) => banner.id !== id)
    );
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-start justify-between">

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Banners
          </h1>

          <p className="text-slate-500 mt-2 text-lg">
            Manage homepage banners and promotions
          </p>
        </div>

        <button
          onClick={handleAddOpen}
          className="
            flex items-center gap-2
            bg-blue-600 hover:bg-blue-700
            text-white
            px-5 py-3
            rounded-2xl
            shadow-sm
            transition
          "
        >
          <Plus size={18} />
          Add Banner
        </button>

      </div>

      {/* MAIN CARD */}
      <div
        className="
          bg-white
          border border-slate-200
          rounded-3xl
          shadow-sm
          p-8
        "
      >

        {/* TOP */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Banner List
            </h2>

            <p className="text-slate-500 mt-1">
              Manage all banners displayed on homepage
            </p>
          </div>

          <div
            className="
              px-5 py-2
              rounded-full
              border border-slate-200
              text-sm font-medium
              bg-slate-50
            "
          >
            Total: {banners.length} banners
          </div>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {banners.map((banner) => (
            <div
              key={banner.id}
              className="
                bg-white
                rounded-3xl
                overflow-hidden
                border border-slate-200
                shadow-sm
                hover:shadow-md
                transition
              "
            >

              {/* IMAGE */}
              <div className="relative">

                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-48 object-cover"
                />

                <span
                  className={`
                    absolute top-3 right-3
                    text-xs font-medium
                    px-3 py-1 rounded-full
                    ${
                      banner.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {banner.status}
                </span>

              </div>

              {/* CONTENT */}
              <div className="p-5 space-y-4">

                <div>
                  <h3 className="font-semibold text-lg text-slate-900">
                    {banner.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Priority: {banner.priority}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3">

                  <button
                    onClick={() => handleEdit(banner)}
                    className="
                      flex-1
                      h-11
                      rounded-2xl
                      border border-slate-200
                      hover:bg-slate-50
                      font-medium
                      transition
                      flex items-center justify-center gap-2
                    "
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(banner.id)
                    }
                    className="
                      flex-1
                      h-11
                      rounded-2xl
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      font-medium
                      transition
                      flex items-center justify-center gap-2
                    "
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="
            fixed inset-0
            bg-black/40
            flex items-center justify-center
            z-50
          "
        >

          <div
            className="
              bg-white
              w-full max-w-lg
              rounded-3xl
              p-8
              shadow-xl
              space-y-5
            "
          >

            {/* TOP */}
            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                {editingBanner
                  ? "Edit Banner"
                  : "Add Banner"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
              >
                <X />
              </button>

            </div>

            {/* TITLE */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Banner Title
              </label>

              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="
                  w-full
                  h-12
                  border border-slate-200
                  rounded-2xl
                  px-4
                  outline-none
                "
              />
            </div>

            {/* IMAGE */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Banner Image URL
              </label>

              <input
                type="text"
                value={formData.image}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    image: e.target.value,
                  })
                }
                className="
                  w-full
                  h-12
                  border border-slate-200
                  rounded-2xl
                  px-4
                  outline-none
                "
              />
            </div>

            {/* PRIORITY */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Priority
              </label>

              <input
                type="number"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value,
                  })
                }
                className="
                  w-full
                  h-12
                  border border-slate-200
                  rounded-2xl
                  px-4
                  outline-none
                "
              />
            </div>

            {/* STATUS */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Status
              </label>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                className="
                  w-full
                  h-12
                  border border-slate-200
                  rounded-2xl
                  px-4
                  outline-none
                "
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 pt-3">

              <button
                onClick={() => setShowModal(false)}
                className="
                  px-5 py-3
                  rounded-2xl
                  border border-slate-200
                "
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="
                  px-5 py-3
                  rounded-2xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                "
              >
                {editingBanner
                  ? "Update Banner"
                  : "Add Banner"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Banners;
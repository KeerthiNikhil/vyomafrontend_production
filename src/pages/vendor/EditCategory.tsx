import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Trash2 } from "lucide-react";
import { toast } from "sonner";

const EditCategory = () => {

  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [newSubCategory, setNewSubCategory] = useState("");

  /* ================= FETCH ================= */

  useEffect(() => {

    const fetchCategories = async () => {

      try {

        const res = await axios.get(
          "http://localhost:8000/api/v1/categories/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCategories(res.data.data);

        if (res.data.data.length > 0) {

          const first = res.data.data[0];

          setCategoryId(first._id);
          setCategoryName(first.name);
          setSubCategories(first.subCategories || []);

        }

      } catch {

        toast.error("Failed to load categories");

      }

    };

    fetchCategories();

  }, []);

  /* ================= CHANGE CATEGORY ================= */

  const handleCategoryChange = (id: string) => {

    const selected = categories.find(
      (c) => c._id === id
    );

    if (!selected) return;

    setCategoryId(selected._id);
    setCategoryName(selected.name);
    setSubCategories(selected.subCategories || []);

  };

  /* ================= ADD SUBCATEGORY ================= */

  const handleAddSubCategory = () => {

    const trimmed = newSubCategory.trim();

    if (!trimmed) return;

    if (subCategories.includes(trimmed)) {

      toast.error("Already exists");
      return;

    }

    setSubCategories([
      ...subCategories,
      trimmed,
    ]);

    setNewSubCategory("");

  };

  /* ================= REMOVE ================= */

  const handleRemoveSubCategory = (
    index: number
  ) => {

    setSubCategories((prev) =>
      prev.filter((_, i) => i !== index)
    );

  };

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {

    if (!categoryName.trim()) {

      toast.error("Category name required");
      return;

    }

    if (subCategories.length === 0) {

      toast.error(
        "Add at least one subcategory"
      );

      return;

    }

    try {

      await axios.put(
        `http://localhost:8000/api/v1/categories/${categoryId}`,
        {
          name: categoryName,
          subCategories,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Category updated ✅");

    } catch {

      toast.error("Update failed ❌");

    }

  };

  /* ================= DELETE ================= */

  const handleDeleteCategory = async () => {

    if (
      !window.confirm(
        "Delete this category?"
      )
    ) return;

    try {

      await axios.delete(
        `http://localhost:8000/api/v1/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Category deleted 🗑️");

      const updated = categories.filter(
        (c) => c._id !== categoryId
      );

      setCategories(updated);

      if (updated.length > 0) {

        setCategoryId(updated[0]._id);
        setCategoryName(updated[0].name);
        setSubCategories(
          updated[0].subCategories || []
        );

      } else {

        setCategoryId("");
        setCategoryName("");
        setSubCategories([]);

      }

    } catch {

      toast.error("Delete failed ❌");

    }

  };

  return (

    <div className="
    max-w-5xl
    mx-auto
    p-4
    md:p-6
    space-y-6
    pb-28
    ">

      {/* ================= HEADER ================= */}

      <div>

        <h1 className="
        text-3xl
        md:text-4xl
        font-black
        tracking-tight
        text-slate-900
        ">
          Edit Category
        </h1>

        <p className="
        text-slate-500
        mt-2
        text-sm
        md:text-base
        ">
          Manage categories and subcategories
        </p>

      </div>

      {/* ================= CATEGORY SELECT ================= */}

      <div className="
      bg-white
      border
      border-slate-200
      rounded-3xl
      shadow-sm
      p-6
      md:p-8
      space-y-5
      ">

        <div>

          <h2 className="
          text-2xl
          font-bold
          text-slate-800
          ">
            Select Category
          </h2>

          <p className="
          text-sm
          text-slate-500
          mt-1
          ">
            Choose category to edit
          </p>

        </div>

        <div className="relative">

          <select
            value={categoryId}
            onChange={(e) =>
              handleCategoryChange(
                e.target.value
              )
            }
            className="
            w-full
            h-14
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            px-5
            pr-12
            appearance-none
            outline-none
            focus:ring-4
            focus:ring-blue-100
            focus:border-blue-500
            transition
            "
          >

            {categories.map((cat) => (

              <option
                key={cat._id}
                value={cat._id}
              >
                {cat.name}
              </option>

            ))}

          </select>

          <div className="
          absolute
          right-5
          top-1/2
          -translate-y-1/2
          text-xs
          text-slate-500
          pointer-events-none
          ">
            ▼
          </div>

        </div>

      </div>

      {/* ================= CATEGORY NAME ================= */}

      <div className="
      bg-white
      border
      border-slate-200
      rounded-3xl
      shadow-sm
      p-6
      md:p-8
      space-y-5
      ">

        <div>

          <h2 className="
          text-2xl
          font-bold
          text-slate-800
          ">
            Category Name
          </h2>

          <p className="
          text-sm
          text-slate-500
          mt-1
          ">
            Update category title
          </p>

        </div>

        <Input
          value={categoryName}
          onChange={(e) =>
            setCategoryName(
              e.target.value
            )
          }
          className="
          h-14
          rounded-2xl
          border-slate-200
          bg-slate-50
          "
        />

      </div>

      {/* ================= SUBCATEGORY ================= */}

      <div className="
      bg-white
      border
      border-slate-200
      rounded-3xl
      shadow-sm
      p-6
      md:p-8
      space-y-6
      ">

        <div>

          <h2 className="
          text-2xl
          font-bold
          text-slate-800
          ">
            Sub Categories
          </h2>

          <p className="
          text-sm
          text-slate-500
          mt-1
          ">
            Add or remove subcategories
          </p>

        </div>

        {/* INPUT */}
        <div className="
        flex
        flex-col
        sm:flex-row
        gap-3
        ">

          <Input
            placeholder="Add subcategory..."
            value={newSubCategory}
            onChange={(e) =>
              setNewSubCategory(
                e.target.value
              )
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {
                handleAddSubCategory();
              }

            }}
            className="
            h-14
            rounded-2xl
            border-slate-200
            bg-slate-50
            "
          />

          <Button
            onClick={
              handleAddSubCategory
            }
            className="
            h-14
            px-8
            rounded-2xl
            bg-blue-600
            hover:bg-blue-700
            shadow-md
            "
          >
            Add
          </Button>

        </div>

        {/* TAGS */}
        {subCategories.length > 0 ? (

          <div className="
          flex
          flex-wrap
          gap-3
          ">

            {subCategories.map(
              (sub, index) => (

                <div
                  key={index}
                  className="
                  flex
                  items-center
                  gap-2
                  bg-slate-100
                  hover:bg-slate-200
                  border
                  border-slate-200
                  text-slate-700
                  px-4
                  py-2.5
                  rounded-2xl
                  transition
                  "
                >

                  <span className="
                  text-sm
                  font-medium
                  ">
                    {sub}
                  </span>

                  <button
                    onClick={() =>
                      handleRemoveSubCategory(
                        index
                      )
                    }
                    className="
                    w-5
                    h-5
                    rounded-full
                    hover:bg-red-100
                    hover:text-red-600
                    flex
                    items-center
                    justify-center
                    transition
                    "
                  >
                    <X size={13} />
                  </button>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="
          text-center
          py-10
          border
          border-dashed
          border-slate-200
          rounded-3xl
          text-slate-400
          ">
            No subcategories added
          </div>

        )}

      </div>

      {/* ================= ACTIONS ================= */}

      <div className="
sticky
bottom-0
bg-white/95
backdrop-blur-md
border-t
border-slate-200
p-4
rounded-b-3xl
z-20
">

        <div className="
        max-w-5xl
        mx-auto
        flex
        justify-between
        gap-4
        ">

          <Button
            variant="outline"
            onClick={
              handleDeleteCategory
            }
            className="
            h-12
            px-6
            rounded-2xl
            bg-red-600
            hover:bg-red-700
            border-none
            text-white
            shadow-sm
            "
          >

            <Trash2
              size={16}
              className="mr-2"
            />

            Delete

          </Button>

          <Button
            onClick={handleUpdate}
            className="
            h-12
            px-8
            rounded-2xl
            bg-blue-600
            hover:bg-blue-700
            shadow-md
            "
          >
            Update Category
          </Button>

        </div>

      </div>

    </div>

  );

};

export default EditCategory;
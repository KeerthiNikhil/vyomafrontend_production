import { useState } from "react";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { X, FolderPlus } from "lucide-react";

import { toast } from "sonner";

const AddCategory = () => {

  const [categoryName, setCategoryName] =
    useState("");

  const [
    subCategoryInput,
    setSubCategoryInput,
  ] = useState("");

  const [subCategories, setSubCategories] =
    useState<string[]>([]);

  /* ================= ADD ================= */

  const handleAddSubCategory = () => {

    const trimmed =
      subCategoryInput.trim();

    if (!trimmed) return;

    if (subCategories.includes(trimmed)) {

      toast.error("Already added");

      return;

    }

    setSubCategories([
      ...subCategories,
      trimmed,
    ]);

    setSubCategoryInput("");

  };

  /* ================= REMOVE ================= */

  const handleRemoveSubCategory = (
    index: number
  ) => {

    setSubCategories((prev) =>
      prev.filter((_, i) => i !== index)
    );

  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {

    if (!categoryName.trim()) {

      toast.error(
        "Enter category name"
      );

      return;

    }

    if (subCategories.length === 0) {

      toast.error(
        "Add at least one subcategory"
      );

      return;

    }

    try {

      await axios.post(
        "http://localhost:8000/api/v1/categories",
        {
          name: categoryName,
          subCategories,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      toast.success(
        "Category created successfully ✅"
      );

      setCategoryName("");

      setSubCategories([]);

      setSubCategoryInput("");

    } catch (err: any) {

      console.log(err.response?.data);

      toast.error(
        err.response?.data?.message ||
        "Failed ❌"
      );

    }

  };

  return (

    <div className="
    max-w-5xl
    mx-auto
    p-4
    md:p-6
    space-y-6
    pb-10
    ">

      {/* ================= HEADER ================= */}

      <div>

        <div className="
        flex
        items-center
        gap-3
        ">

          <div className="
          w-14
          h-14
          rounded-2xl
          bg-blue-100
          text-blue-600
          flex
          items-center
          justify-center
          ">

            <FolderPlus size={28} />

          </div>

          <div>

            <h1 className="
            text-3xl
            md:text-4xl
            font-black
            tracking-tight
            text-slate-900
            ">
              Add Category
            </h1>

            <p className="
            text-slate-500
            mt-1
            text-sm
            md:text-base
            ">
              Create categories and subcategories
            </p>

          </div>

        </div>

      </div>

      {/* ================= CATEGORY ================= */}

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
            Create your main category
          </p>

        </div>

        <Input
          placeholder="Example: Grocery, Electronics, Fashion..."
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
          focus-visible:ring-4
          focus-visible:ring-blue-100
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
            Add related sub categories
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
            placeholder="Enter subcategory name..."
            value={subCategoryInput}
            onChange={(e) =>
              setSubCategoryInput(
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
            focus-visible:ring-4
            focus-visible:ring-blue-100
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
            text-white
            font-semibold
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
          border
          border-dashed
          border-slate-200
          rounded-3xl
          py-12
          text-center
          bg-slate-50
          ">

            <div className="text-4xl">
              🧩
            </div>

            <p className="
            mt-3
            text-slate-500
            ">
              No subcategories added
            </p>

          </div>

        )}

      </div>

      {/* ================= FOOTER ================= */}

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
        justify-end
        ">

          <Button
            onClick={handleSubmit}
            className="
            h-12
            px-8
            rounded-2xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-semibold
            shadow-md
            "
          >
            Submit Category
          </Button>

        </div>

      </div>

    </div>

  );

};

export default AddCategory;
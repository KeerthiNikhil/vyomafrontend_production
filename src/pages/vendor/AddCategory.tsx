import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryInput, setSubCategoryInput] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>([]);

  // ✅ ADD SUBCATEGORY
  const handleAddSubCategory = () => {
    const trimmed = subCategoryInput.trim();
    if (!trimmed) return;

    if (subCategories.includes(trimmed)) {
      alert("Already added");
      return;
    }

    setSubCategories([...subCategories, trimmed]);
    setSubCategoryInput("");
  };

  // ✅ REMOVE
  const handleRemoveSubCategory = (index: number) => {
    setSubCategories((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ SUBMIT (🔥 FIXED)
  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      alert("Enter category name");
      return;
    }

    if (subCategories.length === 0) {
      alert("Add at least one subcategory");
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Category created ✅");

      setCategoryName("");
      setSubCategories([]);
    } catch (err: any) {
  console.log(err.response?.data); // 🔥 VERY IMPORTANT
  alert(err.response?.data?.message || "Failed ❌");
}
  };

  return (
  <div className="max-w-5xl mx-auto space-y-8 pb-20">

    {/* HEADER */}
    <div>
      <h1 className="text-3xl font-bold">Add Category</h1>

      <p className="text-slate-500 mt-1">
        Create product categories and subcategories
      </p>
    </div>

    {/* CATEGORY */}
    <div
      className="
      bg-white
      border border-slate-200
      rounded-3xl
      shadow-sm
      p-8
      space-y-5
    "
    >
      <div className="border-b border-slate-100 pb-4">
        <h2 className="font-semibold text-2xl text-slate-800">
          Category
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Create your main product category
        </p>
      </div>

      <Input
        placeholder="Enter Category Name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="
          h-14
          rounded-2xl
          border-slate-200
          focus-visible:ring-blue-200
        "
      />
    </div>

    {/* SUB CATEGORY */}
    <div
      className="
      bg-white
      border border-slate-200
      rounded-3xl
      shadow-sm
      p-8
      space-y-6
    "
    >
      <div className="border-b border-slate-100 pb-4">
        <h2 className="font-semibold text-2xl text-slate-800">
          Sub Categories
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Add related sub categories
        </p>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Enter Subcategory Name"
          value={subCategoryInput}
          onChange={(e) => setSubCategoryInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddSubCategory();
          }}
          className="
            h-14
            rounded-2xl
            border-slate-200
            focus-visible:ring-blue-200
          "
        />

        <Button
          onClick={handleAddSubCategory}
          className="
            px-8
            h-14
            rounded-2xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-medium
            shadow-sm
          "
        >
          Add
        </Button>
      </div>

      {/* LIST */}
      <div className="flex flex-wrap gap-3">
        {subCategories.map((sub, index) => (
          <div
            key={index}
            className="
              flex items-center gap-2
              bg-slate-100
              text-slate-700
              px-4 py-2
              rounded-2xl
              text-sm
              border border-slate-200
              hover:bg-slate-200
              transition
            "
          >
            {sub}

            <button
              onClick={() => handleRemoveSubCategory(index)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* SUBMIT */}
    <div className="flex justify-end">
      <Button
        onClick={handleSubmit}
        className="
          px-8
          h-12
          rounded-2xl
          bg-blue-600
          hover:bg-blue-700
          text-white
          font-medium
          shadow-sm
        "
      >
        Submit Category
      </Button>
    </div>

  </div>
);
};

export default AddCategory;
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "@/lib/axios";
import { toast } from "sonner";

const ShopImages = () => {

  const { id } = useParams();

  const [images, setImages] =
    useState<File[]>([]);

  const [loading, setLoading] =
    useState(false);

  const handleUpload = async () => {

    if (images.length === 0) {
      toast.error("Select images");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      images.forEach((img) => {
        formData.append(
          "shopImages",
          img
        );
      });

      await axios.post(
        `/shops/${id}/add-images`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Images uploaded successfully"
      );

      setImages([]);

    } catch (error: any) {

      toast.error(
        error.response?.data?.message ||
        "Upload failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="
    max-w-3xl
    mx-auto
    bg-white
    rounded-3xl
    p-8
    shadow-sm
    space-y-6
    ">

      <div>

        <h1 className="
        text-3xl
        font-bold
        ">
          Shop Images
        </h1>

        <p className="
        text-slate-500
        mt-2
        ">
          Upload additional shop banners
        </p>

      </div>

      {/* UPLOAD BOX */}

      <label className="block cursor-pointer">

        <div className="
        h-40
        rounded-3xl
        border-2
        border-dashed
        border-slate-300
        flex
        flex-col
        items-center
        justify-center
        bg-slate-50
        hover:border-blue-400
        hover:bg-blue-50
        transition
        ">

          <span className="text-4xl">
            🖼️
          </span>

          <p className="
          mt-3
          font-medium
          ">
            Upload Shop Images
          </p>

          <p className="
          text-sm
          text-slate-500
          ">
            JPG PNG WEBP
          </p>

        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {

            if (!e.target.files)
              return;

            setImages(
              Array.from(e.target.files)
            );
          }}
        />

      </label>

      {/* PREVIEW */}

      <div className="
      flex
      flex-wrap
      gap-4
      ">

        {images.map((img, index) => (

          <img
            key={index}
            src={URL.createObjectURL(img)}
            className="
            h-24
            w-24
            object-cover
            rounded-2xl
            border
            "
          />

        ))}

      </div>

      {/* BUTTON */}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="
        w-full
        h-12
        rounded-2xl
        bg-blue-600
        hover:bg-blue-700
        text-white
        font-medium
        "
      >

        {loading
          ? "Uploading..."
          : "Upload Images"}

      </button>

    </div>
  );
};

export default ShopImages;
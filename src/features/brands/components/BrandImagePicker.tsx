import { IconButton, Skeleton } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useBrandImage } from "../hooks/useBrandImage";
import { LazyLoadImage } from "react-lazy-load-image-component";

const BrandImagePicker = ({ initialImage }: { initialImage?: string }) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { image, removeImage, setImage } = useBrandImage();

  useEffect(() => {
    const fetchImage = async (url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        const blob = await response.blob();
        const file = new File([blob], "initial-image", { type: blob.type });
        setImage({ file, url });
      } catch (error) {
        console.error("Error fetching initial image:", error);
        setError("Failed to load initial image");
      } finally {
        setIsLoading(false);
      }
    };
    if (initialImage) {
      fetchImage(initialImage);
    }
  }, [initialImage, setImage]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setError(null);
        const imageUrl = URL.createObjectURL(file);
        setImage({ file, url: imageUrl });
      } else {
        setError("Please select a valid image file.");
      }
    }
    event.target.value = "";
  };

  const handleEditImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && file.type === "image/*") {
        const imageUrl = URL.createObjectURL(file);
        setImage({ file, url: imageUrl });
      }
    };
    input.click();
  };

  return (
    <div className="flex w-full items-center justify-center rounded-3xl border-4 border-dashed border-slate-300 p-5">
      {isLoading && <Skeleton className="h-72 w-72" />}
      {image && (
        <div className="group relative h-72 w-72">
          <LazyLoadImage
            src={image.url}
            alt="Selected image"
            className="h-full w-full object-contain"
          />
          <div className="absolute inset-0 hidden items-center justify-center gap-5 bg-black/50 group-hover:flex">
            <IconButton
              aria-label="Pick a different image"
              icon={<MdEdit className="text-lg" />}
              size="sm"
              onClick={() => handleEditImage()}
            />
            <IconButton
              aria-label="Delete the image"
              icon={<FaTrash className="text-lg text-red-600" />}
              size="sm"
              onClick={() => {
                removeImage();
              }}
            />
          </div>
        </div>
      )}
      {!isLoading && !image && (
        <IconButton
          aria-label="Upload image"
          icon={<FaPlus className="text-4xl" />}
          size="sm"
          onClick={handleUploadClick}
        />
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default BrandImagePicker;

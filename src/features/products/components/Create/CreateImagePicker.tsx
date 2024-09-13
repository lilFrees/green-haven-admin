import { IconButton } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useCreateImageStore } from "../../hooks/useCreateImageStore";

function CreateImagePicker() {
  const [error, setError] = useState<string | null>(null);
  const { images, addImage, removeImage, updateImage } = useCreateImageStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setError(null);
        const imageUrl = URL.createObjectURL(file);
        addImage({ file, url: imageUrl });

        event.target.value = "";
      } else {
        setError("Please select a WebP image file.");
        event.target.value = "";
      }
    }
  };

  const handleEditImage = (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/webp";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && file.type === "image/webp") {
        const imageUrl = URL.createObjectURL(file);
        updateImage(index, { file, url: imageUrl });
      }
    };
    input.click();
  };

  return (
    <div className="flex w-full gap-5 overflow-x-auto border border-dashed border-slate-300 p-5">
      {images.map((image, index) => (
        <div
          key={index}
          className="group relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden bg-slate-200"
        >
          <LazyLoadImage
            src={image.url}
            alt={`No Image Found ${index}`}
            className="h-full w-full object-cover"
            effect="opacity"
          />
          <div className="absolute inset-0 hidden items-center justify-center bg-black/50 group-hover:block">
            <div className="flex h-full w-full items-center justify-center gap-2">
              <IconButton
                aria-label="Pick a different image"
                icon={<MdEdit className="text-lg" />}
                size="sm"
                onClick={() => handleEditImage(index)}
              />
              <IconButton
                aria-label="Delete the image"
                icon={<FaTrash className="text-lg text-red-600" />}
                size="sm"
                onClick={() => {
                  removeImage(index);
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <div
        className="flex h-32 w-32 shrink-0 cursor-pointer items-center justify-center bg-slate-200"
        onClick={handleUploadClick}
      >
        <FaPlus className="text-3xl text-slate-500" />
        <input
          className="hidden"
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          accept="image/*"
        />
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}

export default CreateImagePicker;

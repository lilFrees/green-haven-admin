import { create, StoreApi, UseBoundStore } from "zustand";

type ImageItem = {
  file: File;
  url: string;
};

type ImageStore = {
  images: ImageItem[];
  setImages: (images: ImageItem[]) => void;
  addImage: (image: ImageItem) => void;
  removeImage: (index: number) => void;
  updateImage: (index: number, newImage: ImageItem) => void;
};

type SignleImageStore = {
  image: ImageItem | null;
  setImage: (image: ImageItem | null) => void;
  removeImage: () => void;
};

export function createImageStore(
  type: "single",
): UseBoundStore<StoreApi<SignleImageStore>>;
export function createImageStore(
  type: "multiple",
): UseBoundStore<StoreApi<ImageStore>>;
export function createImageStore(): UseBoundStore<StoreApi<ImageStore>>;
export function createImageStore(type?: "single" | "multiple") {
  if (type === "single") {
    return create<SignleImageStore>((set) => ({
      image: null,
      setImage: (image) => set({ image }),
      removeImage: () => set({ image: null }),
    }));
  } else {
    return create<ImageStore>((set) => ({
      images: [],
      setImages: (images) => set({ images }),
      addImage: (image) =>
        set((state) => ({ images: [...state.images, image] })),
      removeImage: (index) =>
        set((state) => ({
          images: state.images.filter((_, i) => i !== index),
        })),
      updateImage: (index, newImage) =>
        set((state) => ({
          images: state.images.map((img, i) => (i === index ? newImage : img)),
        })),
    }));
  }
}

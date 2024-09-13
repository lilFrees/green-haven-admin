import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getBrandById } from "../services/brand-service";
import { IconButton } from "@chakra-ui/react";
import { FaChevronLeft } from "react-icons/fa";
import BrandUpdateForm from "../components/BrandUpdateForm";
import BrandImagePicker from "../components/BrandImagePicker";

function UpdateBrandPage() {
  const { brandId } = useParams();

  const { data: brand, isLoading } = useQuery({
    queryKey: ["brand", brandId],
    queryFn: async () => {
      if (!brandId) return;
      const brand = await getBrandById(+brandId);
      return brand;
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-10">
        <Link to="/categories">
          <IconButton aria-label="Edit" icon={<FaChevronLeft />} />
        </Link>
        <h1 className="text-2xl font-bold">Edit brand details</h1>
      </div>
      <div className="font-bold">Brand's logo</div>
      <BrandImagePicker initialImage={brand?.image} />
      <BrandUpdateForm brand={brand} isLoading={isLoading} />
    </div>
  );
}

export default UpdateBrandPage;

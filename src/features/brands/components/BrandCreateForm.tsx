import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useBrandImage } from "../hooks/useBrandImage";

const schema = z.object({
  brand_name: z.string().min(1),
});

type BrandData = z.infer<typeof schema>;

function BrandCreateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BrandData>({
    resolver: zodResolver(schema),
  });

  const { removeImage } = useBrandImage();

  useEffect(() => {
    return removeImage;
  }, [removeImage]);

  async function onSubmit(data: BrandData) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FormControl isInvalid={!!errors.brand_name}>
        <FormLabel htmlFor="brand">Name of the brand</FormLabel>
        <Input {...register("brand_name")} id="brand" />
        <FormErrorMessage>{errors.brand_name?.message}</FormErrorMessage>
      </FormControl>
      <Button
        colorScheme="green"
        type="submit"
        className="w-max"
        isLoading={isSubmitting}
      >
        Create
      </Button>
    </form>
  );
}

export default BrandCreateForm;

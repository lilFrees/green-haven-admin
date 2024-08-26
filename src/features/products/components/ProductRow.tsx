import { IconButton, Switch, Td, Tr, Tooltip } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { IProduct } from "../interfaces/IProduct";
import { memo } from "react";
import { toggleActiveStatus } from "../services/products-service";

const ProductRow = memo(({ product }: { product: IProduct }) => {
  const [isChecked, setIsChecked] = useState(product.is_active);

  const handleToggle = useCallback(async () => {
    await toggleActiveStatus(product.id, !isChecked);
    setIsChecked(!isChecked);
  }, [isChecked, product.id]);

  return (
    <Tr>
      <Td>{product.id}</Td>
      <Td>
        <div className="h-9 w-9">
          <LazyLoadImage
            src={product.thumbnail}
            className="h-full w-full object-contain"
            alt={product.title}
            effect="opacity"
          />
        </div>
      </Td>
      <Td className="block w-[14rem] overflow-hidden overflow-ellipsis whitespace-nowrap">
        <span tabIndex={0}>
          <Tooltip hasArrow label={product.title} aria-label="product-title">
            {product.title}
          </Tooltip>
        </span>
      </Td>
      <Td>${product.price}</Td>
      <Td>{product.brand}</Td>
      <Td>
        <Switch
          isChecked={isChecked}
          onChange={handleToggle}
          colorScheme="green"
        />
      </Td>
      <Td display="flex" gap="10px">
        <IconButton aria-label="edit-product" icon={<MdEdit />} size="sm" />
        <IconButton
          aria-label="delete-product"
          icon={<FaTrashAlt />}
          colorScheme="red"
          size="sm"
        />
      </Td>
    </Tr>
  );
});

export default ProductRow;

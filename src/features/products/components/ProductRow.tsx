import {
  Button,
  IconButton,
  Switch,
  Td,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { memo, useCallback, useRef, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import {
  deleteProduct,
  toggleActiveStatus,
} from "../services/products-service";
import { IAdminProduct } from "../interfaces/IAdminProducts";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

const ProductRow = memo(function ProductRow({
  product,
}: {
  product: IAdminProduct;
}) {
  const [isChecked, setIsChecked] = useState(product.is_active);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const toast = useToast();

  const handleToggle = useCallback(async () => {
    await toggleActiveStatus(product.product_id, !isChecked);
    setIsChecked(!isChecked);
  }, [isChecked, product.product_id]);

  async function closeHandler() {
    const res = await deleteProduct(product.product_id);
    if (res) {
      toast({
        title: "Product Deleted",
        description: `${product.product_name} has been deleted.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "An error occurred.",
        description: "Unable to delete product.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  }

  return (
    <Tr>
      <Td>{product.product_id}</Td>
      <Td>
        <div className="relative h-9 w-9">
          <img
            src={product.thumbnail}
            className="h-full w-full object-contain"
            alt={product.product_name}
            // effect="opacity"
          />
        </div>
      </Td>
      <Td>
        <Link
          to={`/products/${product.product_id}`}
          className="block max-w-[14rem]"
        >
          <Tooltip
            hasArrow
            label={product.product_name}
            aria-label="product-title"
          >
            <span className="block truncate">{product.product_name}</span>
          </Tooltip>
        </Link>
      </Td>
      <Td>${product.price}</Td>
      <Td>{product.brand_name}</Td>
      <Td>{product.category_name}</Td>
      <Td>
        <Switch
          isChecked={isChecked}
          onChange={handleToggle}
          colorScheme="green"
        />
      </Td>
      <Td>
        <div className="flex gap-2">
          <Link to={`/products/${product.product_id}`}>
            <IconButton aria-label="edit-product" icon={<MdEdit />} size="sm" />
          </Link>
          <IconButton
            aria-label="delete-product"
            icon={<FaTrashAlt />}
            colorScheme="red"
            size="sm"
            onClick={onOpen}
          />
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            blockScrollOnMount
            motionPreset="slideInTop"
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Product {product.product_name}
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? You can't undo this action afterwards.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={closeHandler} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </div>
      </Td>
    </Tr>
  );
});

export default ProductRow;

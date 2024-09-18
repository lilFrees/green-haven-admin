import { Card, Image, Tooltip } from "@chakra-ui/react";
import { IAdminOrderItem } from "../interfaces/IOrder";
import { FaXmark } from "react-icons/fa6";

function ItemsList({
  items,
  isLoading,
}: {
  items?: IAdminOrderItem[] | undefined;
  isLoading?: boolean;
}) {
  if (!items) return null;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex w-full flex-col gap-5">
      {items.map((item) => (
        <Card
          className="h-20 overflow-hidden"
          gap={10}
          direction="row"
          size="sm"
          key={item.order_item_id}
          variant="outline"
        >
          <Image
            src={item.product_thumbnail}
            alt="Product image"
            className="h-full w-20 object-cover"
          />
          <div className="flex w-full items-center p-5">
            <h3 className="basis-2/5 truncate text-lg">
              <Tooltip label={item.product_name} aria-label="Product name">
                {item.product_name}
              </Tooltip>
            </h3>
            <p className="grow font-medium">${item.price}</p>
            <p className="font-bold">X&nbsp;{item.quantity}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default ItemsList;

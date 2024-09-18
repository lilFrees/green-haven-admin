import {
  useToast,
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import ErrorMessage from "../../../shared/components/ErrorMessage";
import { IAdminOrder, OrderStatus } from "../interfaces/IOrder";
import { getItemsByOrderId, updateOrder } from "../services/order-service";
import ItemsList from "./ItemsList";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  status: z.string().min(1),
});

function OrderForm({ order }: { order?: IAdminOrder | undefined }) {
  const toast = useToast();
  const navigate = useNavigate();
  const orderStatus = Object.values(OrderStatus);

  type OrderProp = {
    status: (typeof orderStatus)[number];
  };

  const { data: items, isLoading } = useQuery({
    queryKey: ["order", order],
    queryFn: async () => {
      if (!order) return;
      const items = await getItemsByOrderId(order.order_id);

      if (!items) {
        throw new Error("Order not found");
      }

      return items;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<OrderProp>({
    resolver: zodResolver(schema),
  });

  if (!order || (!items && !isLoading)) {
    return <ErrorMessage message="Order is not found" />;
  }

  async function onSubmit() {
    if (!order) return;
    const result = await updateOrder(order?.order_id, getValues("status"));
    if (result) {
      toast({
        title: "Order updated successfully",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
      navigate("/orders");
    } else {
      toast({
        title: "Failed to update the order",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-h-full w-full flex-col gap-5"
    >
      <FormControl isInvalid={!!errors.status}>
        <FormLabel htmlFor="status" className="text-xl">
          Status
        </FormLabel>
        <Select
          colorScheme="green"
          id="status"
          defaultValue={order.order_status}
          {...register("status")}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="shipped">Shipped</option>
        </Select>
        <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
      </FormControl>
      <h2 className="text-xl">Products:</h2>
      <div className="max-h-96 w-full overflow-auto">
        <ItemsList items={items} isLoading={isLoading} />
      </div>
      <Button
        isLoading={isSubmitting}
        colorScheme="green"
        className="ml-auto mt-auto w-max"
        type="submit"
      >
        Update the order
      </Button>
    </form>
  );
}

export default OrderForm;

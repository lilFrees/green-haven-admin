import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import ErrorMessage from "../../../shared/components/ErrorMessage";
import OrderForm from "../components/OrderForm";
import { getOrderById } from "../services/order-service";

function OrderDetails() {
  const { orderId } = useParams();

  const {
    data: order,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) return;
      const order = await getOrderById(orderId);

      if (!order) {
        throw new Error("Order not found");
      }

      return order;
    },
  });

  if (!orderId || !!error) {
    return <ErrorMessage message="Order is not found" />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-full flex-col">
      <h1 className="text-3xl font-bold">Order Details</h1>
      <OrderForm order={order} />
    </div>
  );
}

export default OrderDetails;

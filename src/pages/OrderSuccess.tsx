import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {

  const navigate = useNavigate();

  const handleContinueShopping = () => {

    navigate("/");

  };

  const handleViewOrders = () => {

    navigate("/orders");

  };

  return (

    <div className="
    max-w-3xl
    mx-auto
    px-6
    py-20
    text-center
    ">

      <h2 className="
      text-2xl
      font-bold
      text-green-600
      mb-4
      ">
        ✅ Order placed, thank you!
      </h2>

      <p className="
      text-gray-600
      mb-8
      ">
        Your order will be delivered soon.
      </p>

      <div className="
      flex
      justify-center
      gap-4
      flex-wrap
      ">

        <Button onClick={handleContinueShopping}>
          Continue Shopping
        </Button>

        <Button
          variant="outline"
          onClick={handleViewOrders}
        >
          View Orders
        </Button>

      </div>

    </div>

  );

};

export default OrderSuccess;
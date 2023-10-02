import { useLocation } from "react-router-dom";

const OrderSuccess = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div>
            <h2>Order Successful</h2>
            <p>Your order with id: {orderId} is received. Thank you.</p>
        </div>
    );
}

export default OrderSuccess
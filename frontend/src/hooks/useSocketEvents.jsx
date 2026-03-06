import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMyOrder, updateRealTimeOrderStatus } from "../redux/userSlice";
import { useSocket } from "../context/SocketContext";

export const useSocketEvents = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket || !userData) return;

        // Listen for new orders (for owners)
        const handleNewOrder = (orderData) => {
            console.log("📦 New order received:", orderData);
            if (userData.role === "owner") {
                dispatch(addMyOrder(orderData));
            }
        };

        // Listen for order status updates
        const handleStatusUpdate = (statusData) => {
            console.log("🔄 Order status updated:", statusData);
            dispatch(updateRealTimeOrderStatus({
                orderId: statusData.orderId,
                shopId: statusData.shopId,
                status: statusData.status
            }));
        };

        // Listen for delivery assignment
        const handleNewAssignment = (assignmentData) => {
            console.log("🚚 New delivery assignment:", assignmentData);
            if (userData.role === "deliveryBoy") {
                // This will be handled by DeliveryBoy component
            }
        };

        socket.on("newOrder", handleNewOrder);
        socket.on("update-status", handleStatusUpdate);
        socket.on("newAssignment", handleNewAssignment);

        return () => {
            socket.off("newOrder", handleNewOrder);
            socket.off("update-status", handleStatusUpdate);
            socket.off("newAssignment", handleNewAssignment);
        };
    }, [socket, userData, dispatch]);
};

export default useSocketEvents;

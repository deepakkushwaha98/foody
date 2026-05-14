import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeUserId, setActiveUserId] = useState(null);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, ordersRes, shopsRes, assignmentRes] = await Promise.all([
        axios.get(`${serverUrl}/api/admin/users`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/admin/orders`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/admin/shops`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/admin/delivery`, { withCredentials: true }),
      ]);

      setUsers(usersRes.data.users || []);
      setOrders(ordersRes.data.orders || []);
      setShops(shopsRes.data.shops || []);
      setAssignments(assignmentRes.data.data || []);
      setError(null);
    } catch (err) {
      console.error("Admin dashboard load error", err);
      setError(err?.response?.data?.message || err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeUser = useMemo(() => {
    return users.find((u) => u._id === activeUserId);
  }, [users, activeUserId]);

  const userOrders = useMemo(() => {
    if (!activeUser) return [];
    return orders.filter((order) => String(order.user?._id) === String(activeUser._id));
  }, [orders, activeUser]);

  const userShops = useMemo(() => {
    if (!activeUser) return [];
    return shops.filter((shop) => String(shop.owner?._id) === String(activeUser._id));
  }, [shops, activeUser]);

  const userAssignments = useMemo(() => {
    if (!activeUser) return [];
    return assignments.filter((a) => String(a.assignedTo?._id) === String(activeUser._id));
  }, [assignments, activeUser]);

  const updateOrderStatus = async (orderId, shopId, status) => {
    try {
      await axios.put(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      );

      // Refresh local order state
      setOrders((prev) =>
        prev.map((order) => {
          if (String(order._id) !== String(orderId)) return order;
          return {
            ...order,
            shopOrders: order.shopOrders.map((shopOrder) => {
              if (String(shopOrder._id) !== String(shopId) && String(shopOrder.shop) !== String(shopId)) {
                return shopOrder;
              }
              return {
                ...shopOrder,
                status,
              };
            }),
          };
        })
      );
    } catch (err) {
      console.error("Failed to update order status", err);
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  const renderUserRow = (user, index) => {
    const address =
      user.address ||
      (user.location?.coordinates && user.location.coordinates.length === 2
        ? `${user.location.coordinates[1]}, ${user.location.coordinates[0]}`
        : "N/A");

    return (
      <tr key={user._id} className={activeUserId === user._id ? "bg-orange-50" : ""}>
        <td className='px-3 py-2 text-sm'>{index + 1}</td>
        <td className='px-3 py-2 text-sm'>{user.fullName}</td>
        <td className='px-3 py-2 text-sm'>{user.email}</td>
        <td className='px-3 py-2 text-sm'>{user.mobile}</td>
        <td className='px-3 py-2 text-sm break-words'>{address}</td>
        <td className='px-3 py-2 text-sm'>
          <button
            className='text-white bg-[#ff4d2d] px-3 py-1 rounded hover:bg-[#e64323]'
            onClick={() => setActiveUserId(user._id)}
          >
            View
          </button>
        </td>
      </tr>
    );
  };

  const renderOrder = (order) => {
    if (!order) return null;

    return (
      <div key={order._id} className='bg-black border rounded-lg p-4 mb-4  shadow-sm'>
        <div className='flex items-center justify-between mb-2'>
          <div>
            <p className='font-semibold'>Order ID: {order._id}</p>
            <p className='text-xs text-gray-500'>Created: {formatDate(order.createdAt)}</p>
          </div>
          <p className='text-sm'>Total: ₹{order.totalAmount}</p>
        </div>

        {order.shopOrders?.map((shopOrder) => {
          const shopName = shopOrder.shop?.name || "Unknown shop";
          const shopAddress = shopOrder.shop?.address;
          const deliveryBoy = shopOrder.assignedDeliveryBoy;
          const shopOwner = shopOrder.shop?.owner || shopOrder.owner;

          return (
            <div key={shopOrder._id} className='border border-gray-200 rounded-lg p-3 mb-3'>
              <div className='flex flex-wrap justify-between gap-3 items-center mb-2'>
                <div>
                  <p className='font-semibold'>{shopName}</p>
                  {shopAddress && <p className='text-xs text-gray-500'>{shopAddress}</p>}
                  <p className='text-xs text-gray-500'>Owner: {shopOwner?.fullName || "-"}</p>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                  <label className='text-xs font-medium text-gray-600'>Status</label>
                  <select
                    value={shopOrder.status}
                    onChange={(e) => updateOrderStatus(order._id, shopOrder._id, e.target.value)}
                    className='border rounded px-2 py-1 text-sm'
                  >
                    <option value='pending'>pending</option>
                    <option value='preparing'>preparing</option>
                    <option value='out of delivery'>out of delivery</option>
                    <option value='delivered'>delivered</option>
                  </select>
                </div>
              </div>

              <div className='text-sm mb-2'>
                <p className='flex flex-wrap items-center gap-2'>
                  <span className="text-gray-500">
                    Delivery Boy: {deliveryBoy ? deliveryBoy.fullName : "Not assigned"}
                    {deliveryBoy && <span className='text-gray-500 ml-2'>({deliveryBoy.mobile})</span>}
                  </span>
                  {deliveryBoy && (
                    <button
                      className='text-xs text-blue-600 hover:underline'
                      onClick={() => setActiveUserId(deliveryBoy._id)}
                    >
                      View profile
                    </button>
                  )}
                </p>
                {shopOrder.deliveredAt && (
                  <p className='text-xs text-gray-500'>Delivered: {formatDate(shopOrder.deliveredAt)}</p>
                )}
              </div>

              <div className='grid gap-2 md:grid-cols-2'>
                {shopOrder.shopOrderItem?.map((item) => {
                  const itemData = item.item || {};
                  const imageUrl = item.image || itemData.image || "https://via.placeholder.com/56?text=No+Image";
                  const itemName = item.name || itemData.name || "Unknown item";

                  return (
                    <div
                      key={item._id || itemData._id || itemName}
                      className='flex gap-3 items-center border rounded p-2'
                    >
                      <img
                        src={imageUrl}
                        alt={itemName}
                        className='w-14 h-14 object-cover rounded bg-gray-100'
                      />
                      <div>
                        <p className='font-medium'>{itemName}</p>
                        <p className='text-xs text-gray-500'>Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {shopOwner && (
                <div className='mt-3'>
                  <button
                    className='text-xs text-blue-600 hover:underline'
                    onClick={() => setActiveUserId(shopOwner._id)}
                  >
                    View shop owner profile
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className='p-8'>
        <p>Loading admin dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-8'>
        <p className='text-red-600'>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#fff9f6] p-6'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold mb-4'>Admin dashboard</h1>

        <div className='grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-6'>
          <div className='bg-white border rounded-lg shadow-sm p-4'>
            <h2 className='text-xl font-semibold mb-4'>Users</h2>
            <div className='overflow-x-auto'>
              <table className='min-w-full text-left text-sm'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-3 py-2'>S.No</th>
                    <th className='px-3 py-2'>Name</th>
                    <th className='px-3 py-2'>Email</th>
                    <th className='px-3 py-2'>Mobile</th>
                    <th className='px-3 py-2'>Address</th>
                    <th className='px-3 py-2'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(renderUserRow)}
                </tbody>
              </table>
            </div>
          </div>

          <div className='bg-white border rounded-lg shadow-sm p-4'>
            <h2 className='text-xl font-semibold mb-4'>Details</h2>
            {!activeUser ? (
              <p className='text-gray-600'>Select a user to see details.</p>
            ) : (
              <>
                <div className='space-y-2 mb-6'>
                  <p className='text-sm'>
                    <span className='font-semibold'>Name:</span> {activeUser.fullName}
                  </p>
                  <p className='text-sm'>
                    <span className='font-semibold'>Email:</span> {activeUser.email}
                  </p>
                  <p className='text-sm'>
                    <span className='font-semibold'>Mobile:</span> {activeUser.mobile}
                  </p>
                  <p className='text-sm'>
                    <span className='font-semibold'>Role:</span> {activeUser.role}
                  </p>
                </div>

                {userShops.length > 0 && (
                  <div className='mb-6'>
                    <h3 className='font-semibold mb-2'>Owned Shops</h3>
                    <ul className='space-y-2'>
                      {userShops.map((shop) => (
                        <li key={shop._id} className='border p-2 rounded'>
                          <p className='font-medium'>{shop.name}</p>
                          <p className='text-xs text-gray-500'>{shop.address}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {userOrders.length > 0 ? (
                  <div className='mb-6'>
                    <h3 className='font-semibold mb-2'>User Orders</h3>
                    {userOrders.map(renderOrder)}
                  </div>
                ) : (
                  <p className='text-gray-500'>This user has not placed any orders.</p>
                )}

                {userAssignments.length > 0 && (
                  <div>
                    <h3 className='font-semibold mb-2'>Delivery Assignments</h3>
                    <ul className='space-y-2'>
                      {userAssignments.map((assignment) => (
                        <li key={assignment._id} className='border rounded p-3'>
                          <p className='text-sm font-semibold'>Assignment ID: {assignment._id}</p>
                          <p className='text-xs text-gray-500'>Order: {assignment.order?._id}</p>
                          <p className='text-xs text-gray-500'>Status: {assignment.status}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

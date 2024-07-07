import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetOrdersQuery, useDeleteOrderByIdMutation } from '../../redux/api/orderApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import AdminMenu from './AdminMenu';
import { AiFillDelete } from 'react-icons/ai';

const OrderList = () => {
  const [forceRefreshKey, setForceRefreshKey] = useState(0);
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [deleteOrderById, { isLoading: isCanceling, error: cancelError }] = useDeleteOrderByIdMutation();

  useEffect(() => {
    refetch();
  }, [forceRefreshKey, refetch]);
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await deleteOrderById(orderId);
        setForceRefreshKey(prevKey => prevKey + 1);
      } catch (err) {
        console.error('Failed to cancel the order:', err);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="container mx-auto">
          <AdminMenu />
          {cancelError && (
            <Message variant="danger">
              {cancelError?.data?.message || cancelError.error}
            </Message>
          )}
          <table className="w-full border">
            <thead>
              <tr className="mb-[5rem]">
                <th className="text-left pl-1">ITEMS</th>
                <th className="text-left pl-1">ID</th>
                <th className="text-left pl-1">USER</th>
                <th className="text-left pl-1">DATE</th>
                <th className="text-left pl-1">TOTAL</th>
                <th className="text-left pl-1">PAID</th>
                <th className="text-left pl-1">DELIEVERY</th>
                <th className="text-left pl-1">DELETE</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img src={order.orderItems[0].image} alt={order._id} className="w-[5rem] pt-4" />
                  </td>
                  <td>{order._id}</td>
                  <td>{order.user ? order.user.username : 'N/A'}</td>
                  <td>{order.createdAt ? order.createdAt.substring(0, 10) : 'N/A'}</td>
                  <td>Rs {order.totalPrice}</td>
                  <td className="py-2">
                    {order.isPaid ? (
                      <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">Completed</p>
                    ) : (
                      <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">Pending</p>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {order.isDelivered ? (
                      <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">Completed</p>
                    ) : (
                      <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">Pending</p>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="ml-4 bg-red-500 text-white p-2 rounded"
                      disabled={isCanceling}
                    >
                      <AiFillDelete />
                    </button>
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`}>
                      More
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default OrderList;

import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { clearCartItems } from "../../redux/Features/cart/cartSlice"; // Ensure correct import path

import KhaltiCheckout from "khalti-checkout-web"; // Import Khalti Checkout
import { KHALTI_PUBLIC_KEY } from "../../redux/constants";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
<<<<<<< HEAD
  const [delievered, setDelievered] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
=======

>>>>>>> parent of e7708ff (Merge branch 'main' of https://github.com/aryanajay07/SajiloMartt)
  useEffect(() => {
    if (order && !order.isPaid) {
      const khaltiConfig = {
        publicKey: KHALTI_PUBLIC_KEY,
        productIdentity: order._id,
        productName: "Order from SajiloMart",
        productUrl: window.location.href,
        eventHandler: {
          onSuccess: (payload) => {
            console.log("Khalti Success Payload:", payload);
            if (!payload.idx) {
              console.error("Missing payload properties:", payload);
              toast.error("Invalid payment details received.");
              return;
            }
            dispatch(clearCartItems());
            payOrderHandler(payload);
          },
          onError: (error) => {
            console.error("Khalti Error:", error);
            toast.error("Payment failed. Please try again.");
          },
          onClose: () => {
            console.log("Widget is closing");
          },
        },
        paymentPreference: [
          "KHALTI",
          "EBANKING",
          "MOBILE_BANKING",
          "CONNECT_IPS",
          "SCT",
        ],
      };

      const checkout = new KhaltiCheckout(khaltiConfig);
      window.khaltiCheckout = checkout;
    }
  }, [order]);

  const payOrderHandler = async (payload) => {
    try {
      await payOrder({ orderId, details: payload });
      refetch();
      toast.success("Order is paid");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  const cashOnDeliverHandler = async () => {
    setIsPaid(true);
    await deliverOrder(orderId);
    setDelievered(true)
    refetch();
  };
  const cashOnDelievery = async () => {

  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">Cannot find order</Message>
  ) : (
<<<<<<< HEAD
    <div className="container mx-auto flex flex-col ml-[10rem] md:flex-row">
=======
    <div className="container flex flex-col  md:flex-row">
>>>>>>> parent of e7708ff (Merge branch 'main' of https://github.com/aryanajay07/SajiloMartt)
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto pl-10 ">
              <table className="w-[80%] ">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>
                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">{item.price}</td>
                      <td className="p-2 text-center">
                        Rs {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong> {order.user.username}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong> {order.paymentMethod}
          </p>
          {order.isPaid ? (
            <Message variant="success">Paid on {order.paidAt}</Message>
          ) : (
            <Message variant="danger">Not paid</Message>
          )}
        </div>
        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
<<<<<<< HEAD
        <div className="  mr-20 ">
          <div className="flex justify-between mb-2">
            <span>Items</span>
            <span>Rs {order.itemsPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>Rs {order.shippingPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax</span>
            <span>Rs {order.taxPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total</span>
            <span>Rs{order.totalPrice}</span>
          </div>
          {userInfo.role === "customer " && !order.isPaid && order.paymentMethod === "Khalti" ? (
            <div>
              {loadingPay && <Loader />}
              <button
                type="button"
                className="bg-pink-500 text-white w-full py-2"
                onClick={() => window.khaltiCheckout.show({ amount: order.totalPrice * 100 })} // Khalti requires amount in paisa
              >
                Pay with Khalti
              </button>
            </div>
          ) :
            <div>
              {loadingPay && <Loader />}
              <button
                type="button"
                className="bg-pink-500 text-white w-full py-2"
                onClick={cashOnDelievery}
              >
                Cash On deleivery
              </button>
            </div>
          }

          {loadingDeliver && <Loader />}

          {userInfo && userInfo.role === 'vendor' && order.isPaid && !order.isDelivered && (order.paymentMethod === "Khalti" ? (
            <div>
              <button
                type="button"
                className="bg-pink-500 text-white w-full py-2"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            </div>
          ) :
            <div>
              <button
                type="button"
                className="bg-pink-500 text-white w-full py-2"
                onClick={cashOnDeliverHandler}
              >
                Recieved Cash and Delivered
              </button>
            </div>)}
          {userInfo && order.isPaid && order.isDelivered && (
            <Message variant="success">Delievered on {order.deliveredAt}</Message>
          )}
=======
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>Rs {order.itemsPrice}</span>
>>>>>>> parent of e7708ff (Merge branch 'main' of https://github.com/aryanajay07/SajiloMartt)
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>Rs {order.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>Rs {order.taxPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>Rs{order.totalPrice}</span>
        </div>
        {!order.isPaid && (
          <div>
            {loadingPay && <Loader />}
            <button
              type="button"
              className="bg-pink-500 text-white w-full py-2"
              onClick={() => window.khaltiCheckout.show({ amount: order.totalPrice * 100 })} // Khalti requires amount in paisa
            >
              Pay with Khalti
            </button>
          </div>
        )}
        {loadingDeliver && <Loader />}
        {userInfo && userInfo.role === 'vendor' && order.isPaid && !order.isDelivered && (
          <div>
            <button
              type="button"
              className="bg-pink-500 text-white w-full py-2"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;

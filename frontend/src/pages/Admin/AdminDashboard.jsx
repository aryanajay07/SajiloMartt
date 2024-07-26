import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import { useSelector } from 'react-redux';
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import { Link } from 'react-router-dom';
import moment from 'moment';

const AdminDashboard = () => {
  const { data: sales, isLoading: salesLoading } = useGetTotalSalesQuery();
  const { data: products, isLoading: productsLoading } = useAllProductsQuery();
  const { data: users, isLoading: usersLoading, error } = useGetUsersQuery();
  const { data: orders, isLoading: ordersLoading } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();
  const { userInfo } = useSelector((state) => state.auth);

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  const filteredProducts = products
    ?.filter((product) => product.vendor === userInfo._id && (product.salesCount || 0) > 0)
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)) || [];

  const filteredUsers = (users || [])
    .filter(user => (user.orderCount || 0) > 0) // Filter out users with zero orders
    .slice() // Create a shallow copy of the array
    .sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0)); // Sort by orderCount
  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-[0rem]">
        <div className="w-[80%] flex justify-around flex-wrap">
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              Rs
            </div>
            <p className="mt-5">Sales</p>
            <h1 className="text-xl font-bold">
              Rs {salesLoading ? <Loader /> : sales?.totalSales.toFixed(2)}
            </h1>
          </div>
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              $
            </div>
            <p className="mt-5">Customers</p>
            <h1 className="text-xl font-bold">
              {usersLoading ? <Loader /> : users?.length}
            </h1>
          </div>
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
            </div>
            <p className="mt-5">All Orders</p>
            <h1 className="text-xl font-bold">
              {ordersLoading ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>
        <div>
          <h1>Top Sales</h1>
          {productsLoading ? (
            <Loader />
          ) : (
            filteredProducts.map((product) => (
              <div className="flex mt-6" key={product._id}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-[10rem] object-cover"
                />
                <div className="p-4 flex flex-col justify-around">
                  <div className="flex justify-between">
                    <h5 className="text-xl font-semibold mb-2">
                      {product?.name}
                    </h5>
                    <h5 className="text-xl font-semibold mb-2">
                      sales: {product?.salesCount}
                    </h5>
                    <p className="text-gray-400 text-xs">
                      {moment(product.createdAt).format("MMMM Do YYYY")}
                    </p>
                  </div>
                  <p className="text-gray-400 xl:w-[30rem] lg:w-[30rem] md:w-[20rem] sm:w-[10rem] text-sm mb-4">
                    {product?.description?.substring(0, 160)}...
                  </p>
                  <div className="flex justify-between">
                    {userInfo.role === "vendor" ? (
                      <Link
                        to={`/admin/product/update/${product._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                      >
                        Update Product
                        <svg
                          className="w-3.5 h-3.5 ml-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </Link>
                    ) : (
                      <Link
                        to={`/product/${product._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                      >
                        View Product
                        <svg
                          className="w-3.5 h-3.5 ml-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </Link>
                    )}
                    <p>$ {product?.price}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div>
          <h1>Top Users</h1>
          <table className="w-full md:w-4/5 mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">IMAGE</th>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">NAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">Order Count</th>

                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <div className="w-12 h-12 overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={user.image}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <td className="px-4 py-2">{user._id}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      {user.username}{" "}
                    </div>
                  </td>
                  <td className="px-4 py-2">

                    <div className="flex items-center">
                      <a href={`mailto:${user.email}`}>{user.email}</a>{" "}
                    </div>

                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      {user.orderCount}{" "}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ml-[10rem] mt-[4rem]">
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="70%"
          />
        </div>
        {/* <div className="mt-[4rem]">
          <OrderList />
        </div> */}
      </section>
    </>
  );
};

export default AdminDashboard;

import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import SearchProduct from "../components/SearchProduct";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword && <Header />}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center min-h-screen">
          <Message variant="danger">
            {isError?.data?.message || isError?.error || "An unexpected error occurred"}
          </Message>
        </div>
      ) : (

        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <SearchProduct />
            <h1 className="text-4xl font-bold">Special Products</h1>
            <Link
              to="/shop"
              className="bg-pink-600 text-white font-bold rounded-full py-2 px-10 shadow-lg transform transition-transform hover:scale-105"
            >
              Shop
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;

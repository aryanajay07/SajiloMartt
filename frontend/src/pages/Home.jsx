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
    <div className="min-h-screen container mx-auto flex flex-col">
      <div
        className="bg-cover bg-center  py-16 flex-grow"
        style={{
          // backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/5/50/Black_Wallpaper.jpg ')`
        }}
      >
        <div className="container mx-auto text-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            Discover Your Next Favorite!
          </h1>
          <p className="text-lg mb-8">
            Explore Variety of  Products with SAJIOMART
          </p>
          {!isLoading && !isError && (
            <Link
              to="/shop"
              className="inline-block bg-pink-600 text-white font-bold rounded-full py-3 px-10 shadow-lg transform transition-transform hover:scale-105"
            >
              Shop Now
            </Link>
          )}
        </div>
      </div>

      <div className="flex-grow">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Loader />
          </div>
        ) : isError ? (
          <div className="flex justify-center mx-auto items-center min-h-screen">
            <Message variant="danger">
              {isError?.data?.message ||
                isError?.error ||
                "An unexpected error occurred"}
            </Message>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl text-white font-bold">Top Products</h1>
              <Link
                to="/shop"
                classN ame="bg-pink-600 text-white font-bold rounded-full py-2 px-10 shadow-lg transform transition-transform hover:scale-105"
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
        {!keyword && <Header />}
      </div>
    </div>
  );
};

export default Home;

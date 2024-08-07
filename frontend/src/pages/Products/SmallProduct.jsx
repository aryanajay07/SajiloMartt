import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[20rem] ml-[2rem] p-3">
      <Link to={`/product/${product._id}`}>
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-96  h-64 object-cover  rounded"
          />
          <HeartIcon product={product} />
        </div>

        <div className="p-4">

          <h2 className="flex justify-between items-center">
            <div>{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              Rs. {product.price}
            </span>

          </h2>
          <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            Rating: {product.rating}
          </span>
        </div>
      </Link>
    </div >
  );
};

export default SmallProduct;

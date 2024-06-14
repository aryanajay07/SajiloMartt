import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-[19rem] ml-[0rem]  rounded relative">
      <Link to={`/product/${product._id}`}>
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-96 h-auto rounded overflow-hidden"
          />
          <HeartIcon product={product} />
        </div>

        <div className="p-4  ">
          <h2 className="flex-col justify-center items-center">
            <div className="text-lg">{product.name}</div>
            
            <span className="text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300">
              $ {product.price}
            </span>
            <span className=" text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark: dark:text-pink-300">
              <h1>Vendor:$ {product.vendor}</h1> 
            </span>
          </h2>

        </div>
      </Link>
    </div>
  );
};

export default Product;

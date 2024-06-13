import React, { useState } from 'react';
import moment from "moment";
import { Link } from "react-router-dom";


const SearchProduct = () => {
    const [keyword, setKeyword] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`/api/products/search/key?keyword=${keyword}`);

            if (!response.ok) {
                throw new Error(`error.message`);
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search Products..."
                />
                <button type="submit">Search</button>
            </form>

            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {products.map((product) => (
                <div className="flex" key={product._id}>
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

                            <p className="text-gray-400 text-xs">
                                {moment(product.createdAt).format("MMMM Do YYYY")}
                            </p>
                        </div>

                        <p className="text-gray-400 xl:w-[30rem] lg:w-[30rem] md:w-[20rem] sm:w-[10rem] text-sm mb-4">
                            {product?.description?.substring(0, 160)}...
                        </p>

                        <div className="flex justify-between">
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
                            <p>$ {product?.price}</p>
                        </div>
                    </div>
                </div>

            ))}

        </div>
    );
};

export default SearchProduct;

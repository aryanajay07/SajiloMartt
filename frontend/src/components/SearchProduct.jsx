import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
// import moment from "moment";

const SearchProduct = () => {
    const [keyword, setKeyword] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    // Load recent searches from local storage
    useEffect(() => {
        const savedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
        setRecentSearches(savedSearches);
    }, []);

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearchClick = (search) => {
        setKeyword(search);
        setShowDropdown(false);
    };

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

            // Update recent searches
            const updatedSearches = [keyword, ...recentSearches.filter((search) => search !== keyword)];
            setRecentSearches(updatedSearches);
            localStorage.setItem("recentSearches", JSON.stringify(updatedSearches.slice(0, 5))); // Limit to 5 recent searches

            navigate(`/search`, { state: { products: data } });
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit}>
                <input
                    className='text-black px-4 py-2 border rounded-lg outline-none focus:border-blue-600 hover:bg-slate-200 delay-200'
                    type="text"
                    value={keyword}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay to allow click on dropdown items
                    placeholder="Search Products..."
                />
                <button className='p-1 px-3 ml-2 rounded-md bg-slate-200 text-black hover:bg-green-400 delay-200' type="submit">
                    Search
                </button>
            </form>

            {/* Display recent searches */}
            {showDropdown && recentSearches.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 mt-2 w-full rounded shadow-lg">
                    {recentSearches.map((search, index) => (
                        <li
                            key={index}
                            onMouseDown={() => handleSearchClick(search)}
                            className="p-2 hover:bg-gray-200 text-black cursor-pointer"
                        >
                            {search}
                        </li>
                    ))}
                </ul>
            )}

            {/* Loading and error messages */}
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
        </div>
    );
};

export default SearchProduct;

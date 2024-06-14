import React, { useState } from 'react';
import moment from "moment";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const SearchProduct = () => {
    const [keyword, setKeyword] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
            { isLoading && <p>Loading...</p> }
            { error && <p>Error: {error.message}</p> }
            navigate(`/search`, { state: { products } })
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




        </div>
    );
};

export default SearchProduct;

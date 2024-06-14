import React from 'react';
import { useSelector } from 'react-redux';
import { selectFavoriteProduct } from '../../redux/features/favorites/favoriteSlice';
import { Link } from 'react-router-dom';
import Product from './Product';

const Favorites = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="ml-[10rem]">
      <div className="flex flex-col">
        {userInfo ? (
          <>
            <h1 className="text-lg font-bold ml-[3rem] mt-[3rem]">
              FAVORITE PRODUCTS
            </h1>

            <div className="flex flex-wrap mt-4">
              {favorites.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="ml-10 mt-4">
            You are not logged in.{' '}
            <Link className="text-blue-900 font-bold" to="/login">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

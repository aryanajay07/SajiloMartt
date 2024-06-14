// src/components/FavoritesCount.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFavoriteCount } from '../../redux/Features/auth/authSlice';

const FavoritesCount = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  useEffect(() => {
    if (userInfo) {
      dispatch(updateFavoriteCount(favoriteCount));
    }
  }, [dispatch, userInfo, favoriteCount]);

  return (
    <div className=" ">
      {userInfo && favoriteCount > 0 && (
        <span className="px-1.5 mr-2.5 absolute top-4  py-0 text-sm mb-0 text-white bg-pink-500 rounded-full">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;

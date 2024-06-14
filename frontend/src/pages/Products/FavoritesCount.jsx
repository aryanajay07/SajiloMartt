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
    <div className="absolute left-2 top-8">
      {userInfo && favoriteCount > 0 && (
        <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;

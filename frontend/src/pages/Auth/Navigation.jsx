import { useState } from "react";
import { AiOutlineHome, AiOutlineShopping, AiOutlineLogin, AiOutlineUserAdd, AiOutlineShoppingCart } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/Features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import SearchProduct from "../../components/SearchProduct";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={` top-0 left-0 right-0 z-50 bg-[#000] p-4 text-white flex justify-between items-center ${showSidebar ? 'hidden' : 'block'}`}>
      <Link to="/" className="text-xl font-bold">
        SAJILOMART
      </Link>
      <div>
        <SearchProduct />
      </div>

      <div className="flex items-center">
        <Link to="/" className="mr-4">
          <AiOutlineHome size={24} />
        </Link>

        <Link to="/shop" className="mr-4">
          <AiOutlineShopping size={24} />
        </Link>

        <Link to="/cart" className="mr-4 relative">
          <AiOutlineShoppingCart size={24} />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full px-2">
              {cartItems.reduce((total, item) => total + item.qty, 0)}
            </span>
          )}
        </Link>

        <Link to="/favorite" className="mr-4">
          <FaHeart size={24} />
          <FavoritesCount />
        </Link>

        {userInfo ? (
          <div className="relative ml-4">
            <button onClick={toggleDropdown} className="text-white">
              {userInfo.username}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ml-1 ${dropdownOpen ? "transform rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
            </button>
            {dropdownOpen && (
              <ul className={`absolute top-10 right-0 bg-white text-gray-800 border border-gray-200 rounded-md py-1 shadow-lg z-10 ${userInfo.role !== "customer" ? "-top-20" : "-top-80"}`}>
                {userInfo.role !== "customer" && (
                  <>
                    <li>
                      <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                        Sales Report
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/allproductslist" className="block px-4 py-2 hover:bg-gray-100">
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/categorylist" className="block px-4 py-2 hover:bg-gray-100">
                        Category
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-100">
                        Orders
                      </Link>
                    </li>
                    {userInfo.role === "admin" && (
                      <li>
                        <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-gray-100">
                          Users
                        </Link>
                      </li>
                    )}
                  </>
                )}
                <li>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={logoutHandler} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="flex">
            <Link to="/login" className="mr-4">
              <AiOutlineLogin size={24} />
            </Link>
            <Link to="/register">
              <AiOutlineUserAdd size={24} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
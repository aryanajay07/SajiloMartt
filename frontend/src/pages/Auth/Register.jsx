import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation, useVerifyOtpMutation, useSendOtpMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/Features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState("customer");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [verifyOtp, { isLoading: isVerifyLoading }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: isSendOtpLoading }] = useSendOtpMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        // Call the register mutation
        const res = await register({
          username,
          email,
          password,
          role,
        }).unwrap();
        setOtpToken(res.otpToken);
        console.log("otp:", otp)
        setOtpSent(true);
        toast.success("OTP sent to your email address");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
  };

  const verifyOtpHandler = async (e) => {
    e.preventDefault();

    try {
      // Call the verifyOtp mutation
      const res = await verifyOtp({
        otp,
        otpToken,
        username,
        email,
        password,
        role,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("User successfully registered");
    } catch (err) {
      toast.error(err.data.message);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    setDropdownOpen(false);
  };

  return (
    <section className="pl-[10rem] flex flex-wrap">
      <div className="mr-[4rem] mt-[5rem]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Register</h1>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none"
            >
              Register as {role}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                <button
                  onClick={() => selectRole("customer")}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Customer
                </button>
                <button
                  onClick={() => selectRole("vendor")}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Vendor
                </button>
              </div>
            )}
          </div>
        </div>

        {!otpSent ? (
          <form onSubmit={submitHandler} className="container w-[40rem]">
            <div className="my-[2rem]">
              <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
              <input
                type="text"
                id="name"
                className="mt-1 p-2 text-black border rounded w-full"
                placeholder="Enter name"
                value={username}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="my-[2rem]">
              <label htmlFor="email" className="block text-sm font-medium text-white">Email Address</label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 border text-black rounded w-full"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="my-[2rem]">
              <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 text-red-500 border rounded w-full"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="my-[2rem]">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 p-2 border text-black rounded w-full"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isRegisterLoading}
              type="submit"
              className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
            >
              {isRegisterLoading ? "Sending OTP..." : "Register"}
            </button>

            {isRegisterLoading && <Loader />}
          </form>
        ) : (
          <form onSubmit={verifyOtpHandler} className="container w-[40rem]">
            <div className="my-[2rem]">
              <label htmlFor="otp" className="block text-sm font-medium text-white">OTP</label>
              <input
                type="text"
                id="otp"
                className="mt-1 p-2 border text-black rounded w-full"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              disabled={isVerifyLoading}
              type="submit"
              className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
            >
              {isVerifyLoading ? "Verifying OTP..." : "Verify OTP"}
            </button>

            {isVerifyLoading && <Loader />}
          </form>
        )}

        <div className="mt-4">
          <p className=" ">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;

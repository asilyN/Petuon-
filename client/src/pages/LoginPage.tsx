/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import LoginBG from "../assets/LoginBg.png";
import axios from "axios";
import { LoginFormsInputs, Props } from "../types/LoginTypes";
import LogInOut from "../components/logInOutComponent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useToken } from "../hooks/UseToken";

const LoginPage: React.FC<Props> = () => {
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token, setToken,fetchTokenFromDatabase } = useToken(); // Use the hook

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>();

  const handleLogin = async (form: LoginFormsInputs) => {
    try {

        const response = await axios.post("http://localhost:3002/login/userLogin", {
          user_name: form.user_name,
          user_password: form.user_password,
        });
        if (response.data.token) {
          // Store JWT token in localStorage for persistent sessions
          localStorage.setItem("token", response.data.token);
          // alert("Login successful! Redirecting to dashboard...");

      setLoading(true);
      const response = await axios.post("http://localhost:3002/login/userLogin", {
        user_name: form.user_name,
        user_password: form.user_password,
      });
  
      console.log("Login response:", response.data); // Log the login response
  
      // Check if user_id is returned
      if (response.data.user_id) {
        console.log("User  ID fetched successfully:", response.data.user_id); // Debugging log for user_id
        toast.success("Login successful! Fetching token...");
        
        const fetchedToken = await fetchTokenFromDatabase(response.data.user_id);
        console.log("Fetched token:", fetchedToken); // Log the fetched token
  
        if (fetchedToken) {
          console.log("Token successfully retrieved:", fetchedToken);
          localStorage.setItem("token", fetchedToken);
          setToken(fetchedToken); // Set token in state

          toast.success("Login successful! Redirecting to dashboard...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          toast.error("Failed to retrieve token. Please try again.");
        }
      } else {
        console.error("Login failed: User ID not returned."); // Log error if user_id is not returned
        toast.error("Login failed. User ID not returned.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error connecting to the server.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false); // Ensure loading is set to false in finally
    }
  };

  return (
    <>
     <ToastContainer
        position="top-center" // This makes the toast appear at the top center
        autoClose={3000} // Adjust the auto-close time if needed
        hideProgressBar={false} // Show the progress bar
        newestOnTop={true} // New toasts appear at the top of the stack
        closeOnClick // Close on click
        rtl={false} // Set to true for right-to-left layout
        pauseOnFocusLoss
        draggable
      />
    {loading && (
      <LogInOut/>
    )}
    <section  
      className="flex h-screen items-center justify-center"
      style={{
        backgroundImage: `url(${LoginBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 mr-20">
        <div
          className="w-full rounded-lg shadow md:mb-20 sm:max-w-lg xl:p-0"
          style={{ backgroundColor: "rgba(88, 85, 85, 0.285)" }}
        >
          <div className="p-10 space-y-6 md:space-y-8 sm:p-12">
            <h2 className="text-4xl font-bold text-white">Welcome!</h2>
            <p className="mb-5 text-left font-light text-white">
              Ready to learn smarter? Log in to access your dashboard!
            </p>
            {error && <p className="text-red-500">{error}</p>}
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleLogin)}
            >
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg bg-[#719191] p-2.5 text-white sm:text-sm"
                  placeholder="Username"
                  {...register("user_name")}
                />
                {errors.user_name && <p className="text-white">{errors.user_name.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="At least 8 characters"
                  className="bg-[#719191] text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  {...register("user_password")}
                />
                {errors.user_password && <p className="text-white">{errors.user_password.message}</p>}
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="justify-center rounded-3xl bg-[#719191] px-8 py-2 font-bold text-white hover:bg-gray-700"
                >
                  Log in
                </button>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-sm font-light text-white">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/register"
                    className="text-white font-medium hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
              <div className="flex items-center justify-center">
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default LoginPage;

import React, { useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import LoginBG from "../assets/LoginBg.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { supabase } from '../SupabaseClient'; // Adjust the path as needed
import { RegisterFormsInputs } from "../types/RegisterTypes";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import LogInOut from "../components/logInOutComponent"; // Import the LogInOut component

const validation = Yup.object().shape({
  user_email: Yup.string().email("Invalid email").required("Email is required"),
  user_name: Yup.string().required("Username is required"),
  user_password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State for loading indicator
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormsInputs>({ resolver: yupResolver(validation) });

  const handleRegister = async (form: RegisterFormsInputs) => {
    setLoading(true); // Show loading indicator
    try {
      // Construct the payload
      const formData = {
        user_password: form.user_password,
        user_id: uuidv4(),
        user_email: form.user_email,
        user_name: form.user_name,
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/register/registerUser`, formData);
      // Handle successful backend registration
      toast.success(response.data.message); // Show success message with toast

      // Then, register the user with Supabase
      const { error } = await supabase.auth.signUp({
        email: form.user_email,
        password: form.user_password,
      });

      if (error) {
        toast.error(`Supabase Error: ${error.message}`); // Show error message with toast
      } else {
        toast.success("Registration successful! Please check your email to confirm.");
        navigate("/login"); // Redirect to the login page after successful registration
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error); // Show specific error message from the backend
      } else {
        toast.error("An unexpected error occurred. Please try again."); // Show generic error message
      }
      console.error("Error registering user:", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <section
      className="flex h-screen items-center justify-center"
      style={{
        backgroundImage: `url(${LoginBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto mr-20 flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div
          className="w-full rounded-lg shadow sm:max-w-lg md:mb-20 xl:p-0"
          style={{ backgroundColor: "rgba(88, 85, 85, 0.285)" }}
        >
          <div className="space-y-6 p-10 sm:p-12 md:space-y-8">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl dark:text-white">
              Create your account
            </h1>
            <p className="text-white text-sm md:text-base">Ready to learn smarter? Set up your account
            and unlock a world of study support!</p>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleRegister)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-white dark:text-white"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className="bg-[#719191] text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Email"
                  {...register("user_email")}
                />
                {errors.user_email && (
                  <p className="text-white">{errors.user_email.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-white dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg bg-[#719191] p-2.5 text-white sm:text-sm"
                  placeholder="Username"
                  {...register("user_name")}
                />
                {errors.user_name && (
                  <p className="text-white">{errors.user_name.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-white dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-[#719191] text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  {...register("user_password")}
                />
                {errors.user_password && (
                  <p className="text-white">{errors.user_password.message}</p>
                )}
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="rounded-3xl bg-[#719191] px-8 py-2 font-bold text-white hover:bg-gray-700"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <div className="mt-4 flex items-center justify-center">
              <p className="text-sm font-light text-white">
                Already have an account?{" "}
                <span
                  className="text-primary-600 cursor-pointer font-medium hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {loading && <LogInOut />} 
      <ToastContainer
        position="top-center" // This makes the toast appear at the top center
        autoClose={2000} // Adjust the auto-close time if needed
        hideProgressBar={false} // Show the progress bar
        newestOnTop={true} // New toasts appear at the top of the stack
        closeOnClick // Close on click
        rtl={false} // Set to true for right-to-left layout
        pauseOnFocusLoss
        draggable
      />
    </section>
  );
};

export default RegisterPage;
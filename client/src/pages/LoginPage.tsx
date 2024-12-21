/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginFormsInputs, Props } from "../types/LoginTypes";
import LogInOut from "../components/logInOutComponent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import smBG from '../assets/Bg_sm.png';
import smBG1 from '../assets/Bg_sm1.png';
import mdBG from '../assets/Bg_md.png';
import lgBG from '../assets/Bg_lg.png';
import LogInBG from '../assets/LoginBg.png';

const getBackgroundImage = (width: number) => {
  if (width >= 1280) return `url(${LogInBG})`;
  if (width >= 1024) return `url(${lgBG})`;
  if (width >= 640) return `url(${mdBG})`;
  if (width >= 480) return `url(${smBG1})`;
  return `url(${smBG})`;
};



const LoginPage: React.FC<Props> = () => {
  const [error] = useState<string | null>(null); // Track error message
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>(''); 

  useEffect(() => {
    const updateBackground = () => {
      const width = window.innerWidth;
      setBackgroundImage(getBackgroundImage(width));
    };

    // Set the background image when the component mounts
    updateBackground();

    // Update the background image when the window is resized
    window.addEventListener('resize', updateBackground);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', updateBackground);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>();

  const handleLogin = async (form: LoginFormsInputs) => {
    setLoading(true)
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/login/userLogin`, {
          user_name: form.user_name,
          user_password: form.user_password,
        });
      
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful! Redirecting to dashboard...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } 
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Error connecting to the server.");
      } else {
        alert("An unexpected error occurred.");
      } 
    } finally {
      setLoading(false)
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
         className="fixed  w-full h-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: backgroundImage }}
    >
      
      <div style={{ fontFamily: '"Signika Negative", sans-serif' }} className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 mr-20 xl:-mt-20 xl:mr-[9rem]">
        <div
          className="w-full rounded-lg shadow ml-20 lg:-mr-[0.1rem] md:mt-16 md:mr-20 sm:max-w-lg  xl:p-0"
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
                  placeholder="••••••••"
                  className="bg-[#719191] text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  {...register("user_password")}
                />
                {errors.user_password && <p className="text-white">{errors.user_password.message}</p>}
              </div>
              <div className="flex items-center justify-center">
                <button
                  disabled={loading}
                  type="submit"
                  className={`justify-center rounded-3xl px-8 py-2 font-bold text-white 
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#719191] hover:bg-gray-700"}`}
                >
                  Log in
                </button>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-sm font-light text-white">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/register"
                    className="text-primary-600 text-white font-medium hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
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

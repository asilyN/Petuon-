import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { supabase } from '../SupabaseClient'; // Adjust the path as needed
import { RegisterFormsInputs } from "../types/RegisterTypes";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import smBG from '../assets/Bg_sm.png';
import smBG1 from '../assets/Bg_sm1.png';
import mdBG from '../assets/Bg_md.png';
import lgBG from '../assets/Bg_lg.png';
import LogInBG from '../assets/LogInBG.png';

const getBackgroundImage = (width: number) => {
  if (width >= 1280) return `url(${LogInBG})`;
  if (width >= 1024) return `url(${lgBG})`;
  if (width >= 640) return `url(${mdBG})`;
  if (width >= 480) return `url(${smBG1})`;
  return `url(${smBG})`;
};

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

      const response = await axios.post("http://localhost:3002/register/registerUser", formData);
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
    className="fixed flex w-full h-full items-center justify-center"
    style={{
      backgroundImage: backgroundImage,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
   <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 lg:py-0 md:ml-[12rem] md:mt-20 lg:ml-[55rem] lg:mt-[2rem]">
        <div
          className="w-full rounded-lg shadow md:max-w-md lg:max-w-md "
          style={{ backgroundColor: "rgba(88, 85, 85, 0.285)" }}
        >
          <div className="space-y-6 p-6 sm:p-8 md:space-y-8 lg:p-12">
            <h1
              style={{ fontFamily: '"Signika Negative", sans-serif' }}
              className="text-center text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl"
            >
              Create your account
            </h1>
            <p
              style={{ fontFamily: '"Signika Negative", sans-serif' }}
              className="text-sm text-white"
            >
              Ready to learn smarter? Set up your account and unlock a world of study support!
            </p>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleRegister)}
            >
              <div>
                <label
                  htmlFor="email"
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="w-full rounded-lg bg-[#719191] p-2.5 text-white sm:text-sm focus:border-primary-600 focus:ring-primary-600"
                  placeholder="Email"
                  {...register("user_email")}
                />
                {errors.user_email && (
                  <p className="text-sm text-red-400">{errors.user_email.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="username"
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="w-full rounded-lg bg-[#719191] p-2.5 text-white sm:text-sm focus:border-primary-600 focus:ring-primary-600"
                  placeholder="Username"
                  {...register("user_name")}
                />
                {errors.user_name && (
                  <p className="text-sm text-red-400">{errors.user_name.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="w-full rounded-lg bg-[#719191] p-2.5 text-white sm:text-sm focus:border-primary-600 focus:ring-primary-600"
                  {...register("user_password")}
                />
                {errors.user_password && (
                  <p className="text-sm text-red-400">{errors.user_password.message}</p>
                )}
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="w-full rounded-3xl bg-[#719191] px-6 py-2 text-white font-bold hover:bg-gray-700 md:w-auto md:px-8"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <div className="mt-4 flex items-center justify-center">
              <p
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="text-sm font-light text-white"
              >
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
    </section>
  );
};

export default RegisterPage;

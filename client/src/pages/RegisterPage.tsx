/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import LoginBG from "../assets/LoginBg.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { supabase } from '../SupabaseClient'; // Adjust the path as needed
import { RegisterFormsInputs} from "../types/RegisterTypes";
import { v4 as uuidv4 } from "uuid";

const validation = Yup.object().shape({
  user_email: Yup.string().email("Invalid email").required("Email is required"),
  user_name: Yup.string().required("Username is required"),
  user_password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({ resolver: yupResolver(validation)});

  
  const handleRegister = async (form: RegisterFormsInputs) => {
    try {
      
      // Construct the payload
      const formData = {
        user_password: form.user_password,
        user_id: uuidv4(),
        user_email: form.user_email,
        user_name: form.user_name,
      };
    
      const response = await axios.post("http://localhost:3002/register/registerUser", formData)
      // Handle successful backend registration
      alert(response.data.message); // This will show the success message from the backend
  
      // Then, register the user with Supabase
      const { error } = await supabase.auth.signUp({
        email: form.user_email,
        password: form.user_password,
      });

      if (error) {
        alert(`Supabase Error: ${error.message}`);
      } else {
        alert("Registration successful! Please check your email to confirm.");
        navigate("/login"); // Redirect to the login page after successful registration
      }
    } catch (error) {
      // Handle error from the backend API
      if (error) {
        alert(`Error: ${error}`);
      } else {
        console.error("Error registering user:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };
  
  return (
    <section
      className="h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${LoginBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 mr-20">
      <div className="w-full rounded-lg shadow md:mb-20 sm:max-w-lg xl:p-0" style={{ backgroundColor: "rgba(88, 85, 85, 0.285)" }}>
          <div className="p-10 space-y-6 md:space-y-8 sm:p-12">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl dark:text-white">
              Create your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleRegister)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white dark:text-white"
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
                  className="block mb-2 text-sm font-medium text-white dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="bg-[#719191] text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                  className="block mb-2 text-sm font-medium text-white dark:text-white"
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
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="bg-[#719191] hover:bg-gray-700 text-white font-bold py-2 px-8 rounded-3xl"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <div className="flex justify-center items-center mt-4">
              <p className="text-sm font-light text-white">
                Already have an account?{" "}
                <span
                  className="font-medium text-primary-600 hover:underline cursor-pointer"
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

import { useState, useEffect } from "react";
import {User, Moon, Settings } from "lucide-react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import LogInOut from "./logInOutComponent";
import { toast, ToastContainer } from "react-toastify";
import SettingPageModal from "./avatar/SettingsModal";

const Avatar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [loading, setLoading] = useState(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate(); 

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/avatar/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
      setUserName(userData.user_name);
      setUserEmail(userData.user_email);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Call fetchUserData on component mount
  }, [token]);

  const handleLogout = async () => {
    setLoading(true); // Start loading animation
    try {
      // Simulate an async operation (e.g., API request)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.removeItem("token");
      toast.info("You are being logged out. Redirecting to the login page...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setLoading(false)
      console.error("Logout failed:", error);
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
   
      {/* Top-right section for Bell and Profile */}
      <div className="
      fixed 
      right-[1rem] top-9
      sm:right-[2rem] sm:top-9
      lg:right-12 lg:top-9 
      xl:right-12 xl:top-9
      items-center space-x-4 lg:flex z-50"
      >
        {/* Bell Icon */}
     
        {/* Profile Icon with Dropdown */}
        <div className="relative">
          {/* Profile Icon (clickable) */}
          <button
            onClick={toggleDropdown}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <User className="h-7 w-7 text-[#354F52]" />
          </button>
          {openSettings && (
            <>
             <SettingPageModal
                onClose={() => setOpenSettings(false)}
                fetchUserData={fetchUserData}
              />
            </>
          )} 
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="
            absolute
            right-0 top-12 
            w-56 
            rounded-lg border bg-white shadow-lg
            ">
              {/* Profile Section */}
              <div className="flex items-center border-b p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-[#354F52]">
                  <User className="h-6 w-6" />
                </div>
                <div className="ml-3">

                  <p className="font-medium text-gray-800">{userName}</p>
                        <p className="text-sm text-gray-500 cursor-pointer" title={userEmail} >
                      {userEmail.length > 5 ? `${userEmail.substring(0, 5)}...@gmail.com` : userEmail}
                      </p>

                </div>
              </div>
              {/* Dropdown Options */}
              <ul className="py-2">
                <li className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpenSettings(true)}
                >
                  <Settings className="mr-2 h-5 w-5 text-gray-700" />
                  Settings
                </li>
                <li className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100">
                  <Moon className="mr-2 h-5 w-5 text-gray-700" />
                  Darkmode
                </li>
              </ul>
              {/* Footer Options */}
              <ul className="border-t">
                {/* Logout Option */}
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout} 
                >
                  Log out
                </li>
              </ul>
              <ul className="border-t">
                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                  Privacy Policy
                </li>
                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                  Help and Feedback
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Avatar;

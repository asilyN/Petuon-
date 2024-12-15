import { useState, useEffect } from 'react';
import axios from 'axios';

interface SettingPageModalProps {
  onClose: () => void;
  fetchUserData: () => void; // Add fetchUserData as a prop
}

const SettingPageModal: React.FC<SettingPageModalProps> = ({ onClose, fetchUserData }) => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>(''); // Added confirm password state
  const [email, setEmail] = useState<string>('');
  const [username, setUserName] = useState<string>('');
  const [initialPassword, setInitialPassword] = useState<string>(''); // Store the initial password
  const token = localStorage.getItem('token');
  const [passwordMatchError, setPasswordMatchError] = useState<string>('');
  const [emailMatchError, setEmailMatchError] = useState<string>(''); // For password mismatch error
  const [isEditing, setIsEditing] = useState<boolean>(false); // Track whether the user is editing their profile
  const [loading, setLoading] = useState<boolean>(false);
  const [afterLoading, setafterLoading] = useState<boolean>(false);
  const [confirmPW, setConfirmPW] = useState<boolean>(false)
  const [initialEmail, setInitialEmail] = useState<string>("")

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://localhost:3002/avatar/getUser', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data;
        setUserName(userData.user_name);
        setEmail(userData.user_email);
        setPassword(userData.user_password);
        setInitialPassword(userData.user_password); // Store the initial password
        setInitialEmail(userData.user_email)
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setafterLoading(true)
        setLoading(false)
      }
    };

    fetchUserData();
  }, [token]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (password.length === 0 ){
      setPassword(initialPassword)
    } else {
      setPassword(e.target.value);
    }
    setConfirmPW(true);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setPasswordMatchError('Invalid email address');
      return;
    }

    // Password confirmation validation
    if (confirmPW && confirmPassword.length === 0) {
      setPasswordMatchError('Confirm your password');
      return;
    }

    // Password match validation
    if (confirmPW && password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match');
      return;
    }

    // Password length validation
    if (confirmPW && (password.length < 8 || confirmPassword.length < 8)) {
      setPasswordMatchError('Password should be at least 8 characters long');
      return;
    }

    // Check if email has changed
    if (email !== initialEmail) {
      try {
        const accountExists = await axios.get('http://localhost:3002/editprofile/getUsers', {
          params: { email },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If email already exists, show error
        if (accountExists.data.result && accountExists.data.result.user_email === email) {
          setEmailMatchError('An account with this email already exists');
          return;
        }
      } catch (err) {
        console.error('Error checking email existence:', err);
        setEmailMatchError('Error checking email availability');
        return;
      }
    }

    // Prepare data for submission
    const data = {
      password: confirmPassword,
      email: email,
      username: username,
    };

    // Update user profile
    try {
      await axios.patch("http://localhost:3002/editprofile/getUpdatedUser", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPasswordMatchError(''); // Clear any previous errors
      setEmailMatchError('');
      alert('Profile saved');
      setIsEditing(false);
      setConfirmPW(false);
      fetchUserData()
    } catch (err) {
      console.error("Error updating user profile:", err);
      setPasswordMatchError('Failed to update profile. Please try again later.');
    }
  };


  const handleEditClick = () => {
    setIsEditing(true); // Switch to edit mode
  };

  const handleCancelEdit = () => {
    setConfirmPW(false);
    setIsEditing(false); 
    setPassword(initialPassword); 
    setConfirmPassword(''); 
  };

  if (loading) {
    return (
      <>
      </>
    );
  }

if (afterLoading) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

      <div className="w-[25rem] rounded-lg bg-white p-6 shadow-lg">

        <h2 className="text-xl font-semibold text-gray-800">My Profile</h2>

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="username">
              Username
            </label>
            {isEditing ? (
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)} // Update username state
                className="w-full rounded border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Enter your username"
              />
            ) : (
              <p className="text-gray-800">{username}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="email">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
                className="w-full rounded border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Enter your email"
              />
            ) : (
              <p className="text-gray-800">{email}</p>
            )}
          </div>
          {emailMatchError && isEditing && (
            <div className="text-red-500 text-sm mb-4">{emailMatchError}</div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="password">
              Password
            </label>
            {isEditing ? (
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange} // Update password state
                className="w-full rounded border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Enter your password"
              />
            ) : (
              <p className="text-gray-800">********</p>
            )}
          </div>

          {isEditing && confirmPW &&(
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange} // Update confirmPassword state
                className="w-full rounded border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {passwordMatchError && isEditing && (
            <div className="text-red-500 text-sm mb-4">{passwordMatchError}</div>
          )}
          
          {isEditing ? (
          <div className="flex">
            <button
              type="button"
              className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              onClick={handleCancelEdit}
            >
                  Cancel Edit
            </button>
            <button
                  type="submit"
                  className="mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Save Changes
              </button>
     
          </div>
          ) : (
            <>

              <button
              type="button"
              className="mr-2 rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              onClick={onClose}
              >
                Exit
              </button>
            </>
          )}


            {isEditing ? (
              <>
              </>
            ) : (
              <button
                type="button"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={handleEditClick}
              >
                Edit Profile
              </button>
            )}
        </form>
      </div>
    </div>
  );
};
}
export default SettingPageModal;

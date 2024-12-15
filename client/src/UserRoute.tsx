import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useToken } from "./hooks/UseToken";

interface UserRouteProps {
  children: React.ReactNode;
}

const UserRoute: React.FC<UserRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { token, fetchTokenFromDatabase } = useToken();

  // Check for token validity and authentication on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]); // Run effect when token changes

  // Save the token in localStorage when it's updated
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token); // Save the token to localStorage
    }
  }, [token]);

  // Loading state until we know if the user is authenticated
  if (isAuthenticated === null) {
    return <div>Loading...</div>;  // Add loading spinner or message
  }

  // If authenticated, render children (protected routes), else redirect to login
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default UserRoute;

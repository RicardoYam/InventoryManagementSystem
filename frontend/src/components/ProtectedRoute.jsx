import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loading from "../components/Loading";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../util/constants";
import { jwtDecode } from "jwt-decode";
import { RefreshTokenAPI } from "../api/login";

export default function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth();
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    if (!refreshToken) {
      setIsAuthorized(false);
      return;
    }

    try {
      const data = await RefreshTokenAPI(refreshToken);
      localStorage.setItem(ACCESS_TOKEN, data.access);
      setIsAuthorized(true);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      setIsAuthorized(false);
      return;
    }

    try {
      const decodedJWT = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedJWT.exp < currentTime) {
        await refreshToken();
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      setIsAuthorized(false);
    }
  };

  if (isAuthorized === null) {
    return <Loading />;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

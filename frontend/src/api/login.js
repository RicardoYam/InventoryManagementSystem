import apiClient from "./base";

export const LoginAPI = async (credentials) => {
  try {
    const response = await apiClient.post("login/", credentials);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Login failed";
    throw new Error(errorMessage);
  }
};

export const RefreshTokenAPI = async (refreshToken) => {
  try {
    const response = await apiClient.post("refresh/", {
      refresh: refreshToken,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Token refresh failed";
    throw new Error(errorMessage);
  }
};

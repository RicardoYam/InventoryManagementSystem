import apiClient from "./base";

export const fetchSales = async () => {
  try {
    const response = await apiClient.get("/orders/sales/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch sales report:", error);
    throw error;
  }
};

export const fetchStockReport = async () => {
  try {
    const response = await apiClient.get("/inventories/report/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch stock report:", error);
    throw error;
  }
};

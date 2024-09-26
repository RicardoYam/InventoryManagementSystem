import apiClient from "./base";

export const fetchOrders = async (params) => {
  try {
    let endPoint = "/orders/";
    if (params) {
      endPoint = `${endPoint}?${params}`;
    }

    const response = await apiClient.get(endPoint);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch inventoies:", error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post("/orders/", orderData);
    return response.data;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

export const retrieveOrder = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to retrieve order:", error);
    throw error;
  }
};

export const updateOrder = async (orderId, updatedOrder) => {
  try {
    const response = await apiClient.put(`/orders/${orderId}/`, updatedOrder);
    return response.data;
  } catch (error) {
    console.error("Failed to update order:", error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await apiClient.delete(`/orders/${orderId}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete order:", error);
    throw error;
  }
};

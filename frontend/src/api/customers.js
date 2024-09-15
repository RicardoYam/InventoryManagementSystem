import apiClient from "./base";

export const fetchCustomers = async (params) => {
  try {
    let endPoint = "/customers/";
    if (params) {
      endPoint = `${endPoint}?${params}`;
    }

    const response = await apiClient.get(endPoint);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    throw error;
  }
};

export const createCustomer = async (customerData) => {
  try {
    const response = await apiClient.post("/customers/", customerData);
    return response.data;
  } catch (error) {
    console.error("Failed to create customer:", error);
    throw error;
  }
};

export const retrieveCustomer = async (customerId) => {
  try {
    const response = await apiClient.get(`/customers/${customerId}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to retrieve customer:", error);
    throw error;
  }
};

export const updateCustomer = async (customerId, updatedCustomer) => {
  try {
    const response = await apiClient.put(
      `/customers/${customerId}/`,
      updatedCustomer
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update customer:", error);
    throw error;
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    const response = await apiClient.delete(`/customers/${customerId}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete customer:", error);
    throw error;
  }
};

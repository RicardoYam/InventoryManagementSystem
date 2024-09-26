import apiClient from "./base";

export const fetchInventories = async (params) => {
  try {
    let endPoint = "/inventories/";
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

export const createInventory = async (inventoryData) => {
  try {
    const response = await apiClient.post("/inventories/", inventoryData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create inventory:", error);
    throw error;
  }
};

export const retrieveInventory = async (inventoryId) => {
  try {
    const response = await apiClient.get(`/inventories/${inventoryId}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to retrieve inventory:", error);
    throw error;
  }
};

export const updateInventory = async (inventoryId, updatedInventory) => {
  try {
    const response = await apiClient.put(
      `/inventories/${inventoryId}/`,
      updatedInventory,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update inventory:", error);
    throw error;
  }
};

export const deleteInventory = async (inventoryId) => {
  try {
    const response = await apiClient.delete(`/inventories/${inventoryId}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete inventory:", error);
    throw error;
  }
};

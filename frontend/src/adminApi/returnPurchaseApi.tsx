import adminInstance from "./adminInstance";

/**
 * Retrieves all purchase returns.
 */
export const getAllPurchaseReturns = async () => {
  try {
    const response = await adminInstance.get("/purchase-returns/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching all purchase returns:", error);
    throw error;
  }
};

/**
 * Adds a new purchase return.
 * @param returnData - The data for the new purchase return.
 */
export const addPurchaseReturn = async (returnData: any) => {
  try {
    const response = await adminInstance.post("/purchase-returns/add", returnData);
    return response.data;
  } catch (error) {
    console.error("Error adding purchase return:", error);
    throw error;
  }
};

/**
 * Updates the status of a purchase return by its ID.
 * @param id - The ID of the purchase return to update.
 * @param status - The new status for the purchase return.
 */
export const updatePurchaseReturnStatus = async (id: string, status: string) => {
  try {
    const response = await adminInstance.put(`/purchase-returns/status/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating purchase return status with id ${id}:`, error);
    throw error;
  }
};

/**
 * Updates a purchase return by its ID.
 * @param id - The ID of the purchase return to update.
 * @param returnData - The new data for the purchase return.
 */
export const updatePurchaseReturn = async (id: string, returnData: any) => {
  try {
    const response = await adminInstance.put(`/purchase-returns/update/${id}`, returnData);
    return response.data;
  } catch (error) {
    console.error(`Error updating purchase return with id ${id}:`, error);
    throw error;
  }
};

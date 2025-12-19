import adminInstance from "./adminInstance";

// add a new purchase detail
export const addPurchaseDetail = async (purchaseData: any) => {
  try {
    const response = await adminInstance.post("/purchases/add", purchaseData);
    return response.data;
  } catch (error) {
    console.error("Error adding purchase detail:", error);
    throw error;
  }
};

// get all purchase details
export const getAllPurchaseDetails = async () => {
  try {
    const response = await adminInstance.get("/purchases/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching all purchase details:", error);
    throw error;
  }
};

// update a purchase detail by id
export const updatePurchaseDetail = async (id: string, purchaseData: any) => {
  try {
    const response = await adminInstance.put(`/purchases/update/${id}`, purchaseData);
    return response.data;
  } catch (error) {
    console.error(`Error updating purchase detail with id ${id}:`, error);
    throw error;
  }
};

/**
 * Retrieves a purchase voucher.
 * The specific voucher is likely determined by parameters or session on the backend.
 */
export const getPurchaseVoucher = async () => {
  try {
    const response = await adminInstance.get("/purchases/voucher");
    return response.data;
  } catch (error) {
    console.error("Error fetching purchase voucher:", error);
    throw error;
  }
};

// delete a purchase detail by id
export const deletePurchaseDetail = async (id: string) => {
  try {
    const response = await adminInstance.delete(`/purchases/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting purchase detail with id ${id}:`, error);
    throw error;
  }
};

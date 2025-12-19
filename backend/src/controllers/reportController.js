import Bill from "../models/bill.js";

/* ================= GET ALL REPORTS ================= */
export const allReports = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("customerId", "firstName lastName phoneNumber gstNumber") 
      .populate("agentId", "name")
      .sort({ billDate: -1 });

    res.status(200).json({ success: true, bills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
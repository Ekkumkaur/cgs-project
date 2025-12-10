// controllers/billController.js
import Bill from "../models/bill.js";

// Add Bill
export const addBill = async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    res.status(201).json({ success: true, bill });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get All Bills
export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json({ success: true, bills });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Single Bill
export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ success: false, msg: "Bill not found" });

    res.json({ success: true, bill });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update / Edit Bill
export const updateBill = async (req, res) => {
  try {
    const updated = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete Bill
export const deleteBill = async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: "Bill deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Change Payment Status
export const updatePaymentStatus = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: req.body.status },
      { new: true }
    );
    res.json({ success: true, bill });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

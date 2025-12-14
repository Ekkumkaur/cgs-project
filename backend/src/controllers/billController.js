// controllers/bill.controller.js
import Bill from "../models/bill.js";

// Helper to format date
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
};

// CREATE BILL
export const addBill = async (req, res) => {
  try {
    const bill = await Bill.create(req.body);

    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      bill,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL BILLS
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 }).lean();

    const formattedBills = bills.map(bill => ({
      ...bill,
      date: formatDate(bill.date),
      createdAt: formatDate(bill.createdAt),
      updatedAt: formatDate(bill.updatedAt),
      returnDate: formatDate(bill.returnDate),
    }));

    res.status(200).json({
      success: true,
      bills: formattedBills,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET BILL BY ID
export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).lean();

    if (!bill)
      return res.status(404).json({ success: false, message: "Bill not found" });

    const formattedBill = {
      ...bill,
      date: formatDate(bill.date),
      createdAt: formatDate(bill.createdAt),
      updatedAt: formatDate(bill.updatedAt),
      returnDate: formatDate(bill.returnDate),
    };

    res.status(200).json({ success: true, bill: formattedBill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET BILLS BY DATE RANGE
export const getBillsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Start date and end date are required" });
    }

    const bills = await Bill.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    const formattedBills = bills.map(bill => ({
      ...bill,
      date: formatDate(bill.date),
      createdAt: formatDate(bill.createdAt),
      updatedAt: formatDate(bill.updatedAt),
      returnDate: formatDate(bill.returnDate),
    }));
    res.status(200).json({ success: true, bills: formattedBills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE BILL
export const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);

    if (!bill)
      return res.status(404).json({ success: false, message: "Bill not found" });

    res.status(200).json({ success: true, message: "Bill deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//return bill
export const returnBill = async (req, res) => {
  try {
    const billId = req.params.id;

    let bill = await Bill.findById(billId);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    // If already returned
    if (bill.isReturned) {
      return res.status(400).json({
        success: false,
        message: "Bill is already returned",
      });
    }

    bill.isReturned = true;
    bill.returnDate = new Date();
    bill.paymentStatus = "UNPAID"; // optional: depending your logic

    await bill.save();

    res.status(200).json({
      success: true,
      message: "Bill returned successfully",
      bill,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE PAYMENT STATUS
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required",
      });
    }

    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!updatedBill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      bill: updatedBill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

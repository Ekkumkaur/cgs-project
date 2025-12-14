import NewBill from "../models/newBill.js";

// ADD NEW BILL
export const addNewBill = async (req, res) => {
  try {
    const bill = new NewBill(req.body);
    await bill.save();

    return res.json({
      success: true,
      message: "New Bill added successfully",
      bill,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL NEW BILLS
export const getAllNewBills = async (req, res) => {
  try {
    const bills = await NewBill.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      bills,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET NEW BILL BY ID
export const getNewBillById = async (req, res) => {
  try {
    const bill = await NewBill.findById(req.params.id);

    return res.json({
      success: true,
      bill,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE NEW BILL
export const updateNewBill = async (req, res) => {
  try {
    const bill = await NewBill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    return res.json({
      success: true,
      message: "Bill updated successfully",
      bill,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE NEW BILL
export const deleteNewBill = async (req, res) => {
  try {
    const bill = await NewBill.findByIdAndDelete(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bill deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// RETURN NEW BILL
export const returnNewBill = async (req, res) => {
  try {
    const billId = req.params.id;

    let bill = await NewBill.findById(billId);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "NewBill not found",
      });
    }

    // Check if already returned
    if (bill.isReturned) {
      return res.status(400).json({
        success: false,
        message: "Bill is already returned",
      });
    }

    bill.isReturned = true;
    bill.returnDate = new Date();

    await bill.save();

    res.status(200).json({
      success: true,
      message: "NewBill returned successfully",
      bill,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

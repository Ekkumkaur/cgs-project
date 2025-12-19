import Purchase from "../models/purchase.js";

// add a new purchase
export const addPurchase = async (req, res) => {
  try {

    // Auto-generate purchaseId if not provided
    let purchaseId = req.body.purchaseId;
    if (!purchaseId) {
      const lastPurchase = await Purchase.findOne().sort({ createdAt: -1 });
      let nextNum = 1;
      if (lastPurchase && lastPurchase.purchaseId) {
        const match = lastPurchase.purchaseId.match(/(\d+)$/);
        if (match) {
          nextNum = parseInt(match[1], 10) + 1;
        }
      }
      purchaseId = `PUR${String(nextNum).padStart(4, "0")}`;
    }

    const mappedItems = req.body.items.map((item) => ({
      product: item.product,
      qty: item.quantity,   // 🔥 FIX HERE
      rate: item.rate,
      amount: item.amount,
    }));

    const purchase = await Purchase.create({
      purchaseId,
      supplier: req.body.supplier,
      date: req.body.date,
      items: mappedItems,
      totalAmount: req.body.totalAmount,
      paymentMethod: req.body.paymentMethod,
      status: req.body.status || "PAID",
    });

    // Populate supplier details for the response
    await purchase.populate("supplier", "name email mobileNumber companyName");

    res.status(201).json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// get all purchases
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplier", "name email mobileNumber companyName")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE PURCHASE
export const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPurchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    res.json({
      success: true,
      data: updatedPurchase,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE PURCHASE
// DELETE PURCHASE
export const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPurchase = await Purchase.findByIdAndDelete(id);

    if (!deletedPurchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    res.json({
      success: true,
      message: "Purchase deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 1️⃣ All purchase vouchers (voucher view only)
export const getPurchaseVouchers = async (req, res) => {
  try {
    const purchases = await Purchase.find({})
      // ❗ items ko select karna MUST hai
      .select("purchaseId date totalAmount status items supplier")
      .populate("supplier", "name")
      .populate({
        path: "items.product",
        select: "productName brandName companyName mrp gstRate"
      })
      .sort({ date: -1 });

    res.json({
      success: true,
      data: purchases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// 2️⃣ Single voucher by voucher no
export const getPurchaseVoucherByNo = async (req, res) => {
  const data = await Purchase.findOne({
    purchaseVoucherNo: req.params.voucherNo,
  })
    .populate("supplier")
    .populate("items.product");

  res.json({ success: true, data });
};

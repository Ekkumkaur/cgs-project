import PurchaseReturn from "../models/return.js";
import Product from "../models/product.js";

// Auto Return ID Generator
async function generateReturnId() {
  const lastReturn = await PurchaseReturn.findOne().sort({ returnId: -1 });

  let nextIdNumber = 1;
  if (lastReturn && lastReturn.returnId) {
    const lastIdNumber = parseInt(lastReturn.returnId.replace("RET-", ""), 10);
    if (!isNaN(lastIdNumber)) {
      nextIdNumber = lastIdNumber + 1;
    }
  }

  return `RET-${nextIdNumber.toString().padStart(3, "0")}`;
}

// Add a new return
export const addReturn = async (req, res) => {
  try {
    const returnId = await generateReturnId();

    const newReturn = await PurchaseReturn.create({
      ...req.body,
      returnId,
    });

    const populatedReturn = await PurchaseReturn.findById(newReturn._id)
      .populate("purchase", "purchaseId date")
      .populate("supplier", "name email phone")
      .populate("product", "productName brandName itemCode mrp costPrice");

    res.status(201).json({
      success: true,
      data: populatedReturn,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all returns
export const getAllReturns = async (req, res) => {
  try {
    const returns = await PurchaseReturn.find()
      .populate("purchase", "purchaseId date")
      .populate("supplier", "name email phone")
      .populate("product", "productName brandName itemCode mrp costPrice")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: returns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update return status (and reduce stock when completed)
export const updateReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const purchaseReturn = await PurchaseReturn.findById(id);
    
    if (!purchaseReturn) {
      return res.status(404).json({
        success: false,
        message: "Return not found",
      });
    }

    // 🔥 Stock minus when status changes to COMPLETED
    if (status === "COMPLETED" && purchaseReturn.status !== "COMPLETED") {
      await Product.findByIdAndUpdate(purchaseReturn.product, {
        $inc: { stock: -purchaseReturn.qty },
      });
    }

    // Update status
    purchaseReturn.status = status;
    await purchaseReturn.save();

    // Return populated data
    const updatedReturn = await PurchaseReturn.findById(id)
      .populate("purchase", "purchaseId date")
      .populate("supplier", "name email phone")
      .populate("product", "productName brandName itemCode mrp costPrice");

    res.json({
      success: true,
      data: updatedReturn,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//update return details
export const updatePurchaseReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedReturn = await PurchaseReturn.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate("purchase supplier product");

    if (!updatedReturn) {
      return res.status(404).json({
        success: false,
        message: "Purchase Return not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedReturn,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


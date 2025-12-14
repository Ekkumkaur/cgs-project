import Supplier from "../models/supplier.js";

// Auto Supplier ID Generator
async function generateSupplierId() {
  const count = await Supplier.countDocuments();
  const num = (count + 1).toString().padStart(3, "0");
  return `CGS${num}`;
}

// ADD SUPPLIER
export const addSupplier = async (req, res) => {
  try {
    const supplierId = await generateSupplierId();

    const supplier = await Supplier.create({
      supplierId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Supplier added successfully",
      supplier,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET ALL SUPPLIERS
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      suppliers,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET SINGLE SUPPLIER
export const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, supplier });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE SUPPLIER
export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!supplier)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({
      success: true,
      message: "Supplier updated successfully",
      supplier,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE SUPPLIER
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, message: "Supplier deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

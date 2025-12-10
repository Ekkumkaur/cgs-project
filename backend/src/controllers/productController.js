import Product from "../models/product.js";
import responseHandler from "../utils/responseHandler.js";
import mongoose from "mongoose";

// Add new product (admin only)
export const addProduct = async (req, res) => {
  try {
    const { category, ...rest } = req.body;
    const product = new Product({ ...rest, category });
    const savedProduct = await product.save();
    // Populate category to return the full object instead of just the ID
    const populatedProduct = await Product.findById(savedProduct._id).populate("category");

    return res
      .status(201)
      .json(responseHandler.success(populatedProduct, "Product added successfully"));
  } catch (err) {
    return res.status(400).json(responseHandler.error(err.message));
  }
};

// Get product by ID (public)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product)
      return res.status(404).json(responseHandler.error("Product not found"));
    return res.json(responseHandler.success(product, "Product retrieved successfully"));
  } catch (err) {
    return res.status(500).json(responseHandler.error(err.message));
  }
};

// Get all products (public)
export const getAllProducts = async (req, res) => {
  try {
    const { page, limit, offset } = req;
    // Extract query params
    const {
      sortBy = "createdAt",
      sortOrder = "desc",
      category,
      brandName,
      minPrice,
      maxPrice,
      discount,
      search
    } = req.query;

    // Build filter
    const filter = {};

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = new mongoose.Types.ObjectId(category);
    }

    if (brandName) {
      filter.brandName = { $regex: brandName, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.mrp = {};
      if (minPrice) filter.mrp.$gte = Number(minPrice);
      if (maxPrice) filter.mrp.$lte = Number(maxPrice);
    }

    if (discount) {
      filter.discount = { $regex: discount, $options: "i" };
    }

    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brandName: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    // Query DB with filters, sorting, and pagination
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name") // only fetch category name
        .select(
          "brandName productName mrp discount stock image description category packSize size hsnCode itemCode costPrice gst"
        ) // ✅ only expose safe fields
        .sort(sortOptions)
        .skip(offset)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    const response = {
      rows: products,
      count: total,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };

    return res.json(
      responseHandler.success(response, "Products fetched successfully")
    );
  } catch (err) {
    return res.status(500).json(responseHandler.error(err.message));
  }
};

// Update product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json(responseHandler.error("Product not found"));

    // Update product fields from the request body
    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key] ?? product[key];
    });

    const updatedProduct = await product.save();
    // Re-populate the category field to ensure the full object is returned
    const populatedProduct = await Product.findById(updatedProduct._id).populate("category");

    return res.json(
      responseHandler.success(populatedProduct, "Product updated successfully")
    );
  } catch (err) {
    return res.status(500).json(responseHandler.error(err.message));
  }
};

// Delete product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json(responseHandler.error("Product not found"));

    return res.json(
      responseHandler.success(null, "Product deleted successfully")
    );
  } catch (err) {
    return res.status(500).json(responseHandler.error(err.message));
  }
};

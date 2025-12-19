import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Admin from "../models/admin.js"; // ✅ NEW
import { USER_ROLES } from "../constants/auth.js";

// Protect route (JWT) → works for ADMIN + USER
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔑 Role based resolve
    if (decoded.role === USER_ROLES.ADMIN) {
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      req.user = admin;          // 👈 same variable
      req.user.role = USER_ROLES.ADMIN;
    } else {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user;
      req.user.role = user.role; // Use the role from the user document
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Admin-only middleware (NO CHANGE IN USAGE)
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Authentication required" });
  }

  if (req.user.role === USER_ROLES.ADMIN) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Access denied. Admin only." });
  }
};

export default protect;
export { adminOnly };

import dotenv from "dotenv";
import { connectDB, disconnectDB } from "../config/db.js";
import Admin from "../models/admin.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const adminPhone = process.env.ADMIN_PHONE || "9876543210";

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const admin = await Admin.create({
      firstName: "Super",
      lastName: "Admin",
      email: adminEmail,
      phoneNumber: adminPhone,
      password: adminPassword,
      role: "admin",
    });

    console.log("✅ Admin seeded successfully");
    console.log("Email:", admin.email);
    console.log("Password:", adminPassword);
  } catch (err) {
    console.error(err);
  } finally {
    await disconnectDB();
  }
};

seedAdmin();

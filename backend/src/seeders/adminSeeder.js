import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../config/db.js";
import User from "../models/user.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const adminPhone = process.env.ADMIN_PHONE || "9876543210";

    const existingAdmin = await User.findOne({ email: adminEmail, role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      return;
    }

    const admin = await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: adminEmail,
      phoneNumber: adminPhone,
      password: adminPassword,
      role: "admin",
      isPhoneVerified: true,
      isEmailVerified: true,
      isNewUser: false,
      lastLogin: new Date(),
    });

    console.log("✅ Admin user created successfully!");
    console.log("Email:", admin.email);
    console.log("Password:", adminPassword);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  } finally {
    await disconnectDB();
  }
};

seedAdmin();

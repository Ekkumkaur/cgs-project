// models/bill.model.js
import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    agentName: { type: String, required: true },
    billId: { type: String, required: true, unique: true },
    date: { type: Date, required: true },

    customerName: { type: String, required: true },

    discount: { type: Number, default: 0 },

    sgst: { type: Number, default: 0 }, // %
    cgst: { type: Number, default: 0 }, // %

    totalAmount: { type: Number, required: true },

    amountAfterDiscount: { type: Number }, // Auto calc

    paymentStatus: {
      type: String,
      enum: ["PAID", "UNPAID"],
      default: "UNPAID",
    },

    // models/bill.model.js

    isReturned: {
      type: Boolean,
      default: false,
    },
    returnDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Auto Calculate: amountAfterDiscount = totalAmount - discount
billSchema.pre("save", function (next) {
  this.amountAfterDiscount = this.totalAmount - this.discount;
  next();
});

export default mongoose.model("Bill", billSchema);

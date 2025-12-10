
import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  agentName: { type: String, default: "", required: true },
  billId: { type: String, required: true },
  date: { type: Date, required: true },
  customerName: { type: String, default: "", required: true },
  sgst: { type: Number, required: true },
  cgst: { type: Number, required: true },
  amount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ["PAID", "UNPAID", "PENDING"], 
    default: "UNPAID" 
  }
}, { timestamps: true });

export default mongoose.model("Bill", billSchema);

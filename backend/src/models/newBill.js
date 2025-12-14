import mongoose from "mongoose";

const newBillItemSchema = new mongoose.Schema({
  sno: Number,
  adItemCode: String,
  itemCode: String,
  itemName: String,
  companyName: String,
  hsnCode: String,
  packing: String,
  lot: String,
  mrp: Number,
  qty: Number,
  cd: Number,
  netAmount: Number,
  tax: Number,
});

const newBillSchema = new mongoose.Schema(
  {
    newBillId: { type: String, required: true },
    date: { type: Date, required: true },

    partyName: String,
    partyType: String,

    items: [newBillItemSchema],

    totalAmount: Number,
    totalTax: Number,
    grandTotal: Number,

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

export default mongoose.model("NewBill", newBillSchema);

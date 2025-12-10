// controllers/ledgerController.js
import Ledger from "../models/ledger.js";

/**
 * Create / Add ledger entry
 * Body:
 * {
 *  partyType, partyId, partyName, mobileNumber,
 *  type, referenceNo, paymentMethod, debit, credit, dueDate
 * }
 */
export const addLedgerEntry = async (req, res) => {
  try {
    const {
      partyType,
      partyId,
      partyName,
      mobileNumber,
      type,
      referenceNo,
      paymentMethod,
      debit = 0,
      credit = 0,
      dueDate = null,
      date = null
    } = req.body;

    if (!partyType || !partyId || !partyName || !type || !referenceNo) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Fetch newest balance for this party
    const lastEntry = await Ledger.findOne({ partyId }).sort({ date: -1, createdAt: -1 });

    const lastBalance = lastEntry ? (lastEntry.balance || 0) : 0;
    // Balance logic: balance = previous + credit - debit
    const newBalance = lastBalance + Number(credit || 0) - Number(debit || 0);

    const entry = new Ledger({
      date: date ? new Date(date) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      partyType,
      partyId,
      partyName,
      mobileNumber,
      type,
      referenceNo,
      paymentMethod,
      debit: Number(debit || 0),
      credit: Number(credit || 0),
      balance: newBalance,
    });

    await entry.save();

    return res.status(201).json({ success: true, message: "Entry added", entry });
  } catch (err) {
    console.error("addLedgerEntry:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get Supplier Ledger
 * Query params:
 *  search - matches partyName, partyId, referenceNo
 *  filterType - e.g. Purchase or Payment
 *  fromDate / toDate - YYYY-MM-DD (optional)
 *  page / limit - pagination (optional)
 */
export const getSupplierLedger = async (req, res) => {
  try {
    const { search, filterType, fromDate, toDate, page = 1, limit = 1000 } = req.query;
    const q = { partyType: "supplier" };

    if (search) {
      q.$or = [
        { partyName: { $regex: search, $options: "i" } },
        { partyId: { $regex: search, $options: "i" } },
        { referenceNo: { $regex: search, $options: "i" } },
      ];
    }

    if (filterType && filterType.trim() !== "") {
  q.type = filterType;
}

   if ((fromDate && fromDate !== "") || (toDate && toDate !== "")) {
  q.date = {};
  if (fromDate && fromDate !== "") q.date.$gte = new Date(fromDate);

  if (toDate && toDate !== "") {
    const d = new Date(toDate);
    d.setHours(23, 59, 59, 999);
    q.date.$lte = d;
  }
}

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

    const [data, totalCount] = await Promise.all([
      Ledger.find(q).sort({ date: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Ledger.countDocuments(q)
    ]);

    const totalDebit = data.reduce((acc, cur) => acc + (cur.debit || 0), 0);
    const totalCredit = data.reduce((acc, cur) => acc + (cur.credit || 0), 0);
    const netBalance = totalDebit - totalCredit;

    return res.json({
      success: true,
      totalCount,
      page: Number(page),
      limit: Number(limit),
      totalDebit,
      totalCredit,
      netBalance,
      ledger: data,
    });
  } catch (err) {
    console.error("getSupplierLedger:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get Customer Ledger
 * Query params same as supplier endpoint
 */
export const getCustomerLedger = async (req, res) => {
  try {
    const { search, filterType, fromDate, toDate, page = 1, limit = 1000 } = req.query;
    const q = { partyType: "customer" };

    if (search) {
      q.$or = [
        { partyName: { $regex: search, $options: "i" } },
        { partyId: { $regex: search, $options: "i" } },
        { referenceNo: { $regex: search, $options: "i" } },
      ];
    }

    if (filterType) q.type = filterType;

    if (fromDate || toDate) {
      q.date = {};
      if (fromDate) q.date.$gte = new Date(fromDate);
      if (toDate) {
        const d = new Date(toDate);
        d.setHours(23,59,59,999);
        q.date.$lte = d;
      }
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

    const [data, totalCount] = await Promise.all([
      Ledger.find(q).sort({ date: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Ledger.countDocuments(q)
    ]);

    const totalDebit = data.reduce((acc, cur) => acc + (cur.debit || 0), 0);
    const totalCredit = data.reduce((acc, cur) => acc + (cur.credit || 0), 0);

    // number of distinct customers with non-zero current balance (approx)
    const customersWithBalance = await Ledger.aggregate([
      { $match: { partyType: "customer" } },
      { $group: { _id: "$partyId", lastBalance: { $last: "$balance" } } },
      { $match: { lastBalance: { $ne: 0 } } },
      { $count: "count" }
    ]);
    const customersWithBalanceCount = (customersWithBalance[0] && customersWithBalance[0].count) || 0;

    return res.json({
      success: true,
      totalCount,
      page: Number(page),
      limit: Number(limit),
      totalDebit,
      totalCredit,
      customersWithBalance: customersWithBalanceCount,
      ledger: data,
    });
  } catch (err) {
    console.error("getCustomerLedger:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

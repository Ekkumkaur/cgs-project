import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { AdminLayout } from "../components/AdminLayout";
import { getPurchaseVoucher } from "@/adminApi/purchaseDetailApi";
import { toast } from "sonner";
import { format } from "date-fns";

export default function PurchaseVoucher() {
  const [items, setItems] = useState<any[]>([]);
  const [voucherData, setVoucherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVoucherData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPurchaseVoucher();
      if (response.success) {
        // The API returns an array, but we probably need the first item.
        const voucher = response.data && response.data.length > 0 ? response.data[0] : null;
        if (voucher) {
          setVoucherData(voucher);
          // Assuming items have a unique 'product' or '_id' field to use as a key
          const processedItems = (voucher.items || []).map((item: any, index: number) => ({
            ...item,
            id: item._id || `item-${index}` // Ensure a unique id for each item
          }));
          setItems(processedItems);
        }
      } else {
        toast.error(response.message || "Failed to fetch voucher data.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the voucher.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVoucherData();
  }, [fetchVoucherData]);

  const handleItemChange = (id: string, field: string, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate amount when quantity or rate changes
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = (updatedItem.quantity || 0) * (updatedItem.rate || 0);
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `new-${items.length + 1}`, // Use a unique key for new items
        company: "",
        product: "",
        quantity: 1,
        rate: 0,
        discount: 0,
        gstType: "IGST",
        gstRate: "18%",
      },
    ]);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const total = items.reduce(
    (sum, item) => sum + (item.amount || (item.rate || 0) * (item.quantity || 0)),
    0
  );

  return (
    <AdminLayout title="Purchase > Purchase Voucher">
      {loading && (
        <div className="flex justify-center items-center h-64">
          <p>Loading Voucher...</p>
        </div>
      )}

      {!loading && voucherData && (
      <div className="p-8 max-w-7xl mx-auto">

        {/* TOP FORM */}
        <div className="bg-[#E8D4C0] rounded-lg p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            New Purchase Voucher
          </h2>

          {/* Header Row */}
          <div className="grid grid-cols-3 gap-0 bg-white rounded-t-md border border-gray-200">
            <div className="border-r border-gray-200 px-4 py-3">
              <label className="block text-xs font-medium text-gray-700">Bill No.</label>
            </div>
            <div className="border-r border-gray-200 px-4 py-3">
              <label className="block text-xs font-medium text-gray-700">Date</label>
            </div>
            <div className="px-4 py-3">
              <label className="block text-xs font-medium text-gray-700">Supplier</label>
            </div>
          </div>

          {/* Data Row */}
          <div className="grid grid-cols-3 gap-0 bg-white rounded-b-md border border-t-0 border-gray-200">
            <div className="border-r border-gray-200 px-4 py-3">
              <Input className="bg-white border-0 text-sm h-auto p-0 focus:ring-0" value={voucherData.purchaseId || ''} readOnly />
            </div>

            <div className="border-r border-gray-200 px-4 py-3">
              <Input className="bg-white border-0 text-sm h-auto p-0 focus:ring-0" value={voucherData.date ? format(new Date(voucherData.date), "dd-MMM-yyyy") : ''} readOnly />
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-700">{voucherData.supplierName || 'N/A'}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* PURCHASE ITEM TABLE */}
        <div className="mb-4">
          <div className="flex justify-center mb-4">
            <Button
              onClick={handleAddItem}
              className="bg-[#E89B87] hover:bg-[#d88976] text-white rounded-full px-5 py-2 text-sm h-9"
            >
              + Add Item
            </Button>
          </div>
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            Purchase Item
          </h2>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="min-w-full text-xs">
            <thead className="bg-[#E8D4C0]">
              <tr>
                <th className="py-3 px-3 text-left font-medium text-gray-700">S.No</th>
                <th className="py-3 px-3 text-left font-medium text-gray-700">Company Name</th>
                <th className="py-3 px-3 text-left font-medium text-gray-700">Product</th>
                <th className="py-3 px-3 text-left font-medium text-gray-700">Quantity</th>
                <th className="py-3 px-3 text-left font-medium text-gray-700">Rate</th>
                <th className="py-3 px-3 text-left font-medium text-gray-700">Amount</th>
                <th className="py-3 px-3 text-left font-medium text-gray-700">Discount Type</th>
                <th className="py-3 px-3 text-left font-medium text-gray-700">GST</th>
                <th className="py-3 px-3 text-left font-medium text-gray-700">GST Rate</th>
                <th className="py-3 px-3 text-left font-medium text-gray-700">GST</th>
                <th className="py-3 px-3 text-left font-medium text-gray-700">GST Rate</th>
                <th className="py-3 px-3 text-left font-medium text-gray-700">Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-t border-gray-200">
                  <td className="py-3 px-3 text-gray-700">{index + 1}</td>

                  <td className="py-3 px-3">
                    <select 
                      className="border border-gray-300 rounded p-1.5 w-full bg-white text-xs" 
                      value={item.companyName || ''} 
                      onChange={(e) => handleItemChange(item.id, 'companyName', e.target.value)}
                    >
                      {/* You might want to populate this with a list of companies */}
                      <option value={item.companyName || ''}>{item.companyName || 'Select Company'}</option>
                    </select>
                  </td>

                  <td className="py-3 px-3">
                    <select 
                      className="border border-gray-300 rounded p-1.5 w-full bg-white text-xs" 
                      value={item.productName || ''} 
                      onChange={(e) => handleItemChange(item.id, 'productName', e.target.value)}
                    >
                      {/* This should be populated based on the selected company */}
                      <option value={item.productName || ''}>{item.productName || 'Select Product'}</option>
                    </select>
                  </td>

                  <td className="py-3 px-3">
                    <Input
                      type="number"
                      value={item.quantity || ''}
                      className="w-16 border-gray-300 h-8 text-xs"
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value))}
                    />
                  </td>

                  <td className="py-3 px-3">
                    <Input
                      type="number"
                      value={item.rate || ''}
                      className="w-20 border-gray-300 h-8 text-xs"
                      onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value))}
                    />
                  </td>

                  <td className="py-3 px-3 text-gray-700">{(item.amount || 0).toLocaleString('en-IN')}</td>

                  <td className="py-3 px-3">
                    <select 
                      className="border border-gray-300 rounded p-1.5 w-20 bg-white text-xs" 
                      value={item.discountType || 'percentage'}
                      onChange={(e) => handleItemChange(item.id, 'discountType', e.target.value)}
                    >
                      <option value="percentage">{item.discount || 0}%</option>
                      <option value="amount">Amount</option>
                    </select>
                  </td>

                  <td className="py-3 px-3">
                    <select className="border border-gray-300 rounded p-1.5 w-20 bg-white text-xs">
                      <option>IGST</option>
                      <option>CGST</option>
                      <option>SGST</option>
                    </select>
                  </td>

                  <td className="py-3 px-3">
                    <select className="border border-gray-300 rounded p-1.5 w-16 bg-white text-xs">
                      <option>18%</option>
                    </select>
                  </td>

                  <td className="py-3 px-3">
                    <select className="border border-gray-300 rounded p-1.5 w-20 bg-white text-xs">
                      <option>IGST</option>
                    </select>
                  </td>

                  <td className="py-3 px-3">
                    <select className="border border-gray-300 rounded p-1.5 w-16 bg-white text-xs">
                      <option>18%</option>
                    </select>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button onClick={() => handleDeleteItem(item.id)}>
                      <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTAL SECTION */}
        <div className="mt-6 flex justify-center">
          <div className="bg-[#E89B87] text-white text-sm font-medium px-20 py-3 rounded-lg">
            Total Amount : ₹{total.toLocaleString('en-IN')}
          </div>
        </div>

        {/* NOTES */}
        <div className="mt-8">
          <label className="block text-xs font-semibold text-gray-800 mb-2">
            Notes / Additional Information
          </label>
          <textarea
            placeholder="Enter Any Additional Remark Or Note......."
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm h-20 resize-none"
          />
        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex justify-center gap-4">
          <Button className="bg-gray-400 hover:bg-gray-500 text-white px-16 py-5 rounded-full text-sm">
            Cancel
          </Button>

          <Button className="bg-[#E89B87] hover:bg-[#d88976] text-white px-16 py-5 rounded-full text-sm">
            Save Voucher
          </Button>
        </div>
      </div>
      )}
    </AdminLayout>
  );
}
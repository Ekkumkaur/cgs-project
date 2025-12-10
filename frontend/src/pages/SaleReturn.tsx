"use client";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Search, Edit, Trash2, Barcode } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SaleReturn() {
  const [openPreview, setOpenPreview] = useState(false);
  const [openProductDetail, setOpenProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const rows = [
    {
      id: 1,
      sno: "01.",
      adItemCode: "23245",
      itemCode: "0026",
      itemName: "Colorbar Nail paint",
      companyName: "Colorbar",
      hsnCode: "3304",
      packing: "DD",
      lot: "02",
      mrp: "02",
      qty: "10",
      cd: "210",
      netAmount: "404.99",
      tax: "9.1",
      saleReturn: "1",
    },
    {
      id: 2,
      sno: "02.",
      adItemCode: "23245",
      itemCode: "0026",
      itemName: "Colorbar Nail paint",
      companyName: "Colorbar",
      hsnCode: "3304",
      packing: "DD",
      lot: "02",
      mrp: "02",
      qty: "10",
      cd: "210",
      netAmount: "404.99",
      tax: "9.1",
      saleReturn: "1",
    },
  ];

  const initialColumns = [
    { id: "sno", label: "SNO." },
    { id: "adItemCode", label: "Ad. item code" },
    { id: "itemCode", label: "ITEM CODE" },
    { id: "itemName", label: "ITEM NAME" },
    { id: "companyName", label: "COMPANY NAME" },
    { id: "hsnCode", label: "HSN CODE" },
    { id: "packing", label: "PACKING" },
    { id: "lot", label: "LOT" },
    { id: "mrp", label: "MRP" },
    { id: "qty", label: "QTY" },
    { id: "cd", label: "C.D" },
    { id: "netAmount", label: "NET AMOUNT" },
    { id: "tax", label: "TAX" },
    { id: "saleReturn", label: "SALE RETURN" },
    { id: "actions", label: "ACTIONS" },
  ];

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("saleReturnTableColumnOrder");
    return savedOrder ? JSON.parse(savedOrder) : initialColumns;
  });

  useEffect(() => {
    localStorage.setItem("saleReturnTableColumnOrder", JSON.stringify(columns));
  }, [columns]);

  const SortableHeader = ({ column }: { column: { id: string; label: string } }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: column.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <th
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="py-3 px-4 whitespace-nowrap cursor-grab"
      >
        {column.label}
      </th>
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <AdminLayout title="Bill Generation > New Bill > Sale Return">
      <div className="p-4 sm:p-6 bg-white min-h-screen text-[#3E3E3E] flex flex-col justify-between overflow-hidden relative">
        {/* === Top Section === */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Input
                  placeholder="Search by name"
                  className="pl-10 w-full h-10 bg-gradient-to-r from-[#FBEFEF] to-[#FFE7E7] border border-[#F8C7B6] rounded-full shadow-sm placeholder:text-[#B27272] focus:ring-0 focus:border-none"
                />
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-[#E57373]"
                />
              </div>

              <Button className="bg-[#E57373] hover:bg-[#d75a5a] text-white rounded-full px-6 py-2 shadow-md whitespace-nowrap">
                Add Product
              </Button>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <Button className="bg-[#E57373] hover:bg-[#d75a5a] text-white rounded-full px-6 py-2 shadow-md whitespace-nowrap">
                Modify Bill
              </Button>
              <Button className="bg-[#E57373] hover:bg-[#d75a5a] text-white rounded-full px-6 py-2 shadow-md whitespace-nowrap">
                New Bill
              </Button>
            </div>
          </div>

          {/* === Table === */}
          <div className="bg-white p-3 rounded-xl shadow-sm overflow-x-auto border border-[#F3D9D9]">
            {(() => {
              const columnIds = columns.map((c) => c.id);
              const renderCell = (row: any, columnId: string) => {
                switch (columnId) {
                  case "sno": return <td className="py-3 px-4">{row.sno}</td>;
                  case "adItemCode": return <td className="py-3 px-4">{row.adItemCode}</td>;
                  case "itemCode": return <td className="py-3 px-4">{row.itemCode}</td>;
                  case "itemName": return <td className="py-3 px-4">{row.itemName}</td>;
                  case "companyName": return <td className="py-3 px-4">{row.companyName}</td>;
                  case "hsnCode": return <td className="py-3 px-4">{row.hsnCode}</td>;
                  case "packing": return <td className="py-3 px-4">{row.packing}</td>;
                  case "lot": return <td className="py-3 px-4">{row.lot}</td>;
                  case "mrp": return <td className="py-3 px-4">{row.mrp}</td>;
                  case "qty": return <td className="py-3 px-4">{row.qty}</td>;
                  case "cd": return <td className="py-3 px-4">{row.cd}</td>;
                  case "netAmount": return <td className="py-3 px-4">{row.netAmount}</td>;
                  case "tax": return <td className="py-3 px-4">{row.tax}</td>;
                  case "saleReturn": return <td className="py-3 px-4">{row.saleReturn}</td>;
                  case "actions": return (
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center items-center space-x-3">
                        <Edit size={18} className="text-[#E57373] cursor-pointer hover:scale-110 transition" />
                        <Trash2 size={18} className="text-[#E57373] cursor-pointer hover:scale-110 transition" />
                        <Barcode
                          size={18}
                          className="text-[#E57373] cursor-pointer hover:scale-110 transition"
                          onClick={() => {
                            setSelectedProduct(row);
                            setOpenProductDetail(true);
                          }}
                        />
                      </div>
                    </td>
                  );
                  default: return null;
                }
              };

              return (
                <table className="min-w-full text-sm text-left text-[#3E3E3E] border border-[#F3D9D9] rounded-lg">
                  <thead className="bg-[#FFEAEA] font-semibold">
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                        <tr>
                          {columns.map((column) => (
                            <SortableHeader key={column.id} column={column} />
                          ))}
                        </tr>
                      </SortableContext>
                    </DndContext>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr
                        key={r.id}
                        className="bg-white hover:bg-[#FFF7F7] transition-colors border-t border-[#F3D9D9]"
                      >
                        {columns.map((col) => renderCell(r, col.id))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>

        {/* === Bottom Buttons (Fixed) === */}
        <div className="fixed bottom-6 right-8 flex flex-col sm:flex-row gap-4 z-50">
          <Button
            onClick={() => setOpenPreview(true)}
            className="bg-[#E57373] hover:bg-[#d75a5a] text-white rounded-md px-8 py-2 shadow-md"
          >
            Preview Bill
          </Button>
          <Button className="bg-[#E57373] hover:bg-[#d75a5a] text-white rounded-md px-8 py-2 shadow-md">
            Generate Bill
          </Button>
        </div>
      </div>

      {/* === Preview Modal === */}
      <Dialog open={openPreview} onOpenChange={setOpenPreview}>
        <DialogContent className="max-w-6xl w-[95vw] bg-white rounded-3xl p-5 sm:p-10 shadow-lg border-none overflow-hidden">
          <div className="overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[#1B2A38] text-base sm:text-lg mb-6 gap-3">
              <p>
                Customer Name: <span className="font-bold">Rahul Sharma</span>
              </p>
              <p>
                Customer Code: <span className="font-bold">CGS0021</span>
              </p>
            </div>

            <h2 className="text-center font-semibold text-[#1B2A38] mb-6">
              Enter your Product details
            </h2>

            <table className="min-w-full text-sm text-left text-[#1B2A38] border border-gray-200 rounded-md">
              <thead>
                <tr className="border-b border-gray-300 bg-[#FDF5F5]">
                  {[
                    "SNO.",
                    "Ad. item code",
                    "ITEM CODE",
                    "ITEM NAME",
                    "COMPANY NAME",
                    "HSN CODE",
                    "PACKING",
                    "LOT",
                    "MRP",
                    "QTY",
                    "C.D",
                    "NET AMOUNT",
                    "TAX",
                  ].map((head, i) => (
                    <th key={i} className="py-2 px-3 whitespace-nowrap">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={i}
                    className="bg-[#F9FAFB] hover:bg-[#F5F5F5] transition"
                  >
                    <td className="py-3 px-4">{r.sno}</td>
                    <td className="py-3 px-4">{r.adItemCode}</td>
                    <td className="py-3 px-4">{r.itemCode}</td>
                    <td className="py-3 px-4">{r.itemName}</td>
                    <td className="py-3 px-4">{r.companyName}</td>
                    <td className="py-3 px-4">{r.hsnCode}</td>
                    <td className="py-3 px-4">{r.packing}</td>
                    <td className="py-3 px-4">{r.lot}</td>
                    <td className="py-3 px-4">{r.mrp}</td>
                    <td className="py-3 px-4">{r.qty}</td>
                    <td className="py-3 px-4">{r.cd}</td>
                    <td className="py-3 px-4">{r.netAmount}</td>
                    <td className="py-3 px-4">{r.tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center mt-8">
              <Button className="bg-[#E98C81] hover:bg-[#df7c72] text-white rounded-full px-10 py-3 font-medium shadow-md">
                Save & Print
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* === Product Details Modal === */}
      <Dialog open={openProductDetail} onOpenChange={setOpenProductDetail}>
        <DialogContent className="max-w-md w-[85vw] bg-white rounded-xl p-5 shadow-lg border-none max-h-[80vh] overflow-y-auto">
          {selectedProduct && (
            <div>
              <h2 className="text-lg font-bold text-[#1B2A38] mb-4 text-center">
                Product Details
              </h2>
              
              <div className="space-y-2 text-[#3E3E3E] text-sm">
                <div className="bg-[#FFF7F7] p-3 rounded-lg border border-[#F3D9D9] flex justify-between">
                  <span className="text-[#B27272]">Serial Number:</span>
                  <span className="font-semibold">{selectedProduct.sno}</span>
                </div>
                
                <div className="bg-[#FFF7F7] p-3 rounded-lg border border-[#F3D9D9] flex justify-between">
                  <span className="text-[#B27272]">Ad. Item Code:</span>
                  <span className="font-semibold">{selectedProduct.adItemCode}</span>
                </div>
                
                <div className="bg-[#FFF7F7] p-3 rounded-lg border border-[#F3D9D9] flex justify-between">
                  <span className="text-[#B27272]">Item Code:</span>
                  <span className="font-semibold">{selectedProduct.itemCode}</span>
                </div>
                
                <div className="bg-[#FFF7F7] p-3 rounded-lg border border-[#F3D9D9] flex justify-between">
                  <span className="text-[#B27272]">Item Name:</span>
                  <span className="font-semibold">{selectedProduct.itemName}</span>
                </div>
                
                <div className="bg-[#FFF7F7] p-3 rounded-lg border border-[#F3D9D9] flex justify-between">
                  <span className="text-[#B27272]">Company Name:</span>
                  <span className="font-semibold">{selectedProduct.companyName}</span>
                </div>
                
                <div className="bg-[#FFF7F7] p-3 rounded-lg border border-[#F3D9D9] flex justify-between">
                  <span className="text-[#B27272]">HSN Code:</span>
                  <span className="font-semibold">{selectedProduct.hsnCode}</span>
                </div>
                
                <div className="bg-[#FFF7F7] p-3 rounded-lg border border-[#F3D9D9] flex justify-between">
                  <span className="text-[#B27272]">Packing:</span>
                  <span className="font-semibold">{selectedProduct.packing}</span>
                </div>
                
                <div className="bg-[#FFF7F7] p-3 rounded-lg border border-[#F3D9D9] flex justify-between">
                  <span className="text-[#B27272]">Lot:</span>
                  <span className="font-semibold">{selectedProduct.lot}</span>
                </div>
                
                <div className="bg-[#FFF7F7] p-3 rounded-lg border border-[#F3D9D9] flex justify-between">
                  <span className="text-[#B27272]">MRP:</span>
                  <span className="font-semibold">₹{selectedProduct.mrp}</span>
                </div>
                
                <div className="bg-[#FFF7F7] p-3 rounded-lg border border-[#F3D9D9] flex justify-between">
                  <span className="text-[#B27272]">Quantity:</span>
                  <span className="font-semibold">{selectedProduct.qty}</span>
                </div>
                
                <div className="bg-[#FFF7F7] p-3 rounded-lg border border-[#F3D9D9] flex justify-between">
                  <span className="text-[#B27272]">C.D:</span>
                  <span className="font-semibold">{selectedProduct.cd}</span>
                </div>
                
                <div className="bg-[#FFF7F7] p-3 rounded-lg border border-[#F3D9D9] flex justify-between">
                  <span className="text-[#B27272]">Net Amount:</span>
                  <span className="font-semibold">₹{selectedProduct.netAmount}</span>
                </div>
                
                <div className="bg-[#FFF7F7] p-3 rounded-lg border border-[#F3D9D9] flex justify-between">
                  <span className="text-[#B27272]">Tax:</span>
                  <span className="font-semibold">{selectedProduct.tax}%</span>
                </div>
                
                <div className="bg-[#FFF7F7] p-3 rounded-lg border border-[#F3D9D9] flex justify-between">
                  <span className="text-[#B27272]">Sale Return:</span>
                  <span className="font-semibold">{selectedProduct.saleReturn}</span>
                </div>
              </div>

              <div className="flex justify-center mt-5">
                <Button 
                  onClick={() => setOpenProductDetail(false)}
                  className="bg-[#E57373] hover:bg-[#d75a5a] text-white rounded-full px-6 py-2 shadow-md text-sm"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
"use client";
import { AdminLayout } from "@/components/AdminLayout";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function BillWiseReport() {
  const rows = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    sno: `${i + 1}.`,
    billDate: "01-NOV-25",
    billNumber: `GST-${9962 + i}`,
    partyName: "Aroma Beauty Store",
    billAmt: "₹1300",
    totalQty: "3",
    gstSale: "0",
    sgstOutput: "1158",
    cgstOutput: "1158",
  }));

  const initialColumns = [
    { id: "sno", label: "SNO." },
    { id: "billDate", label: "BILL DATE" },
    { id: "billNumber", label: "BILL NUMBER" },
    { id: "partyName", label: "PARTY NAME" },
    { id: "billAmt", label: "BILL AMT" },
    { id: "totalQty", label: "TOTAL QTY" },
    { id: "gstSale", label: "GST SALE ₹" },
    { id: "sgstOutput", label: "SGST OUTPUT ₹" },
    { id: "cgstOutput", label: "CGST OUTPUT ₹" },
  ];

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("billWiseReportColumnOrder");
    return savedOrder ? JSON.parse(savedOrder) : initialColumns;
  });

  useEffect(() => {
    localStorage.setItem("billWiseReportColumnOrder", JSON.stringify(columns));
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
        className="p-3 cursor-grab"
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
    <AdminLayout title="Report > Sale Tax bill wise report">
      <div className="p-6">
        {/* Search and Filter Section */}
        {/* Search and Filter Section */}
        <div className="flex items-center justify-start gap-4 mb-6">
          {/* Search Input */}
          <Input
            placeholder="Search by Bill ID, Number, party name"
            className="bg-[#FFF3EF] placeholder:text-gray-500 text-sm w-[320px] h-[36px] 
               rounded-full border-none focus-visible:ring-0 focus-visible:ring-offset-0
               focus:outline-none shadow-sm px-4"
          />

          {/* Search Button (separate round icon) */}
          <Button
            className="bg-[#E98C81] hover:bg-[#d97b71] text-white rounded-full w-[36px] h-[36px] 
               flex items-center justify-center shadow-sm"
          >
            <Search size={16} />
          </Button>

          {/* Date Dropdown */}
          <Select>
            <SelectTrigger
              className="w-[140px] text-sm border-none bg-[#EBEBEB] text-gray-700 rounded-full 
                 shadow-sm h-9 focus:ring-0"
            >
              <SelectValue placeholder="All dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>

          {/* Export Button */}
          <Button className="bg-[#E98C81] hover:bg-[#d97b71] text-white rounded-full px-6 h-9 flex items-center gap-2 shadow-sm">
            <Download size={16} />
            Export
          </Button>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
          {(() => {
            const columnIds = columns.map((c) => c.id);
            const renderCell = (row: any, columnId: string) => {
              switch (columnId) {
                case "sno": return <td className="p-3">{row.sno}</td>;
                case "billDate": return <td className="p-3">{row.billDate}</td>;
                case "billNumber": return <td className="p-3">{row.billNumber}</td>;
                case "partyName": return <td className="p-3">{row.partyName}</td>;
                case "billAmt": return <td className="p-3">{row.billAmt}</td>;
                case "totalQty": return <td className="p-3">{row.totalQty}</td>;
                case "gstSale": return <td className="p-3">{row.gstSale}</td>;
                case "sgstOutput": return <td className="p-3">{row.sgstOutput}</td>;
                case "cgstOutput": return <td className="p-3">{row.cgstOutput}</td>;
                default: return null;
              }
            };

            return (
              <table className="w-full text-sm text-left">
                <thead className="bg-[#FFFFFF] text-gray-700 font-semibold">
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
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-[#FFF6F5]">
                      {columns.map((col) => renderCell(row, col.id))}
                    </tr>
                  ))}
                  <tr className="font-semibold bg-[#FFFFFF]">
                    <td className="p-3" colSpan={4}>
                      TOTAL
                    </td>
                    <td className="p-3">₹16495</td>
                    <td className="p-3">53</td>
                    <td className="p-3">0</td>
                    <td className="p-3">1158</td>
                    <td className="p-3">11742</td>
                  </tr>
                </tbody>
              </table>
            );
          })()}
        </div>

        {/* Summary Cards */}
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <div
            className="bg-[#F8F9FA] border rounded-2xl shadow-sm text-center py-6"
            style={{ width: "201px", height: "97px" }}
          >
            <p className="text-gray-600 text-sm">Total Bills</p>
            <h2 className="text-lg font-semibold">12</h2>
          </div>
          <div
            className="bg-[#E8F8F2] border rounded-2xl shadow-sm text-center py-6"
            style={{ width: "201px", height: "97px" }}
          >
            <p className="text-gray-600 text-sm">Total Amount</p>
            <h2 className="text-lg font-semibold text-[#2B8A6E]">₹16495</h2>
          </div>
          <div
            className="bg-[#FFF1F1] border rounded-2xl shadow-sm text-center py-6"
            style={{ width: "201px", height: "97px" }}
          >
            <p className="text-gray-600 text-sm">Total CGST</p>
            <h2 className="text-lg font-semibold text-[#E98C81]">₹11742.64</h2>
          </div>
          <div
            className="bg-[#FFF1E9] border rounded-2xl shadow-sm text-center py-6"
            style={{ width: "201px", height: "97px" }}
          >
            <p className="text-gray-600 text-sm">Total SGST Bills</p>
            <h2 className="text-lg font-semibold text-[#E98C81]">₹286</h2>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

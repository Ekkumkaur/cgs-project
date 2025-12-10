"use client";
import { AdminLayout } from "@/components/AdminLayout";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Download } from "lucide-react";
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

export default function SaleTaxRegister() {
  const rows = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    sno: i + 1,
    billDate: "01-Nov-25",
    partyName: "Aroma Beauty Store",
    billAmt: "2045606",
    cgst1: "344.63",
    totalqty: "30",
    cgst1_4: "9.75",
    cgst2_5: "1066",
    cgst4: "292",
    cgst6: "5454",
    cgst9: "4581",
    sale12: "1055667",
    sale14: "59",
    sale20: "22574",
  }));

  const initialColumns = [
    { id: "sno", label: "S.NO." },
    { id: "billDate", label: "BILL DATE" },
    { id: "partyName", label: "PARTY NAME" },
    { id: "billAmt", label: "BILL AMT" },
    { id: "totalqty", label: "TOTAL QTY" },
    { id: "cgst1", label: "CGST OUTPUT 1%" },
    { id: "cgst1_4", label: "CGST OUTPUT 1.4%" },
    { id: "cgst2_5", label: "CGST OUTPUT 2.5%" },
    { id: "cgst4", label: "CGST OUTPUT 4%" },
    { id: "cgst6", label: "CGST OUTPUT 6%" },
    { id: "cgst9", label: "CGST OUTPUT 9%" },
    { id: "sale12", label: "CGST SALE 12%" },
    { id: "sale14", label: "CGST SALE 14%" },
    { id: "sale20", label: "CGST SALE 20%" },
  ];

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("saleTaxRegisterColumnOrder");
    return savedOrder ? JSON.parse(savedOrder) : initialColumns;
  });

  useEffect(() => {
    localStorage.setItem("saleTaxRegisterColumnOrder", JSON.stringify(columns));
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
        className="px-4 py-2 text-left border cursor-grab"
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
    <AdminLayout title="Report > Sale Tax Register">
      <div className=" bg-white min-h-screen">
        {/* Header Filters */}
        <div className="flex justify-center items-center gap-8 mb-10">
          {/* From Date */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1 ml-1">
              From Date
            </label>
            <div className="flex items-center gap-2 w-[239px] h-[50px] bg-[#F0F0F0] rounded-md px-3 shadow-sm">
              <Calendar className="w-5 h-5 text-gray-600" />
              <Input
                type="text"
                placeholder="DD-MM-YY"
                className="border-none bg-transparent focus-visible:ring-0 text-sm text-gray-700"
              />
            </div>
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1 ml-1">To Date</label>
            <div className="flex items-center gap-2 w-[239px] h-[50px] bg-[#F0F0F0] rounded-md px-3 shadow-sm">
              <Calendar className="w-5 h-5 text-gray-600" />
              <Input
                type="text"
                placeholder="DD-MM-YY"
                className="border-none bg-transparent focus-visible:ring-0 text-sm text-gray-700"
              />
            </div>
          </div>

          {/* Export Button */}
          <div className="flex flex-col">
            <label className="text-xs opacity-0 mb-1 ml-1">_</label>
            <Button
              className="w-[239px] h-[50px] bg-[#E98C81] hover:bg-[#d87a6f] text-white rounded-full flex items-center justify-center gap-2 shadow-md"
            >
              Export <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="flex gap-6 mb-8 justify-start">
          <div className="bg-[#E98C81] text-white rounded-xl flex flex-col items-center justify-center shadow-sm w-[217px] h-[140px]">
            <p className="text-2xl font-semibold">₹ 41,71,535</p>
            <p className="text-sm font-medium">Total Bill Amount</p>
          </div>
          <div className="bg-[#E98C81] text-white rounded-xl flex flex-col items-center justify-center shadow-sm w-[217px] h-[140px]">
            <p className="text-2xl font-semibold">₹ 22,84,999</p>
            <p className="text-sm font-medium">Total Tax Collected</p>
          </div>
          <div className="bg-[#E98C81] text-white rounded-xl flex flex-col items-center justify-center shadow-sm w-[217px] h-[140px]">
            <p className="text-2xl font-semibold">2</p>
            <p className="text-sm font-medium">Number of Transactions</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          {(() => {
            const columnIds = columns.map((c) => c.id);
            const renderCell = (row: any, columnId: string) => {
              switch (columnId) {
                case "sno": return <td className="px-4 py-2 border">{row.sno}.</td>;
                case "billDate": return <td className="px-4 py-2 border">{row.billDate}</td>;
                case "partyName": return <td className="px-4 py-2 border">{row.partyName}</td>;
                case "billAmt": return <td className="px-4 py-2 border">{row.billAmt}</td>;
                case "totalqty": return <td className="px-4 py-2 border">{row.totalqty}</td>;
                case "cgst1": return <td className="px-4 py-2 border">{row.cgst1}</td>;
                case "cgst1_4": return <td className="px-4 py-2 border">{row.cgst1_4}</td>;
                case "cgst2_5": return <td className="px-4 py-2 border">{row.cgst2_5}</td>;
                case "cgst4": return <td className="px-4 py-2 border">{row.cgst4}</td>;
                case "cgst6": return <td className="px-4 py-2 border">{row.cgst6}</td>;
                case "cgst9": return <td className="px-4 py-2 border">{row.cgst9}</td>;
                case "sale12": return <td className="px-4 py-2 border">{row.sale12}</td>;
                case "sale14": return <td className="px-4 py-2 border">{row.sale14}</td>;
                case "sale20": return <td className="px-4 py-2 border">{row.sale20}</td>;
                default: return null;
              }
            };

            return (
              <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                <thead className="bg-[#E7F2FF] text-gray-700">
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
                    <tr
                      key={row.id}
                      className="border-b hover:bg-gray-50 text-gray-800"
                    >
                      {columns.map((col) => renderCell(row, col.id))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}
        </div>
      </div>
    </AdminLayout>
  );
}

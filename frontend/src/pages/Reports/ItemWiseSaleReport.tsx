"use client";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Download } from "lucide-react";
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

export default function ItemWiseSaleRegister() {
  const rows = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    sno: `${i + 1}`,
    companyName: "Lakme",
    itemName: "Lakme 9to5 CC Cream",
    packSize: "50ml",
    itemCode: "01232876",
    totalQty: "1",
    grossAmt: "₹ 399.00",
  }));

  const initialColumns = [
    { id: "sno", label: "SNO." },
    { id: "companyName", label: "COMPANY NAME" },
    { id: "itemName", label: "ITEM NAME" },
    { id: "packSize", label: "PACK/SIZE" },
    { id: "itemCode", label: "ITEM CODE" },
    { id: "totalQty", label: "TOTAL QTY" },
    { id: "grossAmt", label: "GROSS AMT" },
  ];

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("itemWiseSaleReportColumnOrder");
    return savedOrder ? JSON.parse(savedOrder) : initialColumns;
  });

  useEffect(() => {
    localStorage.setItem("itemWiseSaleReportColumnOrder", JSON.stringify(columns));
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
        className="py-3 px-4 cursor-grab"
      >
        {column.label}
      </th>
    );
  };

  return (
    <AdminLayout title="Reports > Item Wise Sale Report">
      {/* Date Section */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-wrap items-end justify-center gap-4">
          {/* From Date */}
          <div className="flex flex-col">
            <label className="text-[13px] text-gray-500 mb-1">From Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="DD-MM-YY"
                className="pl-10 pr-4 w-[180px] h-[42px] rounded-lg bg-[#F5F5F5] border border-gray-300 text-gray-700 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label className="text-[13px] text-gray-500 mb-1">To Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="DD-MM-YY"
                className="pl-10 pr-4 w-[180px] h-[42px] rounded-lg bg-[#F5F5F5] border border-gray-300 text-gray-700 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Export Button */}
          <div className="flex flex-col">
            <button className="rounded-full text-[13px] text-transparent mb-1 select-none">
              Export
            </button>
            <Button
              className="bg-[#E98C81] hover:bg-[#d87b71] text-white rounded-md w-[160px] h-[38px] text-[14px] font-medium flex items-center justify-center gap-2 shadow-sm"
            >
              Export
              <Download size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {(() => {
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

        const columnIds = columns.map((c) => c.id);

        const renderCell = (row: any, columnId: string) => {
          switch (columnId) {
            case "sno": return <td className="py-3 px-4">{row.sno}</td>;
            case "companyName": return <td className="py-3 px-4">{row.companyName}</td>;
            case "itemName": return <td className="py-3 px-4">{row.itemName}</td>;
            case "packSize": return <td className="py-3 px-4">{row.packSize}</td>;
            case "itemCode": return <td className="py-3 px-4">{row.itemCode}</td>;
            case "totalQty": return <td className="py-3 px-4">{row.totalQty}</td>;
            case "grossAmt": return <td className="py-3 px-4">{row.grossAmt}</td>;
            default: return null;
          }
        };

        return (
          <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                    <tr className="text-left text-gray-700">
                      {columns.map((column) => (
                        <SortableHeader key={column.id} column={column} />
                      ))}
                    </tr>
                  </SortableContext>
                </DndContext>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-50">
                    {columns.map((col) => renderCell(row, col.id))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}
    </AdminLayout>
  );
}

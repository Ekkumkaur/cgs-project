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

export default function HSN() {
  const data = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    sno: "1",
    hsn: "3304",
    gst: "18%",
    qty: "5",
    rate: "₹250",
    taxable: "₹1250",
    cgst: "₹112.50",
    sgst: "₹112.50",
    total: "₹1475",
  }));

  const initialColumns = [
    { id: "sno", label: "SNO." },
    { id: "hsn", label: "HSN CODE" },
    { id: "gst", label: "GST RATE" },
    { id: "qty", label: "QTY" },
    { id: "taxable", label: "TAXABLE AMT" },
    { id: "cgst", label: "CGST" },
    { id: "sgst", label: "SGST" },
    { id: "total", label: "TOTAL AMT" },
  ];

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("hsnReportColumnOrder");
    return savedOrder ? JSON.parse(savedOrder) : initialColumns;
  });

  useEffect(() => {
    localStorage.setItem("hsnReportColumnOrder", JSON.stringify(columns));
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
        className="p-3 text-left font-medium cursor-grab"
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
    <AdminLayout title="Report > HSN Date Wise">
      <div className="p-6 w-full bg-white">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-wrap items-end justify-center gap-4">
            {/* From Date */}
            <div className="flex flex-col">
              <label className="text-[13px] text-gray-500 mb-1">From Date</label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
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
                <Calendar
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="DD-MM-YY"
                  className="pl-10 pr-4 w-[180px] h-[42px] rounded-lg bg-[#F5F5F5] border border-gray-300 text-gray-700 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>

            {/* Export Button */}
            <div className="flex flex-col">
              <label className="text-[13px] text-transparent mb-1 select-none">
                Export
              </label>
              <Button
                className="bg-[#E98C81] hover:bg-[#d87b71] text-white rounded-lg w-[239px] h-[42px] text-[15px] font-medium flex items-center justify-center gap-2 shadow-sm"
              >
                Export
                <Download size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        {(() => {
          const columnIds = columns.map((c) => c.id);
          const renderCell = (row: any, columnId: string, index: number) => {
            switch (columnId) {
              case "sno": return <td className="p-3">{index + 1}.</td>;
              case "hsn": return <td className="p-3">{row.hsn}</td>;
              case "gst": return <td className="p-3">{row.gst}</td>;
              case "qty": return <td className="p-3">{row.qty}</td>;
              case "taxable": return <td className="p-3">{row.taxable}</td>;
              case "cgst": return <td className="p-3">{row.cgst}</td>;
              case "sgst": return <td className="p-3">{row.sgst}</td>;
              case "total": return <td className="p-3">{row.total}</td>;
              default: return null;
            }
          };

          return (
            <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
              <table className="min-w-full bg-white rounded-xl">
                <thead className="bg-[#F8F8F8]">
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                      <tr className="text-gray-700 text-sm">
                        {columns.map((column) => (
                          <SortableHeader key={column.id} column={column} />
                        ))}
                      </tr>
                    </SortableContext>
                  </DndContext>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr
                      key={row.id}
                      className="text-sm text-gray-800 border-b hover:bg-[#FAFAFA] transition"
                    >
                      {columns.map((col) => renderCell(row, col.id, index))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>
    </AdminLayout>
  );
}

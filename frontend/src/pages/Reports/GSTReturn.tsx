"use client";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
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

export default function GSTReturn() {
  const data = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    description: "B2B Invoices",
    docType: "B2CL",
    invoiceValue: "0.0",
    invoiceValueTcs: "0.0",
    taxableValue: "0.0",
    centralTax: "0.0",
    stateTax: "37466.65",
    integratedTax: "22590.98",
    cess: "22590.98",
    totalTax: "22590.98",
  }));

  const initialColumns = [
    { id: "sno", label: "SNO." },
    { id: "description", label: "DESCRIPTION" },
    { id: "docType", label: "DOC TYPE" },
    { id: "invoiceValue", label: "INVOICE VALUE" },
    { id: "invoiceValueTcs", label: "INVOICE VALUE WITH TCS" },
    { id: "taxableValue", label: "TAXABLE VALUE" },
    { id: "centralTax", label: "CENTRAL TAX AMT" },
    { id: "stateTax", label: "STATE UT TAX AMOUNT" },
    { id: "integratedTax", label: "INTEGRATED TAX AMOUNT" },
    { id: "cess", label: "CESS" },
    { id: "totalTax", label: "TOTAL TAX" },
  ];

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("gstReturnColumnOrder");
    return savedOrder ? JSON.parse(savedOrder) : initialColumns;
  });

  useEffect(() => {
    localStorage.setItem("gstReturnColumnOrder", JSON.stringify(columns));
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
        className="border px-4 py-2 font-medium text-left cursor-grab"
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
    <AdminLayout title="Report > GST Return">
      <div className="bg-white p-8 rounded-xl">
        {/* Top Filters */}
        <div className="flex items-center justify-center mb-6 gap-6">
          <div className="flex items-center gap-6 pb-4">
            {/* Date */}
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Date</label>
              <Input
                type="date"
                placeholder="DD-MM-YY"
                className="w-[145px] h-[42px] rounded-[12px] bg-[#EDEDED] border border-gray-200 text-center text-gray-800 font-medium shadow-sm focus-visible:ring-0"
              />
            </div>

            {/* GST Number */}
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">GST Number</label>
              <Input
                placeholder="03AATFC3920N125"
                className="w-[215px] h-[42px] rounded-[12px] bg-[#EDEDED] border border-gray-200 text-center text-gray-800 font-medium shadow-sm focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Export Button */}
          <Button className="flex items-center gap-2 bg-[#F46C6C] hover:bg-[#f35454] text-white text-sm px-6 py-5 h-[42px] rounded-full shadow-sm">
            Export <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Info Card */}
        <div className="rounded-xl p-5 mb-6 bg-[#EBEBEB] shadow-sm border border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-2">
            GSTR1 - Details of outward supplies for 10/2025
          </h2>
          <p className="text-sm text-gray-700">
            Company Name : Cheap General Store
          </p>
          <p className="text-sm text-gray-700">Period Name : 0025-2026</p>
          <p className="text-sm text-gray-700">GST No. : 03AATFC3920N125</p>
          <p className="text-sm text-gray-700">GST Date : 01-Nov-25</p>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
          {(() => {
            const columnIds = columns.map((c) => c.id);
            const renderCell = (row: any, columnId: string, index: number) => {
              switch (columnId) {
                case "sno": return <td className="border px-4 py-2">{index + 1}</td>;
                case "description": return <td className="border px-4 py-2">{row.description}</td>;
                case "docType": return <td className="border px-4 py-2">{row.docType}</td>;
                case "invoiceValue": return <td className="border px-4 py-2">{row.invoiceValue}</td>;
                case "invoiceValueTcs": return <td className="border px-4 py-2">{row.invoiceValueTcs}</td>;
                case "taxableValue": return <td className="border px-4 py-2">{row.taxableValue}</td>;
                case "centralTax": return <td className="border px-4 py-2">{row.centralTax}</td>;
                case "stateTax": return <td className="border px-4 py-2">{row.stateTax}</td>;
                case "integratedTax": return <td className="border px-4 py-2">{row.integratedTax}</td>;
                case "cess": return <td className="border px-4 py-2">{row.cess}</td>;
                case "totalTax": return <td className="border px-4 py-2">{row.totalTax}</td>;
                default: return null;
              }
            };

            return (
              <table className="min-w-full text-sm text-gray-800 border-collapse">
                <thead className="bg-[#F9F9F9]">
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
                  {data.map((row, i) => (
                    <tr key={row.id} className="bg-white hover:bg-gray-50">
                      {columns.map((col) => renderCell(row, col.id, i))}
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

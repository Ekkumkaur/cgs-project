"use client";
import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Search, CalendarDays, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Sale() {
  const bills = Array(10).fill({
    agent: "HARISH GUPTA",
    billId: "CGS0021",
    date: "02-OCT-2025",
    customer: "RAHUL SHARMA",
    sgst: "9%",
    cgst: "16%",
    amount: "₹ 450",
    status: "PAID",
  });

  const initialColumns = [
    { id: "agent", header: "AGENT NAME", size: "1.5fr" },
    { id: "billId", header: "BILL ID", size: "1.0fr" },
    { id: "date", header: "DATE", size: "1.3fr" },
    { id: "customer", header: "CUSTOMER NAME", size: "2fr" },
    { id: "sgst", header: "SGST", size: "1fr" },
    { id: "cgst", header: "CGST", size: "1fr" },
    { id: "amount", header: "AMOUNT", size: "1.2fr" },
    { id: "status", header: "PAYMENT STATUS", size: "1.5fr" },
    { id: "action", header: "ACTION", size: "1.5fr" },
  ];

  const [columns, setColumns] = useState(() => {
    if (typeof window !== "undefined") {
      const savedColumns = localStorage.getItem("saleTableColumns");
      return savedColumns ? JSON.parse(savedColumns) : initialColumns;
    }
    return initialColumns;
  });

  useEffect(() => {
    localStorage.setItem("saleTableColumns", JSON.stringify(columns));
  }, [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const gridTemplateColumns = columns.map((c) => c.size).join(" ");

  const SortableHeader = ({
    column,
  }: {
    column: (typeof initialColumns)[0];
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: column.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: isDragging ? "grabbing" : "grab",
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="px-5 py-3 bg-[#eaf3ff] flex items-center justify-center text-sm font-semibold h-12 whitespace-nowrap"
      >
        {column.header}
      </div>
    );
  };

  return (
    <AdminLayout title="Bill Generation > Sale">
      {/* Search Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Search by Bill ID, date, Customer"
            className="w-80 rounded-full pl-4 pr-10 py-2 bg-[#ffe9e1] placeholder:text-gray-500 border-none shadow-sm focus:ring-0"
          />
          <Search
            className="absolute right-3 text-[#f97a63] cursor-pointer"
            size={20}
          />
        </div>
        <Button
          variant="outline"
          className="rounded-full border-gray-300 hover:bg-gray-100"
        >
          <CalendarDays className="mr-2 h-4 w-4 text-gray-600" />
        </Button>
      </div>

      {/* Table */}
      <div className="border border-[#d0e1f7] rounded-md overflow-x-auto">
        {/* Table Header */}
        <div
          className="grid font-semibold text-gray-700 text-sm border-b"
          style={{ gridTemplateColumns }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={columns.map((c) => c.id)}
              strategy={horizontalListSortingStrategy}
            >
              {columns.map((column) => (
                <SortableHeader key={column.id} column={column} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* Table Rows */}
        {bills.map((bill, i) => (
          <div
            key={i}
            className="grid items-center text-sm border-b last:border-none bg-white hover:bg-[#f8fbff] transition"
            style={{ gridTemplateColumns }}
          >
            {columns.map((column) => (
              <div key={column.id} className="px-5 py-3 text-center whitespace-nowrap">
                {column.id === "status" ? (
                  <span
                    className={`${
                      bill.status === "PAID" ? "text-green-600" : "text-red-600"
                    } font-semibold tracking-wide`}
                  >
                    {bill.status}
                  </span>
                ) : column.id === "action" ? (
                  <div className="flex items-center justify-center gap-5">
                    <button className="text-[#2d6bff] hover:underline font-medium text-sm">
                      VIEW
                    </button>
                    <button className="text-[#f97a63] hover:underline font-medium text-sm">
                      RETURN
                    </button>
                    <Download
                      className="cursor-pointer text-gray-700 hover:text-black"
                      size={18}
                    />
                  </div>
                ) : (
                  bill[column.id as keyof typeof bill]
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button className="text-gray-500 hover:text-black text-sm">&lt;</button>
        <button className="w-6 h-6 flex items-center justify-center rounded-full bg-[#f97a63] text-white text-sm">
          1
        </button>
        <button className="text-gray-700 hover:text-black text-sm">2</button>
        <span className="text-gray-500 text-sm">3 ... 56</span>
        <button className="text-gray-500 hover:text-black text-sm">&gt;</button>
      </div>
    </AdminLayout>
  );
}

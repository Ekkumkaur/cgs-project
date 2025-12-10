import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Edit3 } from "lucide-react";
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

export default function PurchaseDetail() {
  const purchaseData = Array.from({ length: 10 }, (_, i) => ({
    uid: i,
    id: "CGS0021",
    supplier: "ROHIT KUMAR",
    date: "04-OCT-2025",
    amount: "₹15,000",
    payment: "UPI",
    status: "PAID",
  }));

  const initialColumns = [
    { id: "id", label: "PURCHASE ID" },
    { id: "supplier", label: "SUPPLIER NAME" },
    { id: "date", label: "DATE" },
    { id: "amount", label: "TOTAL AMOUNT" },
    { id: "payment", label: "PAYMENT" },
    { id: "status", label: "STATUS" },
    { id: "actions", label: "ACTIONS" },
  ];

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("purchaseDetailColumnOrder");
    return savedOrder ? JSON.parse(savedOrder) : initialColumns;
  });

  useEffect(() => {
    localStorage.setItem("purchaseDetailColumnOrder", JSON.stringify(columns));
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
        className="py-3 px-4 font-semibold cursor-grab"
      >
        {column.label}
      </th>
    );
  };

  return (
    <AdminLayout title="Purchase > Purchase Detail">
      <div className="p-6">
        {/* Header & Search Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 w-[350px]">
            <Input
              type="text"
              placeholder="Search by Bill ID, date, Customer"
              className="rounded-full bg-[#fff7f6] border border-[#f3cdc8] text-gray-700 placeholder-gray-400 focus:ring-0 focus:border-[#e48a7c]"
            />
            <Button
              variant="ghost"
              size="icon"
              className="bg-[#e48a7c] text-white hover:bg-[#d77b6f] rounded-full"
            >
              <Search size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-[#e48a7c] text-[#e48a7c] hover:bg-[#fff4f2]"
            >
              <Calendar size={18} />
            </Button>
          </div>
        </div>

        {/* Table */}
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

          const renderCell = (item: any, columnId: string) => {
            switch (columnId) {
              case "id": return <td className="py-3 px-4">{item.id}</td>;
              case "supplier": return <td className="py-3 px-4">{item.supplier}</td>;
              case "date": return <td className="py-3 px-4">{item.date}</td>;
              case "amount": return <td className="py-3 px-4">{item.amount}</td>;
              case "payment": return <td className="py-3 px-4">{item.payment}</td>;
              case "status": return <td className="py-3 px-4 text-[#0b7c24] font-semibold">{item.status}</td>;
              case "actions": return (
                <td className="py-3 px-4 flex items-center justify-center gap-2">
                  <button className="text-[#0b64c0] text-sm font-medium hover:underline">[VIEW]</button>
                  <button className="text-[#e48a7c] text-sm font-medium hover:underline">[RETURN]</button>
                  <Edit3 size={16} className="text-gray-600 cursor-pointer hover:text-[#e48a7c]" />
                </td>
              );
              default: return null;
            }
          };

          return (
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-[#fff7f6] border-b border-gray-200 text-gray-700">
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                      <tr className="text-left">
                        {columns.map((column) => (
                          <SortableHeader key={column.id} column={column} />
                        ))}
                      </tr>
                    </SortableContext>
                  </DndContext>
                </thead>
                <tbody>
                  {purchaseData.map((item) => (
                    <tr
                      key={item.uid}
                      className="border-b hover:bg-[#fff7f6] transition-colors"
                    >
                      {columns.map((col) => renderCell(item, col.id))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 gap-2 text-sm">
          <button className="px-3 py-1 text-gray-500 hover:text-[#e48a7c]">
            &lt;
          </button>
          <button className="px-3 py-1 bg-[#e48a7c] text-white rounded-full">
            1
          </button>
          <button className="px-3 py-1 text-gray-700 hover:text-[#e48a7c]">
            2
          </button>
          <button className="px-3 py-1 text-gray-700">3</button>
          <span className="text-gray-500">...</span>
          <button className="px-3 py-1 text-gray-700">56</button>
          <button className="px-3 py-1 text-gray-500 hover:text-[#e48a7c]">
            &gt;
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

export default function ReturnPurchase() {
  const [search, setSearch] = useState("");

  const data = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    returnId: "RET-301",
    purchaseId: "PUR-101",
    supplier: "ABC TRADERS",
    product: "NAIL PAINTS",
    qty: 60,
    reason: "DAMAGED",
    amount: "₹1200",
    status: "PENDING",
  }));

  const initialColumns = [
    { id: "returnId", label: "RETURN ID" },
    { id: "purchaseId", label: "PURCHASE ID" },
    { id: "supplier", label: "SUPPLIER" },
    { id: "product", label: "PRODUCT" },
    { id: "qty", label: "QTY" },
    { id: "reason", label: "REASON" },
    { id: "amount", label: "AMOUNT" },
    { id: "status", label: "STATUS" },
    { id: "actions", label: "ACTIONS" },
  ];

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("returnPurchaseColumnOrder");
    return savedOrder ? JSON.parse(savedOrder) : initialColumns;
  });

  useEffect(() => {
    localStorage.setItem("returnPurchaseColumnOrder", JSON.stringify(columns));
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
        className="px-4 py-3 text-left font-semibold cursor-grab"
      >
        {column.label}
      </th>
    );
  };

  return (
    <AdminLayout title="Purchase > Return Purchase">
      <div className="p-6">
        {/* Search Section */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search by Return ID, Supplier"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full border-gray-300 focus:ring-0"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <Button
            variant="outline"
            className="rounded-full flex items-center gap-2"
          >
            <Calendar size={18} />
          </Button>
        </div>

        {/* Table Section */}
        <Card className="shadow-sm rounded-2xl border border-gray-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
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
                    case "returnId": return <td className="px-4 py-3">{item.returnId}</td>;
                    case "purchaseId": return <td className="px-4 py-3">{item.purchaseId}</td>;
                    case "supplier": return <td className="px-4 py-3">{item.supplier}</td>;
                    case "product": return <td className="px-4 py-3">{item.product}</td>;
                    case "qty": return <td className="px-4 py-3">{item.qty}</td>;
                    case "reason": return <td className="px-4 py-3">{item.reason}</td>;
                    case "amount": return <td className="px-4 py-3">{item.amount}</td>;
                    case "status": return <td className="px-4 py-3 text-orange-500 font-medium">{item.status}</td>;
                    case "actions": return (
                      <td className="px-4 py-3 space-x-2 text-blue-600 font-medium">
                        <button className="hover:underline">[VIEW]</button>
                        <button className="hover:underline">[RETURN]</button>
                        <Pencil size={16} className="inline text-gray-500 ml-1 cursor-pointer hover:text-gray-700" />
                      </td>
                    );
                    default: return null;
                  }
                };

                return (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
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
                      {data.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-gray-100 hover:bg-gray-50 transition"
                        >
                          {columns.map((col) => renderCell(item, col.id))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6 text-sm text-gray-600">
          <button className="px-2 py-1 rounded hover:bg-gray-100">&lt;</button>
          <button className="px-2 py-1 rounded bg-gray-200 text-gray-800">1</button>
          <span className="font-medium text-blue-600">2</span>
          <span>3</span>
          <span>…</span>
          <span>56</span>
          <button className="px-2 py-1 rounded hover:bg-gray-100">&gt;</button>
        </div>
      </div>
    </AdminLayout>
  );
}

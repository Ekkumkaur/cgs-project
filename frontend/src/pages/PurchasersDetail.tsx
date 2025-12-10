import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Edit2, Trash2 } from "lucide-react";
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

export default function PurchasersDetail() {
  const data = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    supplierId: "CGS0021",
    supplierName: "ROHIT KUMAR",
    company: "ABC",
    contact: "9876543210",
    purchases: 12,
    returns: 2,
  }));

  const initialColumns = [
    { id: "supplierId", label: "SUPPLIER ID" },
    { id: "supplierName", label: "SUPPLIER NAME" },
    { id: "company", label: "COMPANY" },
    { id: "contact", label: "CONTACT" },
    { id: "purchases", label: "PURCHASES" },
    { id: "returns", label: "RETURNS" },
    { id: "actions", label: "ACTIONS" },
  ];

  const [showModal, setShowModal] = useState(false);

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("purchasersDetailColumnOrder");
    return savedOrder ? JSON.parse(savedOrder) : initialColumns;
  });

  useEffect(() => {
    localStorage.setItem("purchasersDetailColumnOrder", JSON.stringify(columns));
  }, [columns]);

  const SortableHeader = ({ column }) => {
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
    <AdminLayout title="Purchasers Detail">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        {/* Search + Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search by Bill ID, date, Customer"
              className="w-72 h-10 rounded-full border border-gray-300"
            />
            <Button className="rounded-full px-3 py-2 bg-[#ff8573] hover:bg-[#e47a69]">
              <Search size={18} className="text-white" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-3 py-2 border-gray-300 hover:bg-gray-100"
            >
              <Calendar size={18} className="text-gray-600" />
            </Button>
          </div>

          <Button
            className="rounded-full bg-[#ff8573] text-white hover:bg-[#e47a69] px-6"
            onClick={() => setShowModal(true)}
          >
            Add Suppliers
          </Button>
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

          const renderCell = (row, columnId) => {
            switch (columnId) {
              case "supplierId":
                return <td className="py-3 px-4">{row.supplierId}</td>;
              case "supplierName":
                return <td className="py-3 px-4">{row.supplierName}</td>;
              case "company":
                return <td className="py-3 px-4">{row.company}</td>;
              case "contact":
                return <td className="py-3 px-4">{row.contact}</td>;
              case "purchases":
                return <td className="py-3 px-4">{row.purchases}</td>;
              case "returns":
                return <td className="py-3 px-4">{row.returns}</td>;
              case "actions":
                return (
                  <td className="py-3 px-4 flex items-center justify-center gap-3">
                    <button className="text-[#007bff] font-medium hover:underline">[VIEW]</button>
                    <Edit2 size={16} className="text-gray-600 cursor-pointer hover:text-[#ff8573]" />
                    <Trash2 size={16} className="text-gray-600 cursor-pointer hover:text-red-500" />
                  </td>
                );
              default:
                return null;
            }
          };

          return (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm text-center">
                <thead className="bg-[#fafafa] border-b">
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                      <tr className="text-gray-700 font-semibold">
                        {columns.map((column) => (
                          <SortableHeader key={column.id} column={column} />
                        ))}
                      </tr>
                    </SortableContext>
                  </DndContext>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-[#fff6f5] transition-colors">
                      {columns.map((col) => renderCell(row, col.id))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <button className="px-2 py-1 text-sm text-gray-500 hover:text-gray-800">
            &lt;
          </button>
          <button className="px-3 py-1 rounded-full bg-[#ff8573] text-white text-sm">
            1
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-[#ff8573]">
            2
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-[#ff8573]">
            3
          </button>
          <span className="text-sm text-gray-400">...</span>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-[#ff8573]">
            56
          </button>
          <button className="px-2 py-1 text-sm text-gray-500 hover:text-gray-800">
            &gt;
          </button>
        </div>
      </div>

      {/* ================================
    RIGHT SIDE MODAL – EXACT SCREENSHOT DESIGN
================================== */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-end z-50">

    <div className="w-[400px] h-full bg-white border-l-[3px] border-[#e5e5e5] shadow-xl flex items-center justify-center">

      <div className="w-[90%]">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Add Suppliers</h2>
          <button onClick={() => setShowModal(false)}>
            <span className="text-xl font-bold">&times;</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <Input placeholder="Name" className="h-10" />
          <Input placeholder="Mobile Number" className="h-10" />
          <Input placeholder="Email" className="h-10" />
          <Input placeholder="Company Name" className="h-10" />
          <Input placeholder="City" className="h-10" />
          <Input placeholder="State" className="h-10" />
          <Input placeholder="Complete Address" className="h-10" />
          <Input placeholder="GST Holder" className="h-10" />
        </div>

        {/* Add Button */}
        <Button className="w-full mt-5 bg-black text-white hover:bg-gray-900 rounded-md">
          Add
        </Button>
      </div>

    </div>
  </div>
)}

    </AdminLayout>
  );
}

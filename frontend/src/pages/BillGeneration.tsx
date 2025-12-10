"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function BillGeneration() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const cards = [
    {
      title: "New Bill",
      img: "src/images/new-bill.png",
      path: "/bills/new",
    },
    {
      title: "Sale",
      img: "src/images/sale.png",
      path: "/bills/sale",
    },
    {
      title: "Sale Return",
      img: "src/images/sale-return.png",
      path: "/bills/sale-return",
    },
  ];

  const billItems = [
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
  ];

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("billGenerationColumnOrder");
    if (savedOrder) {
      try {
        return JSON.parse(savedOrder);
      } catch (e) {
        return initialColumns;
      }
    }
    return initialColumns;
  });

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
        className="px-5 py-3 cursor-grab"
      >
        {column.label}
      </th>
    );
  };

  useEffect(() => {
    localStorage.setItem("billGenerationColumnOrder", JSON.stringify(columns));
  }, [columns]);

  return (
    <AdminLayout title="Bill Generation">
      <div className="flex flex-wrap justify-center gap-10 mt-10">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="w-[180px] h-[140px] flex flex-col items-center justify-center shadow-md rounded-2xl cursor-pointer transition-transform hover:scale-105 bg-[#e48a7c]"
            onClick={() => {
              if (card.title === "New Bill") setShowModal(true);
              else navigate(card.path);
            }}
          >
            <CardContent className="flex flex-col items-center justify-center text-white p-4">
              <img
                src={card.img}
                alt={card.title}
                className="w-12 h-12 mb-3 object-contain"
              />
              <p className="mt-1 font-medium">{card.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] shadow-2xl p-10 relative flex flex-col items-center justify-center gap-6">
            {/* Header */}
            <div className="flex justify-between w-full px-2 items-center">
              <p className="text-[20px] font-medium text-[#0a3441]">
                Customer Name:{" "}
                <span className="font-semibold">Rahul Sharma</span>
              </p>
              <p className="text-[20px] font-medium text-[#0a3441]">
                Customer Code:{" "}
                <span className="font-semibold">CGS0021</span>
              </p>
            </div>

            {/* Title */}
            <h2 className="text-center text-[18px] font-semibold text-[#0a3441]">
              Enter your Product details
            </h2>

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
                  case "sno": return <td className="px-5 py-3">{item.sno}</td>;
                  case "adItemCode": return <td className="px-5 py-3">{item.adItemCode}</td>;
                  case "itemCode": return <td className="px-5 py-3">{item.itemCode}</td>;
                  case "itemName": return <td className="px-5 py-3">{item.itemName}</td>;
                  case "companyName": return <td className="px-5 py-3">{item.companyName}</td>;
                  case "hsnCode": return <td className="px-5 py-3">{item.hsnCode}</td>;
                  case "packing": return <td className="px-5 py-3">{item.packing}</td>;
                  case "lot": return <td className="px-5 py-3">{item.lot}</td>;
                  case "mrp": return <td className="px-5 py-3">{item.mrp}</td>;
                  case "qty": return <td className="px-5 py-3">{item.qty}</td>;
                  case "cd": return <td className="px-5 py-3">{item.cd}</td>;
                  case "netAmount": return <td className="px-5 py-3">{item.netAmount}</td>;
                  case "tax": return <td className="px-5 py-3">{item.tax}</td>;
                  default: return null;
                }
              };

              return (
                <div className="w-full overflow-x-auto rounded-lg shadow-md">
                  <table className="w-full text-left text-[15px]">
                    <thead className="font-medium text-[#0a3441] bg-gray-100">
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
                    <tbody className="text-gray-600 bg-white">
                      {billItems.map((item) => (
                        <tr key={item.id}>
                          {columns.map((col) => renderCell(item, col.id))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}

            {/* Continue Button */}
            <div className="flex justify-center w-full pt-2">
              <Button
                onClick={() => setShowModal(false)}
                className="bg-[#e98c81] hover:bg-[#e98c81]/90 text-white text-[16px] font-semibold px-10 py-2.5 rounded-full shadow-lg"
              >
                Continue
              </Button>
            </div>

            {/* Close (X) */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-6 text-gray-400 hover:text-gray-600 text-3xl font-light"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

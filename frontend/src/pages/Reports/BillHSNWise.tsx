import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { useState, useEffect } from "react";
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

export default function BillHSNWise() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHSN, setSelectedHSN] = useState("All HSN Code");

  const billData = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    sno: i + 1,
    billDate: "01-NOV-25",
    billNumber: "CST-9962",
    itemName: "Face Cream",
    hsnCode: "3304",
    gstRate: "18%",
    sgst: "₹ 114",
    cgst: "₹ 114",
    qty: 4,
    totalAmt: "₹ 1497",
    taxableAmt: "₹ 11268.64",
  }));

  const initialColumns = [
    { id: "sno", label: "SNO." },
    { id: "billDate", label: "BILL DATE" },
    { id: "billNumber", label: "BILL NUMBER" },
    { id: "itemName", label: "ITEM NAME" },
    { id: "hsnCode", label: "HSN CODE" },
    { id: "gstRate", label: "GST RATE" },
    { id: "sgst", label: "SGST" },
    { id: "cgst", label: "CGST" },
    { id: "qty", label: "QTY" },
    { id: "totalAmt", label: "TOTAL AMT" },
    { id: "taxableAmt", label: "TAXABLE AMT" },
  ];

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("billHSNWiseColumnOrder");
    return savedOrder ? JSON.parse(savedOrder) : initialColumns;
  });

  useEffect(() => {
    localStorage.setItem("billHSNWiseColumnOrder", JSON.stringify(columns));
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
        className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-grab"
      >
        {column.label}
      </th>
    );
  };

  return (
    <AdminLayout title="Reports > Bill HSN Wise">
      <div className="bg-white-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-white p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Section */}
            <div className="flex w-full md:w-1/2 items-center gap-2">
              <input
                type="text"
                placeholder="Search by HSN Code, Bill ID, Number, party..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-full px-4 py-2 border border-gray-300 flex-grow bg-[#FEEEE5] focus:outline-none"
              />
              <Button className="rounded-full bg-[#E98C81] hover:bg-[#e67a6d] text-white">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {/* HSN Code Dropdown */}
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg bg-[#EBEBEB] text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={selectedHSN}
              onChange={(e) => setSelectedHSN(e.target.value)}
            >
              <option>All HSN Code</option>
              <option>3304</option>
            </select>

            {/* Export Button */}
            <Button className="w-[239px] h-[50px] bg-[#E98C81] hover:bg-[#d87a6f] text-white rounded-full flex items-center justify-center gap-2 shadow-md">
              Export <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-6">
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
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
                  case "sno": return <td className="px-4 py-4 text-sm text-gray-700">{row.sno}.</td>;
                  case "billDate": return <td className="px-4 py-4 text-sm text-gray-700">{row.billDate}</td>;
                  case "billNumber": return <td className="px-4 py-4 text-sm text-gray-700">{row.billNumber}</td>;
                  case "itemName": return <td className="px-4 py-4 text-sm text-gray-700">{row.itemName}</td>;
                  case "hsnCode": return <td className="px-4 py-4 text-sm text-gray-700">{row.hsnCode}</td>;
                  case "gstRate": return <td className="px-4 py-4 text-sm text-gray-700">{row.gstRate}</td>;
                  case "sgst": return <td className="px-4 py-4 text-sm text-gray-700">{row.sgst}</td>;
                  case "cgst": return <td className="px-4 py-4 text-sm text-gray-700">{row.cgst}</td>;
                  case "qty": return <td className="px-4 py-4 text-sm text-gray-700">{row.qty}</td>;
                  case "totalAmt": return <td className="px-4 py-4 text-sm text-gray-700">{row.totalAmt}</td>;
                  case "taxableAmt": return <td className="px-4 py-4 text-sm text-gray-700">{row.taxableAmt}</td>;
                  default: return null;
                }
              };

              return (
                <table className="w-full">
                  <thead className="bg-white border-b-2 border-gray-200">
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
                  <tbody className="bg-white divide-y divide-gray-100">
                    {billData.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {columns.map((col) => renderCell(row, col.id))}
                      </tr>
                    ))}

                    {/* Total Row */}
                    <tr className="bg-gray-100 font-semibold border-t-2 border-gray-200">
                      <td
                        className="px-4 py-4 text-sm text-gray-900"
                        colSpan={6}
                      >
                        TOTAL
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">₹15598</td>
                      <td className="px-4 py-4 text-sm text-gray-900">₹15598</td>
                      <td className="px-4 py-4 text-sm text-gray-900">43</td>
                      <td className="px-4 py-4 text-sm text-gray-900">₹12513</td>
                      <td className="px-4 py-4 text-sm text-gray-900">₹1167</td>
                    </tr>
                  </tbody>
                </table>
              );
            })()}
          </div>

          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Total Items", value: "12", color: "blue" },
              { label: "Total Qty", value: "43", color: "purple" },
              { label: "Total Amount", value: "₹ 15598", color: "green" },
              { label: "Total CGST", value: "₹ 1167", color: "orange" },
              { label: "Total SGST", value: "₹ 1167", color: "pink" },
            ].map((card) => (
              <div
                key={card.label}
                className={`bg-${card.color}-50 border border-${card.color}-200 rounded-xl p-5 text-center`}
              >
                <div className="text-sm text-gray-600 mb-2 font-medium">
                  {card.label}
                </div>
                <div className="text-3xl font-bold text-gray-800">
                  {card.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Pencil, Eye, Undo2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import { getAllPurchaseReturns, updatePurchaseReturn } from "@/adminApi/returnPurchaseApi";

export default function ReturnPurchase() {
  const [search, setSearch] = useState("");
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReturn, setEditingReturn] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formState, setFormState] = useState({
    qty: "",
    reason: "",
    amount: "",
    status: "",
  });

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

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllPurchaseReturns();
      if (response.success) {
        setReturns(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch purchase returns.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("returnPurchaseColumnOrder", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

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

  const handleEditClick = (item) => {
    setEditingReturn(item);
    setFormState({
      qty: item.qty.toString(),
      reason: item.reason,
      amount: item.amount.toString(),
      status: item.status,
    });
    setIsEditModalOpen(true);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async () => {
    if (!formState.qty || !formState.reason || !formState.amount) {
      toast.error("Please fill all fields: Quantity, Reason, and Amount.");
      return;
    }

    if (!window.confirm("Are you sure you want to update this purchase return?")) {
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        ...formState,
        qty: Number(formState.qty),
        amount: Number(formState.amount),
      };

      const response = await updatePurchaseReturn(editingReturn._id, payload);

      if (response.success) {
        toast.success("Purchase return updated successfully!");
        fetchReturns();
        setIsEditModalOpen(false);
        setEditingReturn(null);
      } else {
        toast.error(response.message || "Failed to update purchase return.");
      }
    } catch (error) {
      toast.error("An error occurred while updating.");
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredReturns = returns.filter(
    (item) => {
      const lowercasedSearch = search.toLowerCase();
      if (!lowercasedSearch) return true; // If search is empty, show all

      const returnIdMatch = item.returnId && item.returnId.toLowerCase().includes(lowercasedSearch);
      const supplierNameMatch = item.supplier && item.supplier.name && item.supplier.name.toLowerCase().includes(lowercasedSearch);
      return returnIdMatch || supplierNameMatch;
    }
  );

  return (
    <AdminLayout title="Purchase > Return Purchase">
      <div className="p-6">
        {/* Search Section */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1 max-w-sm">
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
                    case "purchaseId": return <td className="px-4 py-3">{item.purchase?.purchaseId || item.purchaseId || 'N/A'}</td>;
                    case "supplier": return <td className="px-4 py-3">{item.supplier?.name || 'N/A'}</td>;
                    case "product": return <td className="px-4 py-3">{item.product?.name || item.product?.productName || 'N/A'}</td>;
                    case "qty": return <td className="px-4 py-3">{item.qty}</td>;
                    case "reason": return <td className="px-4 py-3">{item.reason}</td>;
                    case "amount": return <td className="px-4 py-3">₹{item.amount?.toLocaleString('en-IN') || 0}</td>;
                    case "status": return <td className="px-4 py-3 text-orange-500 font-medium">{item.status}</td>;
                    case "actions":
                      return (
                        <td className="py-3 px-4 flex items-center justify-center gap-2">
                          <button className="w-8 h-8 flex items-center justify-center border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition-colors" title="View Details">
                            <Eye size={16} />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center border border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition-colors" title="Process Return">
                            <Undo2 size={16} />
                          </button>
                          <button onClick={() => handleEditClick(item)} className="w-8 h-8 flex items-center justify-center border border-gray-400 text-gray-600 rounded-full hover:bg-gray-100 transition-colors" title="Edit Return">
                            <Pencil size={16} />
                          </button>
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
                      {loading ? (
                        <tr>
                          <td colSpan={columns.length} className="text-center py-10">Loading...</td>
                        </tr>
                      ) : filteredReturns.length > 0 ? (
                        filteredReturns.map((item) => (
                          <tr
                            key={item._id}
                            className="border-t border-gray-100 hover:bg-gray-50 transition"
                          >
                            {columns.map((col) => <React.Fragment key={col.id}>{renderCell(item, col.id)}</React.Fragment>)}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={columns.length} className="text-center py-10">No purchase returns found.</td>
                        </tr>
                      )}
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

      {/* Edit Return Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Edit Purchase Return</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input name="qty" type="number" value={formState.qty} onChange={handleFormInputChange} />
              </div>
              <div>
                <label className="text-sm font-medium">Reason</label>
                <Input name="reason" value={formState.reason} onChange={handleFormInputChange} />
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input name="amount" type="number" value={formState.amount} onChange={handleFormInputChange} />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={formState.status} onValueChange={(value) => handleFormSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleUpdateSubmit}
                disabled={formLoading}
                className="w-full bg-[#e48a7c] hover:bg-[#d77b6f] text-white"
              >
                {formLoading ? "Updating..." : "Update Return"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

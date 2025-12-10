// Ledger.jsx
import { AdminLayout } from "@/components/AdminLayout";
import React, { useState, useEffect } from "react";
import { Search, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
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
import { getCustomerLedger, getSupplierLedger } from "@/adminApi/ledgerApi";

function Ledger() {
  const [activeTab, setActiveTab] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [customerData, setCustomerData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    customer: {
      totalDebit: 0,
      totalCredit: 0,
      customersWithBalance: 0,
    },
    supplier: {
      totalDebit: 0,
      totalCredit: 0,
      netBalance: 0,
    },
  });

  const initialCustomerColumns = [
    { id: "date", label: "DATE" },
    { id: "customer", label: "CUSTOMER" },
    { id: "mobilenumber", label: "MOBILE NUMBER" },
    { id: "customerId", label: "CUSTOMER ID" },
    { id: "type", label: "TYPE" },
    { id: "referenceNo", label: "REFERENCE NO." },
    { id: "paymentMethod", label: "PAYMENT METHOD" },
    { id: "debit", label: "DEBIT(₹)" },
    { id: "credit", label: "CREDIT(₹)" },
    { id: "balance", label: "BALANCE" },
    { id: "dueDate", label: "DUE DATE" },
  ];

  const initialSupplierColumns = [
    { id: "date", label: "DATE" },
    { id: "party", label: "SUPPLIER NAME" },
    { id: "type", label: "TYPE" },
    { id: "referenceNo", label: "REFERENCE NO." },
    { id: "paymentMethod", label: "PAYMENT METHOD" },
    { id: "debit", label: "DEBIT(₹)" },
    { id: "credit", label: "CREDIT(₹)" },
    { id: "balance", label: "BALANCE" },
  ];

  const [customerColumns, setCustomerColumns] = useState(() => {
    const savedOrder = localStorage.getItem("customerLedgerColumnOrder");
    return savedOrder ? JSON.parse(savedOrder) : initialCustomerColumns;
  });

  const [supplierColumns, setSupplierColumns] = useState(() => {
    const savedOrder = localStorage.getItem("supplierLedgerColumnOrder");
    return savedOrder ? JSON.parse(savedOrder) : initialSupplierColumns;
  });

  // Fetch data when tab changes
  useEffect(() => {
    fetchLedgerData();
  }, [activeTab]);

  useEffect(() => {
    // Don't fetch on initial render if data is already being fetched by the activeTab effect
    fetchLedgerData();
  }, [typeFilter]);

  useEffect(() => {
    localStorage.setItem("customerLedgerColumnOrder", JSON.stringify(customerColumns));
  }, [customerColumns]);

  useEffect(() => {
    localStorage.setItem("supplierLedgerColumnOrder", JSON.stringify(supplierColumns));
  }, [supplierColumns]);

  const fetchLedgerData = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 1000,
      };

      // Add search query if exists
      if (searchQuery.trim()) {
        // @ts-ignore
        params.search = searchQuery.trim();
      }

      // Add type filter if not "all"
      if (typeFilter !== "all") {
        // @ts-ignore
        params.type = typeFilter;
      }

      if (activeTab === "customer") {
        const response = await getCustomerLedger(params);
        if (response.data.success) {
          setCustomerData(response.data.ledger);
          setSummaryData(prev => ({
            ...prev,
            customer: {
              totalDebit: response.data.totalDebit || 0,
              totalCredit: response.data.totalCredit || 0,
              customersWithBalance: response.data.customersWithBalance || 0,
            },
          }));
        }
      } else {
        const response = await getSupplierLedger(params);
        if (response.data.success) {
          setSupplierData(response.data.ledger);
          setSummaryData(prev => ({
            ...prev,
            supplier: {
              totalDebit: response.data.totalDebit || 0,
              totalCredit: response.data.totalCredit || 0,
              netBalance: response.data.netBalance || 0,
            },
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching ledger data:", error);
      // Show error message to user
      alert("Failed to fetch ledger data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchLedgerData();
  };

  const handleExport = () => {
    const data = activeTab === "customer" ? customerData : supplierData;
    const headers = activeTab === "customer" ? customerColumns : supplierColumns;
    
    // Create CSV content
    let csv = headers.map(col => col.label).join(',') + '\n';
    
    data.forEach(item => {
      const row = headers.map(col => {
        switch (col.id) {
          case "date":
            return formatDate(item.date);
          case "customer":
          case "party":
            return item.partyName;
          case "mobilenumber":
            return item.mobileNumber;
          case "customerId":
            return item.partyId;
          case "type":
            return item.type;
          case "referenceNo":
            return item.referenceNo;
          case "paymentMethod":
            return item.paymentMethod;
          case "debit":
            return item.debit;
          case "credit":
            return item.credit;
          case "balance":
            return item.balance;
          case "dueDate":
            return item.dueDate ? formatDate(item.dueDate) : "";
          default:
            return "";
        }
      }).join(',');
      csv += row + '\n';
    });

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-ledger-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  // Format currency helper
  const formatCurrency = (amount: number) => {
    if (!amount || amount === 0) return "-";
    const formatted = Math.abs(amount).toLocaleString('en-IN');
    return amount < 0 ? `-₹${formatted}` : `₹${formatted}`;
  };

  const SortableHeader = ({ column }: { column: { id: string; label: string } }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: column.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <th ref={setNodeRef} style={style} {...attributes} {...listeners} className="px-3 py-3 cursor-grab">
        {column.label}
      </th>
    );
  };

  const summary =
    activeTab === "customer"
      ? [
          { label: "Total Receivables", value: formatCurrency(summaryData.customer.totalDebit) },
          { label: "Total Sales", value: formatCurrency(summaryData.customer.totalDebit) },
          { label: "Total Payments Received", value: formatCurrency(summaryData.customer.totalCredit) },
          { label: "Customers with Balance", value: summaryData.customer.customersWithBalance },
        ]
      : [
          { label: "Total Debit", value: formatCurrency(summaryData.supplier.totalDebit) },
          { label: "Total Credit", value: formatCurrency(summaryData.supplier.totalCredit) },
          { label: "Net Balance", value: formatCurrency(summaryData.supplier.netBalance) },
        ];

  const tableData = activeTab === "customer" ? customerData : supplierData;

  return (
    <AdminLayout title="Ledger">
      <div className="p-4 md:p-6 space-y-6 bg-white min-h-screen rounded-2xl">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          <Button
            className={`rounded-full px-5 py-2 text-sm font-medium shadow-sm transition ${
              activeTab === "customer"
                ? "bg-[#E98C81] text-white"
                : "bg-white text-gray-600 border border-gray-300"
            }`}
            onClick={() => setActiveTab("customer")}
          >
            Customer Ledger
          </Button>
          <Button
            className={`rounded-full px-5 py-2 text-sm font-medium shadow-sm transition ${
              activeTab === "supplier"
                ? "bg-[#E98C81] text-white"
                : "bg-white text-gray-600 border border-gray-300"
            }`}
            onClick={() => setActiveTab("supplier")}
          >
            Supplier Ledger
          </Button>
        </div>

        {/* Search + Filter + Export */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex w-full md:w-1/2 items-center gap-2">
            <Input
              placeholder={
                activeTab === "customer"
                  ? "Search by Customer Name, ID, Mobile"
                  : "Search by Supplier Name, ID, Mobile"
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="rounded-full px-4 py-2 border border-gray-300 flex-grow bg-[#FEEEE5]"
            />
            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="rounded-full bg-[#E98C81] hover:bg-[#e67a6d] text-white"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pr-40">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px] rounded-full bg-[#FEEEE5] border border-gray-300">
                <SelectValue placeholder="All Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Type</SelectItem>
                <SelectItem value="Sale">Sale</SelectItem>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Payment">Payment</SelectItem>
                <SelectItem value="Receipt">Receipt</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleExport}
              disabled={loading || tableData.length === 0}
              variant="outline"
              className="rounded-full border border-gray-300 flex items-center gap-2 bg-[#E98C81] text-white hover:bg-[#e67a6d]"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div
          className={`grid ${
            activeTab === "customer"
              ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3"
          } gap-4 sm:gap-6 text-center`}
        >
          {summary.map((card, i) => (
            <div
              key={i}
              className="bg-[#E98C81] rounded-2xl py-5 sm:py-6 shadow text-white"
            >
              <p className="text-lg sm:text-2xl font-semibold">{card.value}</p>
              <p className="text-xs sm:text-sm opacity-90">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#E98C81]" />
            </div>
          ) : tableData.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-20 text-gray-500">
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <table className="min-w-full border-collapse text-sm text-gray-700 text-center whitespace-nowrap">
              {(() => {
                const handleDragEnd = (event: DragEndEvent) => {
                  const { active, over } = event;
                  if (!over || active.id === over.id) return;

                  const moveColumns = activeTab === 'customer' ? setCustomerColumns : setSupplierColumns;
                  moveColumns((columns) => {
                    const oldIndex = columns.findIndex((col) => col.id === active.id);
                    const newIndex = columns.findIndex((col) => col.id === over.id);
                    return arrayMove(columns, oldIndex, newIndex);
                  });
                };

                const columns = activeTab === 'customer' ? customerColumns : supplierColumns;
                const columnIds = columns.map((c) => c.id);

                const renderCell = (item: any, columnId: string) => {
                  switch (columnId) {
                    case "date": 
                      return <td className="px-3 py-3">{formatDate(item.date)}</td>;
                    case "customer": 
                      return <td className="px-3 py-3 text-left">{item.partyName || "-"}</td>;
                    case "mobilenumber": 
                      return <td className="px-3 py-3">{item.mobileNumber || "-"}</td>;
                    case "customerId": 
                      return <td className="px-3 py-3">{item.partyId || "-"}</td>;
                    case "type": 
                      return (
                        <td className="px-3 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            (item.type === "Sale" || item.type === "Purchase") 
                              ? "bg-[#E0EDFF] text-[#0055CC]" 
                              : "bg-[#E4F7F3] text-[#0D9A83]"
                          }`}>
                            {item.type}
                          </span>
                        </td>
                      );
                    case "referenceNo": 
                      return <td className="px-3 py-3">{item.referenceNo || "-"}</td>;
                    case "paymentMethod": 
                      return <td className="px-3 py-3">{item.paymentMethod || "-"}</td>;
                    case "debit": 
                      return <td className="px-3 py-3 text-red-600 font-medium">{formatCurrency(item.debit)}</td>;
                    case "credit": 
                      return <td className="px-3 py-3 text-green-600 font-medium">{formatCurrency(item.credit)}</td>;
                    case "balance": 
                      return (
                        <td className={`px-3 py-3 font-medium ${
                          item.balance < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatCurrency(item.balance)}
                        </td>
                      );
                    case "dueDate": 
                      return <td className="px-3 py-3">{formatDate(item.dueDate)}</td>;
                    case "party": 
                      return <td className="px-3 py-3 text-left">{item.partyName || "-"}</td>;
                    default: 
                      return null;
                  }
                };

                return (
                  <>
                    <thead className="bg-[#F6F6F6] text-gray-600">
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
                      {tableData.map((item) => (
                        <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                          {columns.map((col) => (
                            <React.Fragment key={col.id}>
                              {renderCell(item, col.id)}
                            </React.Fragment>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </>
                );
              })()}
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Ledger;
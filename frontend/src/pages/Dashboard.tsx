import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const stats = [
  { label: "Total Sale", value: "Rs. 352", color: "bg-[#FFDCDC]" },
  { label: "Total Order", value: "120", color: "bg-[#EEDCFF]" },
  { label: "Active Customer", value: "560", color: "bg-[#C9F5EE]" },
  { label: "Low Stock", value: "68", color: "bg-[#FFE6B2]" },
];

const salesData = [
  { month: "Jan", lipstick: 70, rubberBand: 20, toner: 10, handCream: 15 },
  { month: "Feb", lipstick: 40, rubberBand: 30, toner: 15, handCream: 25 },
  { month: "Mar", lipstick: 60, rubberBand: 80, toner: 25, handCream: 40 },
  { month: "Apr", lipstick: 50, rubberBand: 45, toner: 10, handCream: 70 },
  { month: "May", lipstick: 90, rubberBand: 75, toner: 35, handCream: 60 },
];

// product performance graph — Y-axis limited to 50
const productPerformance = [
  { name: "Lipstick", value: 15, color: "#8B5CF6" },
  { name: "Rubber band", value: 30, color: "#3B82F6" },
  { name: "Toner", value: 10, color: "#F97316" },
  { name: "Hand cream", value: 20, color: "#22C55E" },
];

export default function Dashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* ---- Top Stats ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <Card
              key={index}
              className={`${item.color} border-0 shadow-md rounded-xl`}
            >
              <CardContent className="p-6 text-center">
                <p className="text-sm font-medium text-gray-600">
                  {item.label}
                </p>
                <p className="text-3xl font-bold text-[#A62539] mt-2">
                  {item.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ---- Charts Section ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Line Chart */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#119D82] text-lg font-semibold mb-4">
                +10,566
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="lipstick" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="rubberBand" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="toner" stroke="#F97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="handCream" stroke="#22C55E" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Product Performance Bar Chart */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  {/* 👇 Fix Y-axis to show up to 50 only */}
                  <YAxis domain={[0, 50]} ticks={[0, 25, 50]} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {productPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

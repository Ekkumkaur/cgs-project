"use client";
import { AdminLayout } from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Search } from "lucide-react";
import React from "react";

export default function BillNumber() {
  return (
    <AdminLayout title="Report > Bill Number">
      <div className="flex flex-col items-center justify-center gap-10">
        {/* Date Section */}
        <div className="flex flex-wrap justify-center gap-6">
          {/* From Date */}
          <div className="flex flex-col items-center">
            <label className="text-sm text-gray-700 mb-1">From Date</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="DD-MM-YY"
                className="w-40 h-10 rounded-md bg-[#F4F4F4] pl-8 border border-gray-200 text-gray-600 focus:ring-0"
              />
              <Calendar
                className="absolute left-2.5 top-2.5 text-gray-500"
                size={16}
              />
            </div>
          </div>

          {/* To Date */}
          <div className="flex flex-col items-center">
            <label className="text-sm text-gray-700 mb-1">To Date</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="DD-MM-YY"
                className="w-40 h-10 rounded-md bg-[#F4F4F4] pl-8 border border-gray-200 text-gray-600 focus:ring-0"
              />
              <Calendar
                className="absolute left-2.5 top-2.5 text-gray-500"
                size={16}
              />
            </div>
          </div>
        </div>

        
      </div>
      {/* Bill Number Input */}
        <div className="flex items-start justify-start mt-9 gap-2">
          <Input
            type="text"
            placeholder="Enter Bill number"
            className="w-[380px] h-11 rounded-full bg-[#FFE3DC] placeholder:text-[#b56e63] px-5 border-none focus:ring-0 focus:outline-none"
          />
          <Button
            className="rounded-full bg-[#E98C81] hover:bg-[#e57b70] text-white w-11 h-11 flex items-center justify-center"
          >
            <Search size={18} />
          </Button>
        </div>
    </AdminLayout>
  );
}

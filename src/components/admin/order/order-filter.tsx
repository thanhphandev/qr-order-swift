import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filters } from "@/types/order";
import { Calendar } from "lucide-react";

interface OrderFilterProps {
  onFilterChange: (filters: Filters) => void;
}

const OrderFilter = ({ onFilterChange }: OrderFilterProps) => {
  const [filters, setFilters] = useState<Filters>({
    status: null,
    typeOrder: null,
    fromDate: '',
    toDate: ''
  });

  const handleInputChange = (field: keyof Filters, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: Filters = {
      status: null,
      typeOrder: null,
      fromDate: '',
      toDate: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="w-full p-4 bg-orange-50/50 border border-orange-200">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-orange-900">Trạng thái</label>
          <Select
            value={filters.status || ""}
            onValueChange={(value) => handleInputChange('status', value)}
          >
            <SelectTrigger className="w-full bg-white border-orange-200">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="paid">Đã thanh toán</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-orange-900">Loại đơn hàng</label>
          <Select
            value={filters.typeOrder || ""}
            onValueChange={(value) => handleInputChange('typeOrder', value)}
          >
            <SelectTrigger className="w-full bg-white border-orange-200">
              <SelectValue placeholder="Chọn loại đơn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dine-in">Tại chỗ</SelectItem>
              <SelectItem value="take-away">Mang đi</SelectItem>
              <SelectItem value="delivery">Giao hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-orange-900">Từ ngày</label>
          <div className="relative">
            <Input
              type="date"
              value={filters.fromDate}
              onChange={(e) => handleInputChange('fromDate', e.target.value)}
              className="w-full bg-white border-orange-200 pr-10"
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-orange-500" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-orange-900">Đến ngày</label>
          <div className="relative">
            <Input
              type="date"
              value={filters.toDate}
              onChange={(e) => handleInputChange('toDate', e.target.value)}
              className="w-full bg-white border-orange-200 pr-10"
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-orange-500" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            Đặt lại
          </Button>
          <Button 
            onClick={() => onFilterChange(filters)}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            Áp dụng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderFilter;

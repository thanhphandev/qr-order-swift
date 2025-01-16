import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filters } from "@/types/order";
import { Calendar, Filter } from "lucide-react";

interface OrderFilterProps {
  onFilterChange: (filters: Filters) => void;
}

const OrderFilter = ({ onFilterChange }: OrderFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const hasActiveFilters = Object.values(filters).some(value => value !== null && value !== '');

  return (
    <div className="w-full">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className={`mb-4 gap-2 ${hasActiveFilters ? 'border-orange-500 text-orange-500' : ''}`}
      >
        <Filter className="h-4 w-4" />
        Bộ lọc
        {hasActiveFilters && (
          <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
            Đang lọc
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="w-full mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <Select
                value={filters.status || ""}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger className="w-full bg-white">
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
              <label className="text-sm font-medium text-gray-700">Loại đơn hàng</label>
              <Select
                value={filters.typeOrder || ""}
                onValueChange={(value) => handleInputChange('typeOrder', value)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Chọn loại đơn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dine-in">Tại chỗ</SelectItem>
                  <SelectItem value="take-away">Mang đi</SelectItem>
                  <SelectItem value="delivery">Giao hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Từ ngày</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => handleInputChange('fromDate', e.target.value)}
                    className="w-full pr-10"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Đến ngày</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => handleInputChange('toDate', e.target.value)}
                    className="w-full pr-10"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
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
                onClick={() => {
                  onFilterChange(filters);
                  setIsOpen(false);
                }}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                Áp dụng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFilter;
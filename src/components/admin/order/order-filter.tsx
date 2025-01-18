import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filters } from "@/types/order";
import { Calendar, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

interface OrderFilterProps {
  onFilterChange: (filters: Filters) => void;
  isLoading?: boolean;
}

const OrderFilter = ({ onFilterChange, isLoading }: OrderFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: null,
    typeOrder: null,
    fromDate: '',
    toDate: ''
  });

  const handleInputChange = useCallback((field: keyof Filters, value: string | null) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleReset = useCallback(() => {
    const resetFilters: Filters = {
      status: null,
      typeOrder: null,
      fromDate: '',
      toDate: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  }, [onFilterChange]);

  const handleApply = useCallback(() => {
    onFilterChange(filters);
    setIsOpen(false);
  }, [filters, onFilterChange]);

  const hasActiveFilters = Object.values(filters).some(value => value !== null && value !== '');

  const activeFiltersCount = Object.values(filters).filter(value => value !== null && value !== '').length;

  return (
    <div className="w-full">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant={hasActiveFilters ? "default" : "outline"}
        className={`mb-4 gap-2 transition-all duration-200 
          ${hasActiveFilters ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'hover:border-orange-500 hover:text-orange-500'}`}
        disabled={isLoading}
      >
        <Filter className="h-4 w-4" />
        Bộ lọc
        {activeFiltersCount > 0 && (
          <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Tùy chọn lọc</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
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

                <div className="space-y-2">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Từ ngày</label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={filters.fromDate}
                      onChange={(e) => handleInputChange('fromDate', e.target.value)}
                      className="w-full pr-10"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Đến ngày</label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={filters.toDate}
                      min={filters.fromDate}
                      onChange={(e) => handleInputChange('toDate', e.target.value)}
                      className="w-full pr-10"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-orange-500 text-orange-500 hover:bg-orange-50"
                disabled={isLoading || !hasActiveFilters}
              >
                Đặt lại
              </Button>
              <Button 
                onClick={handleApply}
                className="bg-orange-500 text-white hover:bg-orange-600"
                disabled={isLoading}
              >
                {isLoading ? 'Đang lọc...' : 'Áp dụng'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderFilter;
"use client"

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { StatCard } from '@/components/admin/dashboard/stat-card';
import { DollarSign, ShoppingBag, TimerIcon, TrendingUp } from 'lucide-react';
import { RevenueData, ProductData, OrderStatusData, Stats } from '@/types/dashboard';
import { getRevenueTrends, getTopProducts, getOrderStatuses, getPendingOrders } from '@/actions/statistic.action';
import { formatNumber } from '@/lib/utils';

export function Dashboard() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductData[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalPendingOrders: 0,
    totalOrdersToday: 0,
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch revenue trends
        const revenueTrends = await getRevenueTrends();
        setRevenueData(revenueTrends);

        const products = await getTopProducts();
        setTopProducts(products);
  
        // Fetch order status statistics
        const { statuses, totalOrdersToday } = await getOrderStatuses();
  
        setStats({
          totalRevenue: revenueTrends.reduce((sum, item) => sum + item.value, 0),
          totalOrders: statuses.reduce((sum, item) => sum + item.value, 0),
          totalPendingOrders: statuses.find((status) => status.name === "pending")?.value || 0,
          totalOrdersToday, // Sử dụng giá trị trả về từ API
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-auto">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <StatCard
          title="Tổng doanh thu"
          value={`${formatNumber(stats.totalRevenue)}`}
          trend="up"
          trendValue="12.5%"
          icon={DollarSign}
        />
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders}
          trend="down"
          trendValue="8.2%"
          icon={ShoppingBag}
          color="#22cgde"
        />

        <StatCard
          title="Đơn chờ xử lý"
          value={stats.totalPendingOrders}
          trend="up"
          trendValue="8.2%"
          icon={TimerIcon}
          color="#ef4444"
        />
        
        <StatCard
          title="Tổng đơn trong ngày"
          value={stats.totalOrdersToday}
          trend="up"
          trendValue="4.3%"
          icon={TrendingUp}
          color="#6366f1"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Revenue Trends */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold mb-4">Biểu đồ doanh thu</h2>
          <div className="h-60 sm:h-80">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#f97316" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">Hiện không đủ dữ liệu</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold mb-4">Sản phẩm bán chạy</h2>
          <div className="h-60 sm:h-80">
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">Hiện không đủ dữ liệu</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export interface RevenueData {
  name: string; // Ngày hoặc tháng (để hiển thị trên biểu đồ)
  value: number; // Tổng doanh thu
}

export interface ProductData {
  name: string; // Tên sản phẩm
  value: number; // Số lượng sản phẩm bán ra
}

export interface OrderStatusData {
  name: string; // Trạng thái đơn hàng (Pending, Completed, Cancelled, ...)
  value: number; // Số lượng đơn hàng thuộc trạng thái đó
}

export interface PendingOrder {
  _id: string; // ID của đơn hàng
  table: string; // Số bàn của khách hàng
  totalAmount: number; // Tổng tiền của đơn hàng
  createdAt: Date; // Thời gian tạo đơn hàng
}

export interface Stats {
  totalRevenue: number; // Tổng doanh thu
  totalOrders: number; // Tổng số đơn hàng
  totalPendingOrders: number; // Tổng số đơn hàng đang chờ xử lý
  totalCustomers?: number; // Tổng số khách hàng
  totalOrdersToday: number; // Tỷ lệ chuyển đổi
}
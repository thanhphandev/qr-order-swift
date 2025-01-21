'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ListOrdered,
  QrCode,
  Users,
  Settings,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  History,
  Table,
} from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (is: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Tổng quan',
      icon: Home,
      path: '/admin/dashboard',
    },
    {
      id: 'menu',
      title: 'Quản lý Menu',
      icon: ListOrdered,
      path: '/admin/menu',
    },
    {
      id: 'orders',
      title: 'Đơn hàng',
      icon: History,
      submenu: [
        { id: 'current-orders', title: 'Đơn hiện tại', icon: Table, path: '/admin/orders/current' },
        { id: 'order-history', title: 'Lịch sử đơn', icon: History, path: '/admin/orders/history' },
      ],
    },
    {
      id: 'qr',
      title: 'QR Management',
      icon: QrCode,
      submenu: [
        { id: 'generate-qr', title: 'Tạo QR Code', icon: QrCode, path: '/qr/generate' },
        { id: 'table-qr', title: 'QR theo bàn', icon: Table, path: '/qr/table' },
      ],
    },
    {
      id: 'analytics',
      title: 'Thống kê',
      icon: BarChart3,
      path: '/analytics',
    },
    {
      id: 'users',
      title: 'Người dùng',
      icon: Users,
      path: '/users',
    },
    {
      id: 'settings',
      title: 'Cài đặt',
      icon: Settings,
      path: '/admin/settings',
    },
  ];

  const toggleSubmenu = (menuId: string) => {
    setExpandedSubmenu(expandedSubmenu === menuId ? null : menuId);
  };

  const getActiveMenu = () => {
    for (const item of menuItems) {
      if (item.path === pathname) return item.id;
      if (item.submenu) {
        const activeSub = item.submenu.find((sub) => sub.path === pathname);
        if (activeSub) return item.id;
      }
    }
    return null;
  };

  const isActiveSubmenuItem = (path: string) => pathname === path;

  useEffect(() => {
    const activeMenu = getActiveMenu();
    if (activeMenu) setExpandedSubmenu(activeMenu);
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black lg:hidden z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-orange-100 
          w-72 z-40 overflow-y-auto overflow-x-hidden shadow-lg"
      >
        <div className="p-4">
          {/* Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-6 top-6 bg-orange-500 text-white p-1 rounded-full 
              shadow-lg hover:bg-orange-600 transition-colors duration-200 lg:hidden"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>

          {/* Menu Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.submenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg 
                      transition-colors duration-200 group
                      ${
                        getActiveMenu() === item.id
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon
                        className={`h-5 w-5 ${
                          getActiveMenu() === item.id
                            ? 'text-orange-600'
                            : 'text-gray-500 group-hover:text-orange-600'
                        }`}
                      />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-200 
                        ${expandedSubmenu === item.id ? 'rotate-90' : ''}`}
                    />
                  </button>
                ) : (
                  <Link
                    onClick={() => setIsOpen(false)}
                    href={item.path}
                    className={`w-full flex items-center p-3 rounded-lg 
                      transition-colors duration-200 group
                      ${
                        pathname === item.path
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon
                        className={`h-5 w-5 ${
                          pathname === item.path
                            ? 'text-orange-600'
                            : 'text-gray-500 group-hover:text-orange-600'
                        }`}
                      />
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </Link>
                )}

                {/* Submenu */}
                {item.submenu && (
                  <AnimatePresence>
                    {expandedSubmenu === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 mt-1 space-y-1"
                      >
                        {item.submenu.map((subItem) => (
                          <Link
                            onClick={() => setIsOpen(false)}
                            key={subItem.id}
                            href={subItem.path}
                            className={`w-full flex items-center p-2 rounded-lg text-sm
                              transition-colors duration-200 group space-x-3
                              ${
                                isActiveSubmenuItem(subItem.path)
                                  ? 'bg-orange-50 text-orange-600'
                                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                              }`}
                          >
                            <subItem.icon
                              className={`h-4 w-4 ${
                                isActiveSubmenuItem(subItem.path)
                                  ? 'text-orange-600'
                                  : 'text-gray-500 group-hover:text-orange-600'
                              }`}
                            />
                            <span>{subItem.title}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
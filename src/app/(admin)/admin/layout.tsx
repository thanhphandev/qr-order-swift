'use client'

import AdminHeader from "@/components/admin/Header";
import Sidebar from "@/components/admin/SideBar";
import React, { useState, useCallback } from 'react';


interface LayoutProps {
    children: React.ReactNode;
  }

const AdminLayout = ({ children }: LayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    const toggleSidebar = useCallback(() => {
      setIsSidebarOpen(prev => !prev);
    }, []);
  
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader onMenuClick={toggleSidebar} />
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
        />
        <main className={`pt-16 transition-all duration-300 
          ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}
          min-h-[calc(100vh-4rem)]`}
        >
          <div className="p-4 md:p-6 mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    );
  };
  
  export default AdminLayout;
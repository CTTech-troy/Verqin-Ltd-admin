
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0 md:ml-64'}`}> 
        <TopBar onHamburger={() => setSidebarOpen((v) => !v)} sidebarOpen={sidebarOpen} />
        <main className="flex-1 p-6">{children}</main>
      </div>
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
export default DashboardLayout;
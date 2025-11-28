import React from 'react';
import  Sidebar  from './Sidebar';
import  TopBar  from './TopBar';

function DashboardLayout({children}) {
  return <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <TopBar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>;
}
export default DashboardLayout
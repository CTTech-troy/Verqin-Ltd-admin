import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboardIcon, FileTextIcon, BriefcaseIcon, UsersIcon, MessageSquareIcon, Settings, XIcon } from 'lucide-react';
const menuItems = [{
  id: 'dashboard',
  label: 'Dashboard',
  icon: LayoutDashboardIcon,
  path: '/dashboard'
}, {
  id: 'applications',
  label: 'Applications',
  icon: FileTextIcon,
  path: '/dashboard/applications'
}, 
//{
//   id: 'employers',
//   label: 'Employers',
//   icon: BriefcaseIcon,
//   path: '/dashboard/employers'
// }, {
//   id: 'candidates',
//   label: 'Candidates',
//   icon: UsersIcon,
//   path: '/dashboard/candidates'
// }, {
//   id: 'contact',
//   label: 'Contact Messages',
//   icon: MessageSquareIcon,
//   path: '/dashboard/contact'
// },
{
  id: 'settings',
  label: 'Settings',
  icon: Settings,
  path: '/dashboard/settings'
}];
function Sidebar({ open, setOpen }) {
  const location = useLocation();
  return (
    <>
      {/* Sidebar for desktop and mobile */}
      <div
        className={`fixed left-0 top-0 w-64 bg-white border-r border-gray-200 h-screen p-6 overflow-y-auto z-40 transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Hamburger close button for mobile */}
        <div className="flex items-center justify-between mb-8 md:mb-8">
          <div>
            <h1 className="text-2xl font-bold text-sky-600">Verqin Ltd</h1>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <XIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <nav className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-sky-50 text-sky-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
export default Sidebar;
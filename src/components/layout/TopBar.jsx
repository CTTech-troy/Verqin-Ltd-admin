import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import  Button  from '../ui/Button';
import { LogOutIcon, UserIcon, SettingsIcon } from 'lucide-react';
function TopBar() {
  const {
    user,
    logout
  } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  return <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Welcome back, {user?.name}
          </h2>
          <p className="text-sm text-gray-500">
            Manage your recruitment operations
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-sky-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </button>

            {showMenu && <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <SettingsIcon className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button onClick={logout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                  <LogOutIcon className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>}
          </div>
        </div>
      </div>
    </div>;
}

export default TopBar
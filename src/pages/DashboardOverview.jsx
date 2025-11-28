import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import { mockDashboardStats } from '../utils/mockData';
import { FileTextIcon, BriefcaseIcon, UsersIcon, MessageSquareIcon } from 'lucide-react';
function DashboardOverview() {
  const [applicationCount, setApplicationCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : 'https://verqinltd-backend-2.onrender.com';

  useEffect(() => {
    async function fetchCount() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE.replace(/\/$/, '')}/api/applications`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setApplicationCount(Array.isArray(data) ? data.length : (data.applications ? data.applications.length : 0));
      } catch (e) {
        setApplicationCount(0);
      } finally {
        setLoading(false);
      }
    }
    fetchCount();
  }, [API_BASE]);

  const stats = [{
    label: 'Total Applications',
    value: loading ? '...' : applicationCount,
    icon: FileTextIcon,
    color: 'bg-sky-100 text-sky-600'
  }, {
    label: 'Employer Requests',
    value: mockDashboardStats.totalEmployers,
    icon: BriefcaseIcon,
    color: 'bg-emerald-100 text-emerald-600'
  }, {
    label: 'Registered Candidates',
    value: mockDashboardStats.totalCandidates,
    icon: UsersIcon,
    color: 'bg-amber-100 text-amber-600'
  }, {
    label: 'Contact Messages',
    value: mockDashboardStats.totalContactMessages,
    icon: MessageSquareIcon,
    color: 'bg-purple-100 text-purple-600'
  }];
  return <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
        const Icon = stat.icon;
        return <Card key={index} hover className="animate-slide-up" style={{
          animationDelay: `${index * 100}ms`
        }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>;
      })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <LineChart data={mockDashboardStats.applicationsChart} title="Applications Trend (Last 7 Days)" />
        </Card>
        <Card>
          <BarChart data={mockDashboardStats.topRoles} title="Top 5 Roles Applied For" />
        </Card>
      </div>

      {/* Recent Activity */}
      {/* <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {mockDashboardStats.recentActivity.map(activity => <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
              <div className="w-2 h-2 bg-sky-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>)}
        </div>
      </Card> */}
    </div>;
}

export default DashboardOverview
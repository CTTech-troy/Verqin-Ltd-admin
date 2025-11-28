import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
// import { Table, Column } from '../components/ui/Table';
import Table from '../components/ui/Table';
import SearchBar from '../components/ui/SearchBar';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import  ApplicationDetailModal  from './ApplicationDetailModal';
import { formatDate } from '../utils/formatters';
function ApplicationsPage() {
  const navigate = useNavigate();
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : 'https://verqinltd-backend-2.onrender.com';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); 
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE.replace(/\/$/, '')}/api/applications`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : data.applications || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch applications');
        // Do not fallback to sample data — show empty list so admin sees real API state
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [API_BASE]);

  // Open application modal by fetching full application by id when possible
  const openApplication = async (row) => {
    const id = row.applicationId || row.id;
    if (!id) {
      return;
    }
    // Navigate to the dedicated details page instead of opening modal
    navigate(`/applications/${encodeURIComponent(id)}`);
  };
  const resolveName = app => app.name || `${(app.firstName || app.personalInfo?.firstName || '').trim()} ${(app.lastName || app.personalInfo?.lastName || '').trim()}`.trim() || app.email || '—';
  const resolveEmail = app => app.email || app.personalInfo?.email || '—';
  const resolvePhone = app => app.phone || app.personalInfo?.phone || '—';
  const resolveDate = app => app.dateApplied || app.receivedAt || app.createdAt || null;

  const filteredApplications = applications.filter(app => {
    const name = (resolveName(app) || '').toString().toLowerCase();
    const email = (resolveEmail(app) || '').toString().toLowerCase();
    const appId = (app.applicationId || app.id || '').toString().toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase()) || appId.includes(searchQuery.toLowerCase()) || (resolvePhone(app) || '').toString().includes(searchQuery);
    const matchesStatus = !statusFilter || (app.status || (app.body && app.body.status) || '').toString() === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const columns = [
    {
      key: 'applicationId',
      label: 'Application ID',
      render: (v, row) => row.applicationId || row.id || '—'
    },
    {
      key: 'name',
      label: 'Applicant Name',
      render: (v, row) => resolveName(row)
    },
    {
      key: 'email',
      label: 'Email',
      render: (v, row) => resolveEmail(row)
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (v, row) => resolvePhone(row)
    },
    {
      key: 'dateApplied',
      label: 'Date Applied',
      render: (value, row) => formatDate(resolveDate(row))
    },
    {
      key: 'id',
      label: 'Action',
      render: (value, row) => <Button size="sm" variant="ghost" onClick={e => {
        e.stopPropagation();
        const id = row.applicationId || row.id;
        if (id) {
          navigate(`/applications/${encodeURIComponent(id)}`);
        }
      }}>
            View More
          </Button>
    }
  ];
  const handleUpdateStatus = () => {
    // Status update will be handled on the details page
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-600 mt-1">Manage all candidate applications</p>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by name or email..." />
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onChange={setStatusFilter} options={[{
            value: '',
            label: 'All Statuses'
          }, {
            value: 'new',
            label: 'New'
          }, {
            value: 'reviewed',
            label: 'Reviewed'
          }, {
            value: 'ignored',
            label: 'Ignored'
          }]} placeholder="Filter by status" />
          </div>
        </div>

        {loading && <div className="text-center py-8 text-gray-500">Loading applications...</div>}
        {error && <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg mb-4">Showing cached data — API error: {error}</div>}
        {!loading && <Table columns={columns} data={filteredApplications} onRowClick={openApplication} />}

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredApplications.length} of {applications.length}{' '}
          applications
        </div>
      </Card>
    </div>;
}

export default ApplicationsPage
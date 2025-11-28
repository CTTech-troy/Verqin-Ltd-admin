import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import SearchBar from '../components/ui/SearchBar';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import  EmployerDetailModal  from './EmployerDetailModal';
import { mockEmployers } from '../utils/mockData';
import { formatDate, getStatusColor, getStatusLabel } from '../utils/formatters';
function EmployersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [employers, setEmployers] = useState(mockEmployers);
  const filteredEmployers = employers.filter(emp => {
    const matchesSearch = emp.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || emp.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const columns = [{
    key: 'companyName',
    label: 'Company Name'
  }, {
    key: 'contactPerson',
    label: 'Contact Person'
  }, {
    key: 'email',
    label: 'Email'
  }, {
    key: 'roleTitle',
    label: 'Role Title'
  }, {
    key: 'dateSubmitted',
    label: 'Date Submitted',
    render: value => formatDate(value)
  }, {
    key: 'status',
    label: 'Status',
    render: value => <Badge variant={getStatusColor(value)}>{getStatusLabel(value)}</Badge>
  }, {
    key: 'id',
    label: 'Action',
    render: (value, row) => <Button size="sm" variant="ghost" onClick={e => {
      e.stopPropagation();
      setSelectedEmployer(row);
    }}>
          View More
        </Button>
  }];
  const handleUpdateStatus = (id, newStatus) => {
    setEmployers(emps => emps.map(emp => emp.id === id ? {
      ...emp,
      status: newStatus
    } : emp));
  };
  const handleUpdateNotes = (id, notes) => {
    setEmployers(emps => emps.map(emp => emp.id === id ? {
      ...emp,
      notes
    } : emp));
  };
  const handleDelete = (id) => {
    setEmployers(emps => emps.filter(emp => emp.id !== id));
    setSelectedEmployer(null);
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Employer Requests</h1>
        <p className="text-gray-600 mt-1">
          Manage hiring requests from employers
        </p>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by company or contact..." />
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onChange={setStatusFilter} options={[{
            value: '',
            label: 'All Statuses'
          }, {
            value: 'new',
            label: 'New'
          }, {
            value: 'contacted',
            label: 'Contacted'
          }, {
            value: 'closed',
            label: 'Closed'
          }]} placeholder="Filter by status" />
          </div>
        </div>

        <Table columns={columns} data={filteredEmployers} onRowClick={setSelectedEmployer} />

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredEmployers.length} of {employers.length} employer
          requests
        </div>
      </Card>

      {selectedEmployer && <EmployerDetailModal employer={selectedEmployer} onClose={() => setSelectedEmployer(null)} onUpdateStatus={handleUpdateStatus} onUpdateNotes={handleUpdateNotes} onDelete={handleDelete} />}
    </div>;
}

export default EmployersPage
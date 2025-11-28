import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import SearchBar from '../components/ui/SearchBar';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import  ContactDetailModal  from './ContactDetailModal';
import { mockContactMessages } from '../utils/mockData';
import { formatDate, getStatusColor, getStatusLabel } from '../utils/formatters';
function ContactPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState(mockContactMessages);
  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchQuery.toLowerCase()) || msg.email.toLowerCase().includes(searchQuery.toLowerCase()) || msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || msg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const columns = [{
    key: 'name',
    label: 'Name'
  }, {
    key: 'email',
    label: 'Email'
  }, {
    key: 'subject',
    label: 'Subject'
  }, {
    key: 'date',
    label: 'Date',
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
      setSelectedMessage(row);
    }}>
          View Message
        </Button>
  }];
  const handleUpdateStatus = (id, newStatus) => {
    setMessages(msgs => msgs.map(msg => msg.id === id ? {
      ...msg,
      status: newStatus
    } : msg));
  };
  const handleDelete = (id) => {
    setMessages(msgs => msgs.filter(msg => msg.id !== id));
    setSelectedMessage(null);
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-gray-600 mt-1">Manage contact form submissions</p>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by name, email, or subject..." />
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onChange={setStatusFilter} options={[{
            value: '',
            label: 'All Statuses'
          }, {
            value: 'new',
            label: 'New'
          }, {
            value: 'resolved',
            label: 'Resolved'
          }]} placeholder="Filter by status" />
          </div>
        </div>

        <Table columns={columns} data={filteredMessages} onRowClick={setSelectedMessage} />

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredMessages.length} of {messages.length} messages
        </div>
      </Card>

      {selectedMessage && <ContactDetailModal message={selectedMessage} onClose={() => setSelectedMessage(null)} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />}
    </div>;
}

export default ContactPage
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import SearchBar from '../components/ui/SearchBar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import  CandidateDetailModal  from './CandidateDetailModal';
import { mockCandidates } from '../utils/mockData';
import { formatDate, getStatusColor, getStatusLabel } from '../utils/formatters';
function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates, setCandidates] = useState(mockCandidates);
  const filteredCandidates = candidates.filter(cand => cand.name.toLowerCase().includes(searchQuery.toLowerCase()) || cand.email.toLowerCase().includes(searchQuery.toLowerCase()) || cand.desiredRole.toLowerCase().includes(searchQuery.toLowerCase()));
  const columns = [{
    key: 'name',
    label: 'Name'
  }, {
    key: 'email',
    label: 'Email'
  }, {
    key: 'phone',
    label: 'Phone'
  }, {
    key: 'desiredRole',
    label: 'Desired Role'
  }, {
    key: 'dateRegistered',
    label: 'Date Registered',
    render: value => formatDate(value)
  }, {
    key: 'tag',
    label: 'Tag',
    render: value => <Badge variant={getStatusColor(value)}>{getStatusLabel(value)}</Badge>
  }, {
    key: 'id',
    label: 'Action',
    render: (value, row) => <Button size="sm" variant="ghost" onClick={e => {
      e.stopPropagation();
      setSelectedCandidate(row);
    }}>
          View More
        </Button>
  }];
  const handleUpdateTag = (id, newTag) => {
    setCandidates(cands => cands.map(cand => cand.id === id ? {
      ...cand,
      tag: newTag
    } : cand));
  };
  const handleDelete = (id) => {
    setCandidates(cands => cands.filter(cand => cand.id !== id));
    setSelectedCandidate(null);
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
        <p className="text-gray-600 mt-1">Manage registered candidates</p>
      </div>

      <Card>
        <div className="mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by name, email, or desired role..." />
        </div>

        <Table columns={columns} data={filteredCandidates} onRowClick={setSelectedCandidate} />

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </div>
      </Card>

      {selectedCandidate && <CandidateDetailModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} onUpdateTag={handleUpdateTag} onDelete={handleDelete} />}
    </div>;
}

export default CandidatesPage
import React, { useState } from 'react';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import { formatDate, getStatusColor, getStatusLabel } from '../utils/formatters';
import { DownloadIcon, TrashIcon, TagIcon } from 'lucide-react';

function CandidateDetailModal({
  candidate,
  onClose,
  onUpdateTag,
  onDelete
}) {
  const [notes, setNotes] = useState('');
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      onDelete(candidate.id);
    }
  };
  return <Modal isOpen={true} onClose={onClose} title="Candidate Details" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {candidate.name}
            </h2>
            <p className="text-gray-600">{candidate.email}</p>
          </div>
          <Badge variant={getStatusColor(candidate.tag)}>
            {getStatusLabel(candidate.tag)}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-gray-500" />
            <Select value={candidate.tag} onChange={value => onUpdateTag(candidate.id, value)} options={[{
            value: 'potential',
            label: 'Potential'
          }, {
            value: 'not suitable',
            label: 'Not Suitable'
          }]} />
          </div>
          <Button size="sm" variant="danger" onClick={handleDelete}>
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        {/* Candidate Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField label="Phone" value={candidate.phone} />
          <InfoField label="Date Registered" value={formatDate(candidate.dateRegistered)} />
          <InfoField label="Desired Role" value={candidate.desiredRole} className="md:col-span-2" />
          <InfoField label="Skills" value={candidate.skills} className="md:col-span-2" />
          <InfoField label="Experience" value={candidate.experience} className="md:col-span-2" />
        </div>

        {/* CV/Resume */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-900">CV / Resume</p>
            <p className="text-sm text-gray-500">{candidate.cv}</p>
          </div>
          <Button size="sm" variant="ghost">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        {/* Admin Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Notes
          </label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="Add internal notes about this candidate..." />
        </div>
      </div>
    </Modal>;
}
function InfoField({ label, value, className = ''}) 
{
  return <div className={className}>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-base text-gray-900">{value}</p>
    </div>;
}

export default CandidateDetailModal
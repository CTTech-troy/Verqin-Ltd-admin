import React, { useState } from 'react';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatDate, getStatusColor, getStatusLabel } from '../utils/formatters';
import { DownloadIcon, TrashIcon, PhoneIcon, MailIcon } from 'lucide-react';

function EmployerDetailModal({
  employer,
  onClose,
  onUpdateStatus,
  onUpdateNotes,
  onDelete
}) {
  const [notes, setNotes] = useState(employer.notes);
  const handleSaveNotes = () => {
    onUpdateNotes(employer.id, notes);
  };
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this employer request?')) {
      onDelete(employer.id);
    }
  };
  return <Modal isOpen={true} onClose={onClose} title="Employer Request Details" size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {employer.companyName}
            </h2>
            <p className="text-gray-600">{employer.roleTitle}</p>
          </div>
          <Badge variant={getStatusColor(employer.status)}>
            {getStatusLabel(employer.status)}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button size="sm" variant="primary" onClick={() => onUpdateStatus(employer.id, 'contacted')}>
            <PhoneIcon className="w-4 h-4 mr-2" />
            Mark as Contacted
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onUpdateStatus(employer.id, 'closed')}>
            Mark as Closed
          </Button>
          <Button size="sm" variant="danger" onClick={handleDelete}>
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField label="Contact Person" value={employer.contactPerson} />
          <InfoField label="Date Submitted" value={formatDate(employer.dateSubmitted)} />
          <InfoField label="Email" value={employer.email} />
          <InfoField label="Phone" value={employer.phone} />
          <InfoField label="Number of Hires" value={employer.hiresNeeded.toString()} />
          <InfoField label="Budget" value={employer.budget} />
        </div>

        {/* Job Description */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">
            Job Description
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900">{employer.jobDescription}</p>
          </div>
        </div>

        {/* Attached Document */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Job Description Document
            </p>
            <p className="text-sm text-gray-500">{employer.jdFile}</p>
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
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="Add internal notes about this employer request..." />
          <div className="mt-2">
            <Button size="sm" onClick={handleSaveNotes}>
              Save Notes
            </Button>
          </div>
        </div>
      </div>
    </Modal>;
}
function InfoField({
  label,
  value
}) {
  return <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-base text-gray-900">{value}</p>
    </div>;
}

export default EmployerDetailModal
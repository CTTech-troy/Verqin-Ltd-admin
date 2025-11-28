import React from 'react';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatDate, getStatusColor, getStatusLabel } from '../utils/formatters';
import { TrashIcon, MailIcon, CheckIcon } from 'lucide-react';

function ContactDetailModal({
  message,
  onClose,
  onUpdateStatus,
  onDelete
}) {
  const handleReply = () => {
    window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`;
  };
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      onDelete(message.id);
    }
  };
  return <Modal isOpen={true} onClose={onClose} title="Contact Message" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {message.subject}
            </h2>
            <p className="text-gray-600 text-sm mt-1">From: {message.name}</p>
          </div>
          <Badge variant={getStatusColor(message.status)}>
            {getStatusLabel(message.status)}
          </Badge>
        </div>

        {/* Message Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="Name" value={message.name} />
          <InfoField label="Date" value={formatDate(message.date)} />
          <InfoField label="Email" value={message.email} className="md:col-span-2" />
        </div>

        {/* Message Content */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Message</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900 whitespace-pre-wrap">
              {message.message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          <Button size="sm" variant="primary" onClick={handleReply}>
            <MailIcon className="w-4 h-4 mr-2" />
            Reply via Email
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onUpdateStatus(message.id, 'resolved')}>
            <CheckIcon className="w-4 h-4 mr-2" />
            Mark as Resolved
          </Button>
          <Button size="sm" variant="danger" onClick={handleDelete}>
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </Modal>;
}
function InfoField({
  label,
  value,
  className = ''
}) {
  return <div className={className}>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-base text-gray-900">{value}</p>
    </div>;
}

export default ContactDetailModal
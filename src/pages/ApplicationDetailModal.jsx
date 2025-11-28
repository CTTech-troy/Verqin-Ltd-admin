import React, { useState } from 'react';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import { formatDate } from '../utils/formatters';
import { DownloadIcon, TrashIcon, CheckIcon, XIcon } from 'lucide-react';

function ApplicationDetailModal({
  application,
  onClose,
  onUpdateStatus,
  onDelete
}) {
  const [activeTab, setActiveTab] = useState('details');
  const tabs = [
    { id: 'details', label: 'Full Details' },
    { id: 'documents', label: 'Documents' },
    { id: 'raw', label: 'Raw JSON' }
  ];
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      onDelete(application.id);
    }
  };
  if (!application) {
    console.log('❌ Application is NULL in modal');
    return null;
  }

  console.log('MODAL APPLICATION:', application);
  const flat = flattenApplication(application || {});
  const displayName = flat.name || `${(flat.firstName || '').trim()} ${(flat.lastName || '').trim()}`.trim() || flat.email || application.applicationId || application.id || 'Applicant';
  const displayEmail = flat.email || application.email || '—';

  return (
    <Modal isOpen={true} onClose={onClose} title={`Application ${application.applicationId || application.id || ''}`} size="xl">
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-200 gap-2">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 truncate">
              {displayName}
            </h2>
            <p className="text-gray-600 break-all">{displayEmail}</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => window.open(`/applications/${application.applicationId || application.id}`, '_blank')}>
            View Full Page
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button size="sm" variant="primary" onClick={() => onUpdateStatus(application.id, 'reviewed')}>
            <CheckIcon className="w-4 h-4 mr-2" />
            Mark as Reviewed
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onUpdateStatus(application.id, 'ignored')}>
            <XIcon className="w-4 h-4 mr-2" />
            Ignore
          </Button>
          <Button size="sm" variant="ghost" onClick={() => downloadAnyFile(application)}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download Attachment
          </Button>
          <Button size="sm" variant="danger" onClick={handleDelete}>
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(flat)
                .filter(([, value]) => value !== undefined && value !== null && value !== '')
                .map(([key, value]) => (
                  <InfoField
                    key={key}
                    label={formatLabel(key)}
                    value={
                      typeof value === 'object' && value !== null
                        ? JSON.stringify(value, null, 2)
                        : key.toLowerCase().includes('date')
                        ? formatDate(value)
                        : value
                    }
                  />
                ))}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              {application.uploads && Object.keys(application.uploads).map(docKey => (
                <DocumentItem key={docKey} label={formatLabel(docKey)} filename={application.uploads[docKey].originalName || docKey} />
              ))}
              {/* Fallback for legacy fields */}
              {application.cv && <DocumentItem label="CV / Resume" filename={application.cv} />}
              {application.coverLetter && <DocumentItem label="Cover Letter" filename={application.coverLetter} />}
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm overflow-auto" style={{ maxHeight: 400 }}>
                {JSON.stringify(application, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
// Attempt to find a suitable base64 image or file and trigger download
function downloadAnyFile(application) {
  try {
    // Check common locations for base64 images
    const b64 = application.images?.main?.base64 || application.uploads?.passport?.base64 || application.uploads?.licence?.base64 || application.uploads?.rightToWork?.base64 || application.body?.img || application.img;
    const mime = application.images?.main?.mimeType || application.uploads?.passport?.mimeType || application.uploads?.licence?.mimeType || 'application/octet-stream';
    if (!b64) {
      alert('No downloadable attachment found for this application.');
      return;
    }

    const dataUrl = b64.startsWith('data:') ? b64 : `data:${mime};base64,${b64}`;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${application.applicationId || application.id || 'attachment'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error('downloadAnyFile error', e);
    alert('Failed to download attachment');
  }
}
function InfoField({
  label,
  value,
  className = ''
}) {
  const renderValue = value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value, null, 2) : value;
  return <div className={className}>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-base text-gray-900 whitespace-pre-wrap">{renderValue}</p>
    </div>;
}
function DocumentItem({
  label,
  filename
}) {
  return <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{filename}</p>
      </div>
      <Button size="sm" variant="ghost">
        <DownloadIcon className="w-4 h-4 mr-2" />
        Download
      </Button>
    </div>;
}

// Helper to flatten nested personalInfo/body/questionnaire fields for display
function flattenApplication(app) {
  const flat = {};
  try {
    Object.assign(flat, app || {});
  } catch (e) {
    console.warn('flattenApplication: failed to assign base app', e);
  }
  try {
    if (app && app.personalInfo) Object.assign(flat, app.personalInfo);
  } catch (e) {
    console.warn('flattenApplication: failed to assign personalInfo', e);
  }
  try {
    if (app && app.body) Object.assign(flat, app.body);
  } catch (e) {
    console.warn('flattenApplication: failed to assign body', e);
  }
  try {
    if (app && app.questionnaire) Object.assign(flat, app.questionnaire);
  } catch (e) {
    console.warn('flattenApplication: failed to assign questionnaire', e);
  }
  return flat;
}

function formatLabel(label) {
  return label.replace(/([A-Z])/g, ' $1').replace(/^./, function(s) { return s.toUpperCase(); });
}

export default ApplicationDetailModal
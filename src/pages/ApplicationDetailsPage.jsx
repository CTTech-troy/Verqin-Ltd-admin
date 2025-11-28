import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/formatters';
import { ArrowLeftIcon, DownloadIcon, TrashIcon, CheckIcon, XIcon } from 'lucide-react';

function flattenApplication(app) {
  const flat = {};
  try {
    Object.assign(flat, app || {});
  } catch (e) {
    console.warn('flattenApplication(details): base assign failed', e);
  }
  try {
    if (app && app.personalInfo) Object.assign(flat, app.personalInfo);
  } catch (e) {
    console.warn('flattenApplication(details): personalInfo assign failed', e);
  }
  try {
    if (app && app.body) Object.assign(flat, app.body);
  } catch (e) {
    console.warn('flattenApplication(details): body assign failed', e);
  }
  try {
    if (app && app.questionnaire) Object.assign(flat, app.questionnaire);
  } catch (e) {
    console.warn('flattenApplication(details): questionnaire assign failed', e);
  }
  return flat;
}
function formatLabel(label) {
  return label.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

function downloadAnyFile(application) {
  try {
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

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : 'https://verqinltd-backend-2.onrender.com';

  useEffect(() => {
    async function fetchApp() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE.replace(/\/$/, '')}/api/applications/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setApplication(data || null);
      } catch (err) {
        setError(err.message || 'Failed to fetch application');
      } finally {
        setLoading(false);
      }
    }
    fetchApp();
  }, [id, API_BASE]);
  console.log('APPLICATION:', application);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        const res = await fetch(`${API_BASE.replace(/\/$/, '')}/api/applications/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        alert('Application deleted successfully');
        navigate('/dashboard/applications');
      } catch (err) {
        console.error('Delete error:', err);
        alert(`Failed to delete application: ${err.message}`);
      }
    }
  };

  const handleMarkAsReviewed = async () => {
    try {
      const res = await fetch(`${API_BASE.replace(/\/$/, '')}/api/applications/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'reviewed' })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      alert('Application marked as reviewed');
      // Refresh the application data
      setApplication(prev => prev ? { ...prev, status: 'reviewed', updatedAt: data.updatedAt } : null);
    } catch (err) {
      console.error('Mark as reviewed error:', err);
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleIgnore = async () => {
    try {
      const res = await fetch(`${API_BASE.replace(/\/$/, '')}/api/applications/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ignored' })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      alert('Application marked as ignored');
      // Refresh the application data
      setApplication(prev => prev ? { ...prev, status: 'ignored', updatedAt: data.updatedAt } : null);
    } catch (err) {
      console.error('Ignore error:', err);
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleDownload = () => {
    if (application) {
      downloadAnyFile(application);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500"><div className="text-lg">Loading application...</div></div>;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8"><div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">Error: {error}</div></div>;
  if (!application) return <div className="max-w-4xl mx-auto px-4 py-8"><div className="text-center text-gray-500 py-8">Application not found.</div></div>;

  const flat = flattenApplication(application);
  const displayName = `${application.firstName || application.personalInfo?.firstName || ''} ${application.lastName || application.personalInfo?.lastName || ''}`.trim() || application.email || 'Applicant';
  const displayEmail = application.email || application.personalInfo?.email || '';
  const displayPhone = application.phone || application.personalInfo?.phone || '';

  // Organize fields into sections
  const personalInfoFields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'nationality'];
  const addressFields = ['addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country'];
  const workFields = ['currentRole', 'yearsExperience', 'employmentType', 'salary', 'noticePeriod'];
  const questionnireFields = ['availability', 'willingToRelocate', 'preferredLocations', 'responsibilities', 'rightToWork'];

  const renderSection = (title, fields, data) => {
    const filtered = fields.filter(f => data[f] !== undefined && data[f] !== null && data[f] !== '');
    if (filtered.length === 0) return null;
    return (
      <div key={title} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-1 h-6 bg-blue-600 rounded mr-3"></span>
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(key => {
            const value = data[key];
            let displayValue = value;
            
            // Handle arrays
            if (Array.isArray(value)) {
              displayValue = value.join(', ');
            }
            // Handle objects (except dates)
            else if (typeof value === 'object' && value !== null) {
              displayValue = Object.entries(value)
                .map(([k, v]) => `${formatLabel(k)}: ${v}`)
                .join('\n');
            }
            
            return (
              <div key={key} className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{formatLabel(key)}</p>
                <p className="text-sm text-gray-900 whitespace-pre-wrap break-all leading-relaxed">
                  {key.toLowerCase().includes('date') ? formatDate(value) : displayValue}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard/applications')}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Applications
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{displayName}</h1>
              <p className="text-gray-600 text-lg mb-2">{displayEmail}</p>
              {displayPhone && <p className="text-gray-500 text-sm">{displayPhone}</p>}
              <p className="text-gray-400 text-xs mt-3">Application ID: {application.applicationId || application.id}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="primary" onClick={handleMarkAsReviewed}>
                <CheckIcon className="w-4 h-4 mr-2" />
                Reviewed
              </Button>
              <Button size="sm" variant="secondary" onClick={handleIgnore}>
                <XIcon className="w-4 h-4 mr-2" />
                Ignore
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDownload}>
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button size="sm" variant="danger" onClick={handleDelete}>
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Details Sections */}
        <div className="space-y-6">
          {renderSection('📋 Personal Information', personalInfoFields, flat)}
          {renderSection('📍 Address', addressFields, flat)}
          {renderSection('💼 Work Experience', workFields, flat)}
          {renderSection('❓ Additional Information', questionnireFields, flat)}
          
          {/* Other Fields */}
          {(() => {
            const allKnownFields = [...personalInfoFields, ...addressFields, ...workFields, ...questionnireFields];
            const otherFields = Object.keys(flat).filter(k => !allKnownFields.includes(k) && k !== 'img');
            if (otherFields.length === 0) return null;
            
            return (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-1 h-6 bg-indigo-600 rounded mr-3"></span>
                  ℹ️ Other Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {otherFields.map(key => {
                    const value = flat[key];
                    let displayValue = value;
                    
                    if (Array.isArray(value)) {
                      displayValue = value.join(', ');
                    } else if (typeof value === 'object' && value !== null) {
                      displayValue = Object.entries(value)
                        .map(([k, v]) => `${formatLabel(k)}: ${v}`)
                        .join(' • ');
                    }
                    
                    return (
                      <div key={key} className="bg-linear-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2">{formatLabel(key)}</p>
                        <p className="text-sm text-gray-800 line-clamp-3 break-all">{String(displayValue)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Images Gallery Section - 2 per row */}
          {(() => {
            const allImages = [];
            
            // Collect all images from various sources
            if (application.body && application.body.img) {
              allImages.push({ 
                id: 'body-img', 
                base64: application.body.img, 
                type: 'Application Photo',
                mimeType: 'image/png'
              });
            }
            
            if (application.images) {
              Object.entries(application.images).forEach(([key, img]) => {
                if (img.base64) {
                  allImages.push({
                    id: `img-${key}`,
                    base64: img.base64,
                    type: formatLabel(key),
                    mimeType: img.mimeType || 'image/png'
                  });
                }
              });
            }
            
            if (application.uploads) {
              Object.entries(application.uploads).forEach(([key, doc]) => {
                if (doc.base64 && doc.mimeType && doc.mimeType.startsWith('image/')) {
                  allImages.push({
                    id: `upload-${key}`,
                    base64: doc.base64,
                    type: formatLabel(key),
                    mimeType: doc.mimeType
                  });
                }
              });
            }
            
            if (allImages.length === 0) return null;
            
            return (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-1 h-6 bg-amber-600 rounded mr-3"></span>
                  🖼️ Application Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allImages.slice(0, 6).map((img) => (
                    <div key={img.id} className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
                      <div className="bg-gray-100 aspect-square overflow-hidden flex items-center justify-center">
                        <img
                          src={img.base64.startsWith('data:') ? img.base64 : `data:${img.mimeType};base64,${img.base64}`}
                          alt={img.type}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f3f4f6" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%239ca3af"%3EImage failed to load%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-3">{img.type}</p>
                        <button
                          onClick={() => {
                            const dataUrl = img.base64.startsWith('data:') ? img.base64 : `data:${img.mimeType};base64,${img.base64}`;
                            const link = document.createElement('a');
                            link.href = dataUrl;
                            link.download = `${img.type}-${Date.now()}`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="w-full px-3 py-2 bg-amber-600 text-white text-sm rounded hover:bg-amber-700 transition font-medium"
                        >
                          ⬇️ Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Documents & Images Section */}
          {(() => {
            const hasDocuments = application.uploads && Object.keys(application.uploads).length > 0;
            const hasImages = application.images && Object.keys(application.images).length > 0;
            
            if (!hasDocuments && !hasImages) return null;

            return (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-1 h-6 bg-green-600 rounded mr-3"></span>
                  📄 Documents & Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Display Documents */}
                  {application.uploads && Object.entries(application.uploads).map(([docType, doc]) => (
                    <div key={docType} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">{formatLabel(docType)}</p>
                      <p className="text-sm text-gray-700 mb-3">
                        📎 {doc.originalName || `${docType} Document`}
                      </p>
                      <div className="flex gap-2">
                        {doc.base64 && (
                          <button
                            onClick={() => {
                              const dataUrl = doc.base64.startsWith('data:') 
                                ? doc.base64 
                                : `data:${doc.mimeType || 'application/octet-stream'};base64,${doc.base64}`;
                              const link = document.createElement('a');
                              link.href = dataUrl;
                              link.download = doc.originalName || `${docType}-document`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="text-xs px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                          >
                            ⬇️ Download
                          </button>
                        )}
                        {doc.mimeType && doc.mimeType.startsWith('image/') && doc.base64 && (
                          <button
                            onClick={() => {
                              const dataUrl = doc.base64.startsWith('data:') 
                                ? doc.base64 
                                : `data:${doc.mimeType};base64,${doc.base64}`;
                              window.open(dataUrl, '_blank');
                            }}
                            className="text-xs px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                          >
                            👁️ View
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Display Images */}
                  {application.images && Object.entries(application.images).map(([imgType, img]) => (
                    <div key={imgType} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">{formatLabel(imgType)}</p>
                      {img.base64 && (
                        <div className="space-y-3">
                          <img 
                            src={img.base64.startsWith('data:') ? img.base64 : `data:${img.mimeType || 'image/png'};base64,${img.base64}`}
                            alt={imgType}
                            className="w-full h-auto rounded border border-gray-200 max-h-80 object-contain bg-white"
                            onError={(e) => {
                              console.error(`Failed to load image ${imgType}:`, e);
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%239ca3af"%3EImage failed to load%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <button
                            onClick={() => {
                              const dataUrl = img.base64.startsWith('data:') 
                                ? img.base64 
                                : `data:${img.mimeType || 'image/png'};base64,${img.base64}`;
                              const link = document.createElement('a');
                              link.href = dataUrl;
                              link.download = `${imgType}-image`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="text-xs px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
                          >
                            ⬇️ Download Image
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Display body.img if exists */}
                  {application.body && application.body.img && (
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Application Photo</p>
                      <div className="space-y-3">
                        <img 
                          src={application.body.img.startsWith('data:') ? application.body.img : `data:image/png;base64,${application.body.img}`}
                          alt="Application photo"
                          className="w-full h-auto rounded border border-gray-200 max-h-80 object-contain bg-white"
                          onError={(e) => {
                            console.error('Failed to load body image:', e);
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%239ca3af"%3EImage failed to load%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <button
                          onClick={() => {
                            const dataUrl = application.body.img.startsWith('data:') 
                              ? application.body.img 
                              : `data:image/png;base64,${application.body.img}`;
                            const link = document.createElement('a');
                            link.href = dataUrl;
                            link.download = 'application-photo';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="text-xs px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
                        >
                          ⬇️ Download Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      
      </div>
    </div>
  );
}

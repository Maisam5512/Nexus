// import React from 'react';
// import { FileText, Upload, Download, Trash2, Share2 } from 'lucide-react';
// import { Card, CardHeader, CardBody } from '../../components/ui/Card';
// import { Button } from '../../components/ui/Button';
// import { Badge } from '../../components/ui/Badge';

// const documents = [
//   {
//     id: 1,
//     name: 'Pitch Deck 2024.pdf',
//     type: 'PDF',
//     size: '2.4 MB',
//     lastModified: '2024-02-15',
//     shared: true
//   },
//   {
//     id: 2,
//     name: 'Financial Projections.xlsx',
//     type: 'Spreadsheet',
//     size: '1.8 MB',
//     lastModified: '2024-02-10',
//     shared: false
//   },
//   {
//     id: 3,
//     name: 'Business Plan.docx',
//     type: 'Document',
//     size: '3.2 MB',
//     lastModified: '2024-02-05',
//     shared: true
//   },
//   {
//     id: 4,
//     name: 'Market Research.pdf',
//     type: 'PDF',
//     size: '5.1 MB',
//     lastModified: '2024-01-28',
//     shared: false
//   }
// ];

// export const DocumentsPage: React.FC = () => {
//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
//           <p className="text-gray-600">Manage your startup's important files</p>
//         </div>
        
//         <Button leftIcon={<Upload size={18} />}>
//           Upload Document
//         </Button>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Storage info */}
//         <Card className="lg:col-span-1">
//           <CardHeader>
//             <h2 className="text-lg font-medium text-gray-900">Storage</h2>
//           </CardHeader>
//           <CardBody className="space-y-4">
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Used</span>
//                 <span className="font-medium text-gray-900">12.5 GB</span>
//               </div>
//               <div className="h-2 bg-gray-200 rounded-full">
//                 <div className="h-2 bg-primary-600 rounded-full" style={{ width: '65%' }}></div>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Available</span>
//                 <span className="font-medium text-gray-900">7.5 GB</span>
//               </div>
//             </div>
            
//             <div className="pt-4 border-t border-gray-200">
//               <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Access</h3>
//               <div className="space-y-2">
//                 <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
//                   Recent Files
//                 </button>
//                 <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
//                   Shared with Me
//                 </button>
//                 <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
//                   Starred
//                 </button>
//                 <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
//                   Trash
//                 </button>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
        
//         {/* Document list */}
//         <div className="lg:col-span-3">
//           <Card>
//             <CardHeader className="flex justify-between items-center">
//               <h2 className="text-lg font-medium text-gray-900">All Documents</h2>
//               <div className="flex items-center gap-2">
//                 <Button variant="outline" size="sm">
//                   Sort by
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   Filter
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardBody>
//               <div className="space-y-2">
//                 {documents.map(doc => (
//                   <div
//                     key={doc.id}
//                     className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                   >
//                     <div className="p-2 bg-primary-50 rounded-lg mr-4">
//                       <FileText size={24} className="text-primary-600" />
//                     </div>
                    
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2">
//                         <h3 className="text-sm font-medium text-gray-900 truncate">
//                           {doc.name}
//                         </h3>
//                         {doc.shared && (
//                           <Badge variant="secondary" size="sm">Shared</Badge>
//                         )}
//                       </div>
                      
//                       <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
//                         <span>{doc.type}</span>
//                         <span>{doc.size}</span>
//                         <span>Modified {doc.lastModified}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-2 ml-4">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-2"
//                         aria-label="Download"
//                       >
//                         <Download size={18} />
//                       </Button>
                      
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-2"
//                         aria-label="Share"
//                       >
//                         <Share2 size={18} />
//                       </Button>
                      
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-2 text-error-600 hover:text-error-700"
//                         aria-label="Delete"
//                       >
//                         <Trash2 size={18} />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardBody>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };












// src/pages/DocumentsPage.tsx
import React, { useEffect, useState } from 'react';

type DocumentType = {
  _id: string;
  filename: string;
  currentVersion: number;
  versions: any[];
  createdAt: string;
};

export const DocumentsPage: React.FC = () => {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Use the same token key from AuthContext
  const TOKEN_STORAGE_KEY = "business_nexus_token";
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    if (!token) return; // avoid malformed header
    const res = await fetch(`${API_BASE}/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setDocuments(data.documents || []);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Choose a file');
    if (!token) return alert('You must be logged in');
    setLoading(true);

    const form = new FormData();
    form.append('document', file);

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    if (res.ok) {
      await fetchDocuments();
      setFile(null);
      (document.getElementById('file-input') as HTMLInputElement).value = '';
    } else {
      const err = await res.json();
      alert(err.message || 'Upload failed');
    }
    setLoading(false);
  };

  const handlePreview = (url: string) => {
    window.open(url, '_blank');
  };

  const handleAttachSignature = async (docId: string, versionNumber: number, file: File) => {
    if (!token) return alert('You must be logged in');
    const form = new FormData();
    form.append('signature', file);

    const res = await fetch(`${API_BASE}/documents/${docId}/version/${versionNumber}/signature`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    if (res.ok) {
      fetchDocuments();
    } else {
      const err = await res.json();
      alert(err.message || 'Failed to upload signature');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Documents</h1>

      <div className="mt-4 mb-6">
        <input id="file-input" type="file" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="ml-2 px-3 py-1 bg-blue-600 text-white rounded"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <div>
        {documents.map(doc => (
          <div key={doc._id} className="mb-4 border p-4 rounded">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{doc.filename}</div>
                <div className="text-sm text-gray-500">Versions: {doc.currentVersion}</div>
              </div>
              <div>
                <button
                  onClick={() => handlePreview(doc.versions[doc.versions.length - 1].url)}
                  className="mr-2"
                >
                  Preview latest
                </button>
              </div>
            </div>

            <div className="mt-2">
              {doc.versions.map(v => (
                <div key={v.versionNumber} className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm">{v.filename} (v{v.versionNumber})</div>
                    <div className="text-xs text-gray-500">
                      {new Date(v.uploadedAt).toLocaleString()}
                    </div>
                    {v.signatureUrl && (
                      <div className="text-xs text-green-600">
                        Signed —{' '}
                        <a href={v.signatureUrl} target="_blank" rel="noreferrer">
                          view signature
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePreview(v.url)}
                      className="px-2 py-1 border rounded"
                    >
                      Open
                    </button>

                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            handleAttachSignature(doc._id, v.versionNumber, e.target.files[0]);
                          }
                        }}
                      />
                      <span className="px-2 py-1 border rounded text-sm">Attach Signature</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


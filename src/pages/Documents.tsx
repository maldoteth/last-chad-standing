
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, FileText, Download, ExternalLink } from 'lucide-react';
import DocumentSearch from '../components/DocumentSearch';

interface Document {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  externalUrl?: string;
}

const documents: Document[] = [
  {
    id: 1,
    title: 'Sample Document 1',
    description: 'This is a sample document for testing purposes.',
    fileUrl: '/sample-document.pdf',
  },
  {
    id: 2,
    title: 'Another Sample Document',
    description: 'A different document to showcase various features.',
    fileUrl: '/another-document.pdf',
  },
  {
    id: 3,
    title: 'External Resource Example',
    description: 'This document links to an external resource.',
    fileUrl: '/resource-document.pdf',
    externalUrl: 'https://example.com/resource',
  },
];

const Documents: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 relative">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </div>
            
            {/* Logo in the middle - visible on all screen sizes */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img 
                src="/lovable-uploads/745baeae-f05a-4a2a-828f-45aed6d05972.png" 
                alt="Last Chad Standing Logo" 
                className="h-8 w-auto opacity-90"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Component */}
      <DocumentSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <ul className="divide-y divide-gray-200">
            {documents.map(document => (
              <li key={document.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold text-gray-800">{document.title}</p>
                    <p className="text-gray-600">{document.description}</p>
                  </div>
                  <div className="flex space-x-4">
                    <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>View</span>
                    </a>
                    <a href={document.fileUrl} download className="text-green-600 hover:text-green-800 flex items-center space-x-2">
                      <Download className="h-5 w-5" />
                      <span>Download</span>
                    </a>
                    {document.externalUrl && (
                      <a href={document.externalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center space-x-2">
                        <ExternalLink className="h-5 w-5" />
                        <span>External Link</span>
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Documents;

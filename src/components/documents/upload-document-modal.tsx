import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { Button } from '../ui/button';
import { DocumentForm } from './document-form';
import { uploadDocument } from '../../services/documents';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const documentFields = [
  {
    label: 'Document Title',
    type: 'text' as const,
    name: 'title',
    required: true
  },
  {
    label: 'Document Type',
    type: 'select' as const,
    name: 'type',
    required: true,
    options: [
      { value: 'contract', label: 'Contract' },
      { value: 'agreement', label: 'Agreement' },
      { value: 'policy', label: 'Policy' },
      { value: 'form', label: 'Form' }
    ]
  },
  {
    label: 'Due Date',
    type: 'date' as const,
    name: 'dueDate',
    required: true
  },
  {
    label: 'Description',
    type: 'textarea' as const,
    name: 'description',
    required: true
  },
  {
    label: 'Additional Notes',
    type: 'textarea' as const,
    name: 'notes'
  }
];

export const UploadDocumentModal = ({ isOpen, onClose, onSuccess }: UploadDocumentModalProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setIsUploading(true);
      setError(null);
      await uploadDocument(data);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">Upload New Document</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-md bg-red-50 p-4"
                >
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              <DocumentForm
                fields={documentFields}
                onSubmit={handleSubmit}
                isSubmitting={isUploading}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
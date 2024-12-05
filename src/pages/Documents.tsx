import { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDocuments } from '../hooks/useDocuments';
import { DocumentCard } from '../components/documents/document-card';
import { UploadDocumentModal } from '../components/documents/upload-document-modal';
import { Button } from '../components/ui/button';
import { PageHeader } from '../components/ui/page-header';
import { LoadingSpinner } from '../components/ui/loading-spinner';

const Documents = () => {
  const { documents, loading, error, refetch } = useDocuments();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleViewDocument = (id: string) => {
    setSelectedId(id);
    // Implement document viewing logic here
  };

  const handleUploadSuccess = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Documents">
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Document
        </Button>
      </PageHeader>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-4"
      >
        <AnimatePresence>
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onView={handleViewDocument}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {documents.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by uploading a new document.
          </p>
          <div className="mt-6">
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload Document
            </Button>
          </div>
        </motion.div>
      )}

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Documents;
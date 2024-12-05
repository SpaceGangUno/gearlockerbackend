import { useState, useEffect, useCallback } from 'react';
import { Document, getDocuments } from '../services/documents';
import { useAuthStore } from '../stores/authStore';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isOffline } = useAuthStore();

  const fetchDocuments = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch documents');
      if (isOffline) {
        // Use cached data if available
        const cachedDocs = documents.length > 0 ? documents : [];
        setDocuments(cachedDocs);
      }
    } finally {
      setLoading(false);
    }
  }, [user, isOffline, documents]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const pendingDocuments = documents.filter(doc => doc.status === 'PENDING');

  return {
    documents,
    pendingDocuments,
    loading,
    error,
    refetch: fetchDocuments
  };
};
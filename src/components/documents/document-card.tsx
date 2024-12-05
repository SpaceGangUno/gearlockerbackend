import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn';

interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    status: string;
    createdAt: Date;
    signedAt?: Date;
  };
  onView: (id: string) => void;
}

export const DocumentCard = ({ document, onView }: DocumentCardProps) => {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'SIGNED':
        return {
          icon: CheckCircle,
          variant: 'success' as const,
          text: 'Signed'
        };
      case 'REJECTED':
        return {
          icon: XCircle,
          variant: 'error' as const,
          text: 'Rejected'
        };
      default:
        return {
          icon: Clock,
          variant: 'warning' as const,
          text: 'Pending'
        };
    }
  };

  const status = getStatusDetails(document.status);
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="rounded-md bg-indigo-100 p-2">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{document.title}</h3>
              <div className="mt-1 flex items-center space-x-2">
                <Badge variant={status.variant}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.text}
                </Badge>
                <span className="text-sm text-gray-500">
                  Created {format(new Date(document.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView(document.id)}
          >
            View
          </Button>
        </div>
        {document.signedAt && (
          <div className="mt-4 text-sm text-gray-500">
            Signed on {format(new Date(document.signedAt), 'MMMM d, yyyy')}
          </div>
        )}
      </div>
    </motion.div>
  );
};
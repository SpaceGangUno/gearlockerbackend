import { FileText, DollarSign, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDocuments } from '../hooks/useDocuments';
import { useSales } from '../hooks/useSales';
import { StatCard } from '../components/ui/stat-card';
import { PageHeader } from '../components/ui/page-header';
import { LoadingSpinner } from '../components/ui/loading-spinner';

const Dashboard = () => {
  const { pendingDocuments, loading: documentsLoading } = useDocuments();
  const { todaySales, loading: salesLoading } = useSales();

  if (documentsLoading || salesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" />
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <StatCard
          title="Pending Documents"
          value={pendingDocuments?.length || 0}
          icon={FileText}
          description="Documents awaiting your signature"
          link="/documents"
        />
        
        <StatCard
          title="Today's Sales"
          value={`$${todaySales?.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          description="Total sales for today"
          link="/sales"
        />
        
        <StatCard
          title="Upcoming Shifts"
          value="View Schedule"
          icon={Calendar}
          description="Check your upcoming work schedule"
          link="/schedule"
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* Additional dashboard widgets can be added here */}
      </motion.div>
    </div>
  );
};

export default Dashboard;
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useSales } from '../hooks/useSales';
import { StatCard } from '../components/ui/stat-card';
import { Button } from '../components/ui/button';
import { PageHeader } from '../components/ui/page-header';
import { DataTable } from '../components/ui/data-table';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { cn } from '../utils/cn';

const dateRanges = [
  { label: 'Today', value: 'day' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
] as const;

const Sales = () => {
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month'>('day');
  const { sales, totalSales, loading, error } = useSales(dateRange);

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

  const columns = [
    {
      header: 'Date',
      accessor: 'date' as const,
      cell: (row) => format(new Date(row.date), 'MMM d, yyyy'),
    },
    {
      header: 'Amount',
      accessor: 'amount' as const,
      cell: (row) => (
        <div className="font-medium">
          ${row.amount.toFixed(2)}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Sales Performance">
        <div className="flex space-x-2">
          {dateRanges.map((range) => (
            <Button
              key={range.value}
              variant={dateRange === range.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setDateRange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </PageHeader>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <StatCard
          title={`${dateRange === 'day' ? "Today's" : 'Total'} Sales`}
          value={`$${totalSales?.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          description={`Total sales for ${dateRange === 'day' ? 'today' : `this ${dateRange}`}`}
        />

        <StatCard
          title="Average Sale"
          value={`$${sales.length ? (totalSales / sales.length).toFixed(2) : '0.00'}`}
          icon={TrendingUp}
          description={`Average sale amount for this ${dateRange}`}
        />

        <StatCard
          title="Number of Sales"
          value={sales.length}
          icon={Calendar}
          description={`Total number of sales this ${dateRange}`}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <DataTable
          columns={columns}
          data={sales}
          className={cn(
            'mt-6',
            sales.length === 0 && 'hidden'
          )}
        />

        {sales.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sales data</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no sales recorded for this period.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Sales;
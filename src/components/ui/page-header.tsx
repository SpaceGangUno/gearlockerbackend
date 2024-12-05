import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({ title, children, className }: PageHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex justify-between items-center mb-6', className)}
    >
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {children}
    </motion.div>
  );
};
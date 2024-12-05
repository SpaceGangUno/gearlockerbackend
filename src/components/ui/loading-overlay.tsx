import { motion } from 'framer-motion';
import { LoadingSpinner } from './loading-spinner';

export const LoadingOverlay = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-lg p-6 shadow-xl"
      >
        <LoadingSpinner size="lg" className="text-indigo-600" />
        <p className="mt-4 text-gray-600 text-center">Loading...</p>
      </motion.div>
    </motion.div>
  );
};
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const OfflineBanner = () => {
  const { isOffline } = useAuthStore();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-yellow-50 border-b border-yellow-100"
        >
          <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap">
              <div className="flex-1 flex items-center">
                <WifiOff className="h-5 w-5 text-yellow-600" />
                <p className="ml-3 font-medium text-yellow-700 truncate">
                  <span>You're currently offline. Some features may be limited.</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
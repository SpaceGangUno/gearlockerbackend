import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '../../utils/cn';

export const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div
            className={cn(
              'flex items-center px-4 py-2 rounded-b-lg shadow-lg text-sm font-medium',
              isOnline ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            )}
          >
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                Back online
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 mr-2" />
                Working offline
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
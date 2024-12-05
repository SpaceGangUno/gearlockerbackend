import { NavLink } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  DollarSign,
  LayoutDashboard,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../utils/cn';

const Sidebar = () => {
  const { userRole } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Documents', to: '/documents', icon: FileText },
    { name: 'Schedule', to: '/schedule', icon: Calendar },
    { name: 'Sales', to: '/sales', icon: DollarSign },
    ...(userRole?.isAdmin ? [{ name: 'Users', to: '/users', icon: Users }] : []),
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)] sticky top-16"
    >
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-150',
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )
                }
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-150',
                    'group-hover:text-indigo-600'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            </motion.div>
          ))}
        </div>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
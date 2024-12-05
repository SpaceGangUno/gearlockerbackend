import { useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { UserCircle, LogOut, Menu as MenuIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-gray-900 flex items-center"
            >
              <MenuIcon className="h-6 w-6 mr-2 text-indigo-600" />
              GearLocker
            </motion.span>
          </div>
          
          <div className="flex items-center">
            {user && (
              <Menu as="div" className="relative ml-3">
                <Menu.Button className="flex items-center hover:opacity-80 transition-opacity">
                  <UserCircle className="h-8 w-8 text-indigo-600" />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full px-4 py-2 text-sm text-gray-700 items-center transition-colors duration-150`}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users as UsersIcon, UserPlus, Search } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { UserForm } from '../../components/users/user-form';
import { UserList } from '../../components/users/user-list';
import { Button } from '../../components/ui/button';
import { PageHeader } from '../../components/ui/page-header';
import { LoadingSpinner } from '../../components/ui/loading-spinner';

const Users = () => {
  const { users, loading, error, updateUserRole, addUser, refetch } = useUsers();
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpdateRole = useCallback(async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      refetch();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  }, [updateUserRole, refetch]);

  const handleAddUser = useCallback(async (userData: any) => {
    try {
      await addUser(userData);
      setShowAddUser(false);
      refetch();
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }, [addUser, refetch]);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="space-y-6">
      <PageHeader title="Users">
        <Button
          leftIcon={<UserPlus className="h-4 w-4" />}
          onClick={() => setShowAddUser(true)}
        >
          Add User
        </Button>
      </PageHeader>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <UserList
          users={filteredUsers}
          onUpdateRole={handleUpdateRole}
        />
      </motion.div>

      <AnimatePresence>
        {showAddUser && (
          <UserForm
            onSubmit={handleAddUser}
            onClose={() => setShowAddUser(false)}
          />
        )}
      </AnimatePresence>

      {users.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new user.
          </p>
          <div className="mt-6">
            <Button
              leftIcon={<UserPlus className="h-4 w-4" />}
              onClick={() => setShowAddUser(true)}
            >
              Add User
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Users;
import React, { useContext } from 'react';
import { AuthContext } from '../../App';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-gray-600 hover:text-gray-800"
    >
      <ApperIcon name="LogOut" size={16} />
      <span className="ml-1 hidden sm:inline">Logout</span>
    </Button>
  );
};

export default LogoutButton;
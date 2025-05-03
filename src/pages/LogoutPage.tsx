
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { useToast } from '@/components/ui/use-toast';

const LogoutPage = () => {
  const { toast } = useToast();

  useEffect(() => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  }, []);

  return <Navigate to="/" replace />;
};

export default LogoutPage;

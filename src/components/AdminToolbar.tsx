
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SearchBar from './SearchBar';

interface AdminToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddNew: () => void;
}

const AdminToolbar: React.FC<AdminToolbarProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  onAddNew 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative w-full max-w-sm">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          placeholder="Search companies..."
        />
      </div>
      <Button onClick={onAddNew} className="flex items-center gap-2">
        <Plus size={16} />
        <span>Add New Company</span>
      </Button>
    </div>
  );
};

export default AdminToolbar;

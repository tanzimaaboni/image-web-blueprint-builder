
import React, { useState, useEffect } from 'react';
import { Company } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CompanyFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (company: Omit<Company, 'id'> & { id?: string }) => void;
  initialData?: Company;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [company, setCompany] = useState<Omit<Company, 'id'> & { id?: string }>({
    name: '',
    sector: '',
    headquarters: '',
    founded: '',
    logo: '',
    description: '',
  });
  
  useEffect(() => {
    if (initialData) {
      setCompany(initialData);
    } else {
      // Reset form when opened without initial data
      setCompany({
        name: '',
        sector: '',
        headquarters: '',
        founded: '',
        logo: '',
        description: '',
      });
    }
  }, [initialData, open]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(company);
  };
  
  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Company' : 'Add New Company'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Company Name *
              </label>
              <Input
                id="name"
                name="name"
                value={company.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="sector" className="block text-sm font-medium mb-1">
                Sector *
              </label>
              <Input
                id="sector"
                name="sector"
                value={company.sector}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="headquarters" className="block text-sm font-medium mb-1">
                Headquarters *
              </label>
              <Input
                id="headquarters"
                name="headquarters"
                value={company.headquarters}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="founded" className="block text-sm font-medium mb-1">
                Founded *
              </label>
              <Input
                id="founded"
                name="founded"
                value={company.founded}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="logo" className="block text-sm font-medium mb-1">
                Logo URL
              </label>
              <Input
                id="logo"
                name="logo"
                value={company.logo || ''}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={company.description || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Add'} Company
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyForm;

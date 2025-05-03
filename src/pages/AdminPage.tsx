
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CompanyCard from '../components/CompanyCard';
import CompanyForm from '../components/CompanyForm';
import { getCompanies, addCompany, updateCompany, deleteCompany } from '../services/companyService';
import { isAuthenticated } from '../services/authService';
import { Company } from '../types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const data = await getCompanies();
        setCompanies(data);
        setFilteredCompanies(data);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        toast({
          title: 'Error',
          description: 'Failed to load companies data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    // Filter companies based on search query
    if (searchQuery.trim() === '') {
      setFilteredCompanies(companies);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = companies.filter(
        company => 
          company.name.toLowerCase().includes(query) || 
          company.sector.toLowerCase().includes(query)
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companies]);

  const handleAddClick = () => {
    setSelectedCompany(null);
    setFormOpen(true);
  };

  const handleEditClick = (company: Company) => {
    setSelectedCompany(company);
    setFormOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      setLoading(true);
      try {
        await deleteCompany(id);
        setCompanies(companies.filter(company => company.id !== id));
        toast({
          title: 'Success',
          description: 'Company deleted successfully',
        });
      } catch (error) {
        console.error('Delete failed:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete company',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFormSubmit = async (companyData: Omit<Company, 'id'> & { id?: string }) => {
    setLoading(true);
    try {
      if (companyData.id) {
        // Update existing company
        const updated = await updateCompany(companyData.id, companyData);
        setCompanies(companies.map(c => (c.id === updated.id ? updated : c)));
        toast({
          title: 'Success',
          description: 'Company updated successfully',
        });
      } else {
        // Add new company
        const newCompany = await addCompany(companyData);
        setCompanies([...companies, newCompany]);
        toast({
          title: 'Success',
          description: 'Company added successfully',
        });
      }
      setFormOpen(false);
    } catch (error) {
      console.error('Form submission failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to save company data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <Input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleAddClick} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add New Company</span>
          </Button>
        </div>

        {loading && !formOpen ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard 
                key={company.id} 
                company={company} 
                isAdmin={true}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No companies found.</p>
          </div>
        )}
      </div>

      <CompanyForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
        onSubmit={handleFormSubmit}
        initialData={selectedCompany || undefined}
      />
    </Layout>
  );
};

export default AdminPage;

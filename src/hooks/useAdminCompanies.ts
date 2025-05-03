
import { useState, useEffect } from 'react';
import { Company, PaginatedResponse } from '../types';
import { 
  getPaginatedCompanies, 
  searchPaginatedCompanies,
  addCompany, 
  updateCompany, 
  deleteCompany,
} from '../services/companyService';
import { useToast } from '@/components/ui/use-toast';

export const COMPANIES_PER_PAGE = 9; // Show 9 companies per page in admin panel

export function useAdminCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const { toast } = useToast();

  const fetchPaginatedCompanies = async (page: number, query: string = '') => {
    setLoading(true);
    try {
      let response: PaginatedResponse<Company>;
      
      if (query.trim()) {
        response = await searchPaginatedCompanies(query, { page, limit: COMPANIES_PER_PAGE });
      } else {
        response = await getPaginatedCompanies({ page, limit: COMPANIES_PER_PAGE });
      }
      
      setCompanies(response.data);
      setTotalPages(response.totalPages);
      setTotalCompanies(response.total);
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

  useEffect(() => {
    fetchPaginatedCompanies(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleSearch = async () => {
      setCurrentPage(1);
      await fetchPaginatedCompanies(1, searchQuery);
    };

    const debounce = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

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
        await fetchPaginatedCompanies(
          companies.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage,
          searchQuery
        );
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
        await updateCompany(companyData.id, companyData);
        await fetchPaginatedCompanies(currentPage, searchQuery);
        toast({
          title: 'Success',
          description: 'Company updated successfully',
        });
      } else {
        // Add new company
        await addCompany(companyData);
        await fetchPaginatedCompanies(1, searchQuery);
        setCurrentPage(1); // Go to first page after adding
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    companies,
    loading,
    searchQuery,
    setSearchQuery,
    currentPage,
    totalPages,
    totalCompanies,
    formOpen,
    setFormOpen,
    selectedCompany,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleFormSubmit,
    handlePageChange
  };
}

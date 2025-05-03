
import { useState, useEffect } from 'react';
import { Company, PaginatedResponse } from '../types';
import { getPaginatedCompanies, searchPaginatedCompanies } from '../services/companyService';
import { useToast } from '@/components/ui/use-toast';

export const COMPANIES_PER_PAGE = 6; // Show 6 companies per page

export function useCompanySearch() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
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
    handlePageChange
  };
}

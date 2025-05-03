
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CompanyCard from '../components/CompanyCard';
import CompanyForm from '../components/CompanyForm';
import { 
  getCompanies, 
  getPaginatedCompanies, 
  addCompany, 
  updateCompany, 
  deleteCompany,
  searchPaginatedCompanies
} from '../services/companyService';
import { isAuthenticated } from '../services/authService';
import { Company, PaginatedResponse } from '../types';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const COMPANIES_PER_PAGE = 9; // Show 9 companies per page in admin panel

const AdminPage: React.FC = () => {
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
        const updated = await updateCompany(companyData.id, companyData);
        await fetchPaginatedCompanies(currentPage, searchQuery);
        toast({
          title: 'Success',
          description: 'Company updated successfully',
        });
      } else {
        // Add new company
        const newCompany = await addCompany(companyData);
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

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>
          )}
          
          {[...Array(Math.min(totalPages, 5))].map((_, i) => {
            let pageNumber: number;
            
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (currentPage <= 3) {
              pageNumber = i + 1;
              if (i === 4) return (
                <PaginationItem key={i}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
              if (i === 0) return (
                <PaginationItem key={i}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            } else {
              if (i === 0) {
                return (
                  <PaginationItem key={i}>
                    <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
                  </PaginationItem>
                );
              } else if (i === 1) {
                return (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              } else if (i === 3) {
                return (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              } else if (i === 4) {
                return (
                  <PaginationItem key={i}>
                    <PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
                  </PaginationItem>
                );
              }
              pageNumber = currentPage + (i - 2);
            }
            
            return (
              <PaginationItem key={i}>
                <PaginationLink 
                  isActive={pageNumber === currentPage} 
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
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

        {/* Result summary */}
        {!loading && totalCompanies > 0 && (
          <div className="text-sm text-gray-600">
            Showing {companies.length} of {totalCompanies} companies
          </div>
        )}

        {loading && !formOpen ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
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

        {/* Pagination */}
        {renderPagination()}
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

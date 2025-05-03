
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CompanyCard from '../components/CompanyCard';
import { getCompanies, getPaginatedCompanies, searchCompanies, searchPaginatedCompanies } from '../services/companyService';
import { Company, PaginatedResponse } from '../types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const COMPANIES_PER_PAGE = 6; // Show 6 companies per page

const HomePage: React.FC = () => {
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

  return (
    <Layout title="Top Bangladeshi Companies">
      <div className="max-w-4xl mx-auto">
        {/* Search */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <Input
            type="text"
            placeholder="Search by company name or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Result summary */}
        {!loading && totalCompanies > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {companies.length} of {totalCompanies} companies
          </div>
        )}

        {/* Companies list */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
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
    </Layout>
  );
};

export default HomePage;

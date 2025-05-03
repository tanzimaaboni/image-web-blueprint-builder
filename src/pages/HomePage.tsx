
import React from 'react';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import CompanyList from '../components/CompanyList';
import PaginationControls from '../components/PaginationControls';
import { useCompanySearch } from '../hooks/useCompanySearch';

const HomePage: React.FC = () => {
  const {
    companies,
    loading,
    searchQuery,
    setSearchQuery,
    currentPage,
    totalPages,
    totalCompanies,
    handlePageChange
  } = useCompanySearch();

  return (
    <Layout title="Top Bangladeshi Companies">
      <div className="max-w-4xl mx-auto">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <CompanyList 
          companies={companies} 
          loading={loading} 
          totalCompanies={totalCompanies} 
        />
        
        <PaginationControls 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      </div>
    </Layout>
  );
};

export default HomePage;

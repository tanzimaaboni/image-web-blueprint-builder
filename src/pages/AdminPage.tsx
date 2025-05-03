
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CompanyGrid from '../components/CompanyGrid';
import CompanyForm from '../components/CompanyForm';
import AdminToolbar from '../components/AdminToolbar';
import PaginationRenderer from '../components/PaginationRenderer';
import { isAuthenticated } from '../services/authService';
import { useAdminCompanies } from '../hooks/useAdminCompanies';

const AdminPage: React.FC = () => {
  const {
    companies,
    loading,
    searchQuery,
    setSearchQuery,
    currentPage,
    totalPages,
    totalCompanies,
    formOpen,
    selectedCompany,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleFormSubmit,
    handlePageChange,
    setFormOpen
  } = useAdminCompanies();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        <AdminToolbar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onAddNew={handleAddClick} 
        />

        <CompanyGrid 
          companies={companies}
          loading={loading}
          totalCompanies={totalCompanies}
          isAdmin={true}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        <PaginationRenderer
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
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


import React from 'react';
import { Company } from '../types';
import CompanyCard from './CompanyCard';

interface CompanyGridProps {
  companies: Company[];
  loading: boolean;
  totalCompanies: number;
  isAdmin?: boolean;
  onEdit?: (company: Company) => void;
  onDelete?: (id: string) => void;
}

const CompanyGrid: React.FC<CompanyGridProps> = ({ 
  companies, 
  loading, 
  totalCompanies, 
  isAdmin = false,
  onEdit,
  onDelete
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No companies found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Result summary */}
      {totalCompanies > 0 && (
        <div className="text-sm text-gray-600 mb-6">
          Showing {companies.length} of {totalCompanies} companies
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard 
            key={company.id} 
            company={company} 
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

export default CompanyGrid;

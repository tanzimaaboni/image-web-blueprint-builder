
import React from 'react';
import CompanyCard from './CompanyCard';
import { Company } from '../types';

interface CompanyListProps {
  companies: Company[];
  loading: boolean;
  totalCompanies: number;
}

const CompanyList: React.FC<CompanyListProps> = ({ 
  companies, 
  loading, 
  totalCompanies 
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
        <div className="mb-4 text-sm text-gray-600">
          Showing {companies.length} of {totalCompanies} companies
        </div>
      )}

      {/* Companies grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </>
  );
};

export default CompanyList;

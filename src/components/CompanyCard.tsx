
import React from 'react';
import { Company } from '../types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface CompanyCardProps {
  company: Company;
  isAdmin?: boolean;
  onEdit?: (company: Company) => void;
  onDelete?: (id: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, isAdmin = false, onEdit, onDelete }) => {
  return (
    <Card className="h-full">
      <CardHeader className="p-4 pb-0 flex flex-col items-center">
        {company.logo ? (
          <div className="h-16 w-16 flex items-center justify-center mb-2">
            <img 
              src={company.logo} 
              alt={`${company.name} logo`} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl font-bold text-gray-500">
              {company.name.charAt(0)}
            </span>
          </div>
        )}
        <h3 className="font-bold text-xl text-center">{company.name}</h3>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Sector:</span> {company.sector}
          </div>
          <div>
            <span className="font-semibold">Headquarters:</span> {company.headquarters}
          </div>
          <div>
            <span className="font-semibold">Founded:</span> {company.founded}
          </div>
          {company.description && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">{company.description}</p>
            </div>
          )}
          
          {isAdmin && (
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={() => onEdit?.(company)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete?.(company.id)}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;

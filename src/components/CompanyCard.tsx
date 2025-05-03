
import React from 'react';
import { Company } from '../types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { downloadImage } from '../utils/logoFetcher';
import { toast } from 'sonner';

interface CompanyCardProps {
  company: Company;
  isAdmin?: boolean;
  onEdit?: (company: Company) => void;
  onDelete?: (id: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, isAdmin = false, onEdit, onDelete }) => {
  const handleDownloadLogo = async () => {
    if (company.logo) {
      await downloadImage(company.logo, company.name);
    } else {
      toast.error("No logo available to download");
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-4 pb-0 flex flex-col items-center">
        {company.logo ? (
          <div className="h-16 w-16 flex items-center justify-center mb-2 relative group">
            <img 
              src={company.logo} 
              alt={`${company.name} logo`} 
              className="max-h-full max-w-full object-contain"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white" 
                onClick={handleDownloadLogo}
                title="Download logo"
              >
                <Download className="h-4 w-4 text-slate-800" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 relative group">
            <span className="text-2xl font-bold text-gray-500">
              {company.name.charAt(0)}
            </span>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 rounded-full">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white" 
                onClick={handleDownloadLogo}
                title="Download logo"
              >
                <Download className="h-4 w-4 text-slate-800" />
              </Button>
            </div>
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
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleDownloadLogo}
              >
                <Download className="h-4 w-4" />
                <span>Logo</span>
              </Button>
              <Button 
                variant="default"
                size="sm"
                onClick={() => onEdit?.(company)}
              >
                Edit
              </Button>
              <Button 
                variant="destructive"
                size="sm"
                onClick={() => onDelete?.(company.id)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;

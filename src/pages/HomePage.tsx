
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CompanyCard from '../components/CompanyCard';
import { getCompanies, searchCompanies } from '../services/companyService';
import { Company } from '../types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const HomePage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const data = await getCompanies();
        setCompanies(data);
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

    fetchCompanies();
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        const data = await getCompanies();
        setCompanies(data);
        return;
      }

      setLoading(true);
      try {
        const results = await searchCompanies(searchQuery);
        setCompanies(results);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

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
      </div>
    </Layout>
  );
};

export default HomePage;


import { Company, PaginatedResponse, PaginationParams } from '../types';
import { sampleCompanies } from '../data/companies';

// In a real application, these would be API calls to your backend

// Simulating an AJAX call with a Promise
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let companies = [...sampleCompanies];

export const getCompanies = async (): Promise<Company[]> => {
  await delay(500); // Simulate network delay
  return [...companies];
};

export const getPaginatedCompanies = async (
  params: PaginationParams
): Promise<PaginatedResponse<Company>> => {
  await delay(500); // Simulate network delay
  
  const { page, limit } = params;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedData = companies.slice(startIndex, endIndex);
  const total = companies.length;
  const totalPages = Math.ceil(total / limit);
  
  return {
    data: paginatedData,
    total,
    page,
    limit,
    totalPages
  };
};

export const searchCompanies = async (query: string): Promise<Company[]> => {
  await delay(300);
  const lowerQuery = query.toLowerCase();
  return companies.filter(
    company => 
      company.name.toLowerCase().includes(lowerQuery) || 
      company.sector.toLowerCase().includes(lowerQuery)
  );
};

export const searchPaginatedCompanies = async (
  query: string,
  params: PaginationParams
): Promise<PaginatedResponse<Company>> => {
  await delay(300);
  
  const lowerQuery = query.toLowerCase();
  const filteredCompanies = companies.filter(
    company => 
      company.name.toLowerCase().includes(lowerQuery) || 
      company.sector.toLowerCase().includes(lowerQuery)
  );
  
  const { page, limit } = params;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedData = filteredCompanies.slice(startIndex, endIndex);
  const total = filteredCompanies.length;
  const totalPages = Math.ceil(total / limit);
  
  return {
    data: paginatedData,
    total,
    page,
    limit,
    totalPages
  };
};

export const addCompany = async (company: Omit<Company, 'id'>): Promise<Company> => {
  await delay(500);
  const newCompany = {
    ...company,
    id: Date.now().toString(),
  };
  
  companies = [...companies, newCompany];
  return newCompany;
};

export const updateCompany = async (id: string, updatedCompany: Partial<Company>): Promise<Company> => {
  await delay(500);
  const companyIndex = companies.findIndex(c => c.id === id);
  
  if (companyIndex === -1) {
    throw new Error('Company not found');
  }
  
  const updated = {
    ...companies[companyIndex],
    ...updatedCompany
  };
  
  companies = [
    ...companies.slice(0, companyIndex),
    updated,
    ...companies.slice(companyIndex + 1)
  ];
  
  return updated;
};

export const deleteCompany = async (id: string): Promise<void> => {
  await delay(500);
  companies = companies.filter(company => company.id !== id);
};

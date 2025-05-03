
export interface Company {
  id: string;
  name: string;
  sector: string;
  logo?: string;
  logoUrl?: string; // Added for storing the original URL
  headquarters: string;
  founded: string;
  description?: string;
}

export interface User {
  username: string;
  password: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

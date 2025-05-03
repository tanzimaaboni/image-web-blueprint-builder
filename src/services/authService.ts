
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export const login = (username: string, password: string): AuthResponse => {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // In a real app, you'd want to use a JWT library here
    const token = btoa(`${username}:${Date.now()}`);
    localStorage.setItem('token', token);
    localStorage.setItem('isAuthenticated', 'true');
    
    return {
      success: true,
      token
    };
  }
  
  return {
    success: false,
    message: 'Invalid username or password'
  };
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('isAuthenticated');
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

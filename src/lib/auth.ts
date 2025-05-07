import { jwtDecode } from 'jwt-decode';
import { User } from '@/types';

const TOKEN_KEY = 'crm_auth_token';

interface DecodedToken {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  exp: number;
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    clearToken();
    return false;
  }
}

export function getCurrentUser(): User | null {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
  } catch (error) {
    clearToken();
    return null;
  }
}

export function hasPermission(requiredRole: 'admin' | 'user'): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  // If the required role is 'user', both 'user' and 'admin' can access
  if (requiredRole === 'user') {
    return true;
  }
  
  // If the required role is 'admin', only 'admin' can access
  return user.role === 'admin';
}
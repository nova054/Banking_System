import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id?: number;
  fullName: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface Account {
  id?: number;
  accountNumber: string;
  type: string;
  balance: number;
  createdAt: string;
  // Admin-specific fields (may not be present in user responses)
  userId?: number;
  email?: string;
  status?: string;
  transactionCount?: number;
}

export interface Transaction {
  id: number;
  accountId: number;
  accountNumber?: string;
  referenceNumber: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER_DEBIT' | 'TRANSFER_CREDIT';
  amount: number;
  status: string;
  beforeBalance: number;
  afterBalance: number;
  description?: string;
  transferId?: string;
  createdAt: string;
}

export interface TransferResponse {
  fromAccountNumber: string;
  toAccountNumber: string;
  debitReferenceNumber: string;
  creditReferenceNumber: string;
  amount: number;
  remainingAmount: number;
  beforeAmount: number;
  status: string;
  description?: string;
  createdAt: string;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
}

// Audit Log Types
export interface AuditLogResponse {
  id: number;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: number;
  role: string;
  description: string;
  status: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface AuditFilterRequest {
  userEmail?: string;
  action?: string;
  entityType?: string;
  fromDate?: string;
  toDate?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface SystemOverviewResponse {
  totalUsers: number;
  activeUsers: number;
  totalAccounts: number;
  activeAccounts: number;
  todayTransactionCount: number;
  todayTransactionAmount: number;
}

// Auth Service
export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  async register(fullName: string, email: string, password: string, confirmPassword: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', { fullName, email, password, confirmPassword });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Account Service
export const accountService = {
  async getMyAccounts(): Promise<Account[]> {
    const response = await api.get('/api/account/user');
    return response.data;
  },

  async createAccount(type: string): Promise<Account> {
    const response = await api.post('/api/account', { type });
    return response.data;
  },

  async getAccountByNumber(accountNumber: string): Promise<Account> {
    const response = await api.get(`/api/account/number/${accountNumber}`);
    return response.data;
  },

  async getAccountById(accountId: number): Promise<Account> {
    const response = await api.get(`/api/admin/account/id/${accountId}`);
    return response.data;
  },

  async getAccountsByUserId(userId: number): Promise<Account[]> {
    const response = await api.get(`/api/admin/account/user-email?email=${userId}`);
    return response.data;
  },
};

// Transaction Service
export const transactionService = {
  async deposit(accountNumber: string, amount: number, description?: string): Promise<Transaction> {
    const response = await api.post('/api/transaction/deposit', {
      accountNumber,
      amount,
      description,
    });
    return response.data;
  },

  async withdraw(accountNumber: string, amount: number, description?: string): Promise<Transaction> {
    const response = await api.post('/api/transaction/withdraw', {
      accountNumber,
      amount,
      description,
    });
    return response.data;
  },

  async transfer(
    fromAccountNumber: string,
    toAccountNumber: string,
    amount: number,
    description?: string
  ): Promise<TransferResponse> {
    const response = await api.post('/api/transaction/transfer', {
      fromAccountNumber,
      toAccountNumber,
      amount,
      description,
    });
    return response.data;
  },

  async getStatement(
    accountNumber: string,
    fromDate?: string,
    toDate?: string,
    minAmount?: number,
    maxAmount?: number,
    page?: number,
    size?: number
  ): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    
    const response = await api.post(`/api/transaction/statement?${params.toString()}`, {
      accountNumber,
      fromDate,
      toDate,
      minAmount,
      maxAmount,
    });
    return response.data;
  },

  async getTransactionById(transactionId: number): Promise<Transaction> {
    const response = await api.get(`/api/admin/transaction/${transactionId}`);
    return response.data;
  },
};

// User Service
export const userService = {
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/api/user/getUserData');
    return response.data;
  },

  async getAllUsers(): Promise<PaginatedResponse<User>> {
    const response = await api.get('/api/admin/user');
    return response.data;
  },

  async getUserById(userId: number): Promise<User> {
    const response = await api.get(`/api/admin/user/${userId}`);
    return response.data;
  },

  async getUserByEmail(email: string): Promise<User> {
    const response = await api.get(`/api/admin/user/email?email=${email}`);
    return response.data;
  },

  async registerUser(fullName: string, email: string, password: string, confirmPassword: string): Promise<User> {
    const response = await api.post('/api/admin/user/register', {
      fullName,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },
};

// Audit Service
export const auditService = {
  async getAllAudits(page?: number, size?: number): Promise<PaginatedResponse<AuditLogResponse>> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    
    const response = await api.get(`/api/admin/audits?${params.toString()}`);
    return response.data;
  },

  async filterAudits(
    filters: AuditFilterRequest,
    page?: number,
    size?: number
  ): Promise<PaginatedResponse<AuditLogResponse>> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    
    const response = await api.post(`/api/admin/audits/filters?${params.toString()}`, filters);
    return response.data;
  },
};

// Admin Account Service
export const adminAccountService = {
  async getAccountById(accountId: number): Promise<Account> {
    const response = await api.get(`/api/admin/account/id/${accountId}`);
    return response.data;
  },

  async filterAccounts(filters: any, page?: number, size?: number): Promise<PaginatedResponse<Account>> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    
    const response = await api.post(`/api/admin/account/filter?${params.toString()}`, filters);
    return response.data;
  },

  async getAccountsByUserEmail(email: string): Promise<Account[]> {
    const response = await api.get(`/api/admin/account/user-email?email=${email}`);
    return response.data;
  },

  async createAccountByEmail(request: any, email: string): Promise<Account> {
    const response = await api.post(`/api/admin/account/createAccount?email=${email}`, request);
    return response.data;
  },

  async getAllAccounts(page?: number, size?: number): Promise<PaginatedResponse<Account>> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    
    const response = await api.get(`/api/admin/account?${params.toString()}`);
    return response.data;
  },

  async changeStatus(accountId: number, status: string): Promise<void> {
    const response = await api.post('/api/admin/account/change-status', {
      id: accountId,
      status: status
    });
    return response.data;
  },
};

// Admin Transaction Service
export const adminTransactionService = {
  async getAllTransactions(page?: number, size?: number): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    
    const response = await api.get(`/api/admin/transaction?${params.toString()}`);
    return response.data;
  },

  async filterTransactions(filters: any, page?: number, size?: number): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    
    const response = await api.post(`/api/admin/transaction/filter?${params.toString()}`, filters);
    return response.data;
  },

  async getTransactionById(transactionId: number): Promise<Transaction> {
    const response = await api.get(`/api/admin/transaction/${transactionId}`);
    return response.data;
  },
};

// Admin User Service
export const adminUserService = {
  async getAllUsers(page?: number, size?: number): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    
    const response = await api.get(`/api/admin/user?${params.toString()}`);
    return response.data;
  },

  async filterUsers(filters: any, page?: number, size?: number): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    
    const response = await api.post(`/api/admin/user/filter?${params.toString()}`, filters);
    return response.data;
  },

  async registerUser(request: any): Promise<User> {
    const response = await api.post('/api/admin/user/register', request);
    return response.data;
  },

  async enableUser(userId: number): Promise<void> {
    const response = await api.get(`/api/admin/user/enable/${userId}`);
    return response.data;
  },

  async disableUser(userId: number): Promise<void> {
    const response = await api.get(`/api/admin/user/disable/${userId}`);
    return response.data;
  },

  async resetPassword(request: any): Promise<void> {
    const response = await api.patch('/api/admin/user/resetPassword', request);
    return response.data;
  },

  async getUserByEmail(email: string): Promise<User> {
    const response = await api.get(`/api/admin/user/email?email=${email}`);
    return response.data;
  },

  async getUserById(userId: number): Promise<User> {
    const response = await api.get(`/api/admin/user/${userId}`);
    return response.data;
  },
};

// Admin Dashboard Service
export const adminDashboardService = {
  async getSystemOverview(): Promise<SystemOverviewResponse> {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },
};

export default api;

# Complete Frontend Development Prompt for Banking System API

## Project Overview
Build a modern, secure, and responsive banking system frontend application that connects to a Spring Boot REST API backend. The application must support two distinct user roles: **ADMIN** and **USER**, with completely different dashboards and functionalities.

---

## Backend API Base URL
```
Base URL: http://localhost:8081
```

---

## Authentication & Authorization

### Authentication Flow
1. **JWT Token-Based Authentication**: All protected endpoints require JWT token in Authorization header
2. **Token Format**: `Bearer <token>`
3. **Token Storage**: Store token in `localStorage` or `sessionStorage` after login
4. **Token Expiration**: Tokens expire after 1 hour (3600000ms)
5. **Role-Based Access**: 
   - `ROLE_USER`: Regular banking customers
   - `ROLE_ADMIN`: System administrators with full access

### Logout Implementation
- **CRITICAL**: Logout button must delete/remove the JWT token from storage (localStorage/sessionStorage)
- After logout, redirect to login page
- Clear all user data from application state

---

## API Endpoints - Complete Specification

### 1. Authentication Endpoints (`/api/auth`)

#### 1.1 Register (Public)
```
POST /api/auth/register
Content-Type: application/json
Authorization: NOT REQUIRED

Request Body:
{
  "fullName": "John Doe",           // Required, NotBlank
  "email": "john@example.com",      // Required, Valid Email, NotBlank
  "password": "password123"         // Required, NotBlank, Min 6 characters
}

Response (201 Created):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "fullName": "John Doe",
  "createdAt": "2025-01-18T10:30:00"
}

Error Responses:
- 400 Bad Request: Validation errors
  {
    "status": 400,
    "error": "VALIDATION_ERROR",
    "message": "email: Email should be valid!, password: Password must be atleast 6 characters",
    "timestamp": "2025-01-18T10:30:00"
  }
- 400 Bad Request: Email already exists
  {
    "status": 400,
    "error": "BAD_REQUEST",
    "message": "Email already registered: john@example.com",
    "timestamp": "2025-01-18T10:30:00"
  }
```

#### 1.2 Login (Public)
```
POST /api/auth/login
Content-Type: application/json
Authorization: NOT REQUIRED

Request Body:
{
  "email": "john@example.com",      // Required, Valid Email, NotBlank
  "password": "password123"         // Required, NotBlank
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "fullName": "John Doe",
  "createdAt": "2025-01-18T10:30:00"
}

Error Responses:
- 400 Bad Request: Invalid credentials
  {
    "status": 400,
    "error": "BAD_REQUEST",
    "message": "Invalid email or password",
    "timestamp": "2025-01-18T10:30:00"
  }
```

---

### 2. Account Endpoints (`/api/accounts`)

**All endpoints require**: `Authorization: Bearer <token>`

#### 2.1 Create Account (USER, ADMIN)
```
POST /api/accounts
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "type": "savings"                 // Required, NotBlank (options: "savings" or "current")
}

Response (201 Created):
{
  "accountNumber": "ACC-2025-000001",
  "type": "savings",
  "balance": 0.0,
  "createdAt": "2025-01-18T10:30:00"
}

Error Responses:
- 400 Bad Request: Validation error
- 401 Unauthorized: Invalid/expired token
- 403 Forbidden: Insufficient permissions
```

#### 2.2 Get My Accounts (USER, ADMIN)
```
GET /api/accounts/user
Authorization: Bearer <token>

Response (200 OK):
[
  {
    "accountNumber": "ACC-2025-000001",
    "type": "savings",
    "balance": 5000.0,
    "createdAt": "2025-01-18T10:30:00"
  },
  {
    "accountNumber": "ACC-2025-000002",
    "type": "current",
    "balance": 2500.0,
    "createdAt": "2025-01-18T11:00:00"
  }
]

Error Responses:
- 401 Unauthorized: Invalid/expired token
- 404 Not Found: No accounts found
  {
    "status": 404,
    "error": "NOT_FOUND",
    "message": "No accounts found for email: user@example.com",
    "timestamp": "2025-01-18T10:30:00"
  }
```

#### 2.3 Get Account by ID (ADMIN ONLY)
```
GET /api/accounts/id/{accountId}
Authorization: Bearer <token> (ADMIN role required)

Path Parameter:
- accountId: Long (e.g., 1, 2, 3)

Response (200 OK):
{
  "accountNumber": "ACC-2025-000001",
  "type": "savings",
  "balance": 5000.0,
  "createdAt": "2025-01-18T10:30:00"
}

Error Responses:
- 401 Unauthorized: Invalid/expired token
- 403 Forbidden: USER role cannot access
- 404 Not Found: Account not found
```

#### 2.4 Get Account by Account Number (USER, ADMIN)
```
GET /api/accounts/number/{accountNumber}
Authorization: Bearer <token>

Path Parameter:
- accountNumber: String (e.g., "ACC-2025-000001")

Response (200 OK):
{
  "accountNumber": "ACC-2025-000001",
  "type": "savings",
  "balance": 5000.0,
  "createdAt": "2025-01-18T10:30:00"
}

Error Responses:
- 401 Unauthorized: Invalid/expired token
- 403 Forbidden: User trying to access another user's account
  {
    "status": 403,
    "error": "ACCESS_DENIED",
    "message": "You are not allowed to access this account",
    "timestamp": "2025-01-18T10:30:00"
  }
- 404 Not Found: Account not found
```

#### 2.5 Get All Accounts by User ID (ADMIN ONLY)
```
GET /api/accounts/user/{userId}
Authorization: Bearer <token> (ADMIN role required)

Path Parameter:
- userId: Long (e.g., 1, 2, 3)

Response (200 OK):
[
  {
    "id": 1,
    "accountNumber": "ACC-2025-000001",
    "type": "savings",
    "balance": 5000.0,
    "createdAt": "2025-01-18T10:30:00",
    "user": { ... }  // Full Account entity with user details
  }
]

Error Responses:
- 401 Unauthorized: Invalid/expired token
- 403 Forbidden: USER role cannot access
- 404 Not Found: No accounts found for user
```

---

### 3. Transaction Endpoints (`/api/transaction`)

**All endpoints require**: `Authorization: Bearer <token>`

#### 3.1 Deposit (USER, ADMIN)
```
POST /api/transaction/deposit
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "accountNumber": "ACC-2025-000001",  // Required, NotNull
  "amount": 1000.0,                    // Required, Positive (> 0)
  "description": "Salary deposit"       // Optional
}

Response (201 Created):
{
  "id": 1,
  "accountId": 1,
  "referenceNumber": "uuid-reference-number",
  "type": "DEPOSIT",
  "amount": 1000.0,
  "status": "SUCCESS",
  "beforeBalance": 5000.0,
  "afterBalance": 6000.0,
  "description": "Salary deposit",
  "createdAt": "2025-01-18T10:30:00"
}

Error Responses:
- 400 Bad Request: Amount <= 0
  {
    "status": 400,
    "error": "BAD_REQUEST",
    "message": "Deposit amount must be greater than zero.",
    "timestamp": "2025-01-18T10:30:00"
  }
- 403 Forbidden: User trying to deposit to another user's account
- 404 Not Found: Account not found
```

#### 3.2 Withdraw (USER, ADMIN)
```
POST /api/transaction/withdraw
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "accountNumber": "ACC-2025-000001",  // Required, NotNull
  "amount": 500.0,                      // Required, Positive (> 0)
  "description": "ATM withdrawal"       // Optional
}

Response (201 Created):
{
  "id": 2,
  "accountId": 1,
  "referenceNumber": "uuid-reference-number",
  "type": "WITHDRAW",
  "amount": 500.0,
  "status": "SUCCESS",
  "beforeBalance": 6000.0,
  "afterBalance": 5500.0,
  "description": "ATM withdrawal",
  "createdAt": "2025-01-18T10:35:00"
}

Error Responses:
- 400 Bad Request: Amount <= 0
  {
    "status": 400,
    "error": "BAD_REQUEST",
    "message": "Withdraw amount must be greater than zero.",
    "timestamp": "2025-01-18T10:30:00"
  }
- 400 Bad Request: Insufficient balance
  {
    "status": 400,
    "error": "BAD_REQUEST",
    "message": "Insufficient balance.",
    "timestamp": "2025-01-18T10:30:00"
  }
- 403 Forbidden: User trying to withdraw from another user's account
- 404 Not Found: Account not found
```

#### 3.3 Transfer (USER, ADMIN)
```
POST /api/transaction/transfer
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "fromAccountNumber": "ACC-2025-000001",  // Required, NotNull
  "toAccountNumber": "ACC-2025-000002",    // Required, NotNull
  "amount": 1000.0,                         // Required, Positive (> 0)
  "description": "Payment for services"     // Optional
}

Response (201 Created):
{
  "fromAccountNumber": "ACC-2025-000001",
  "toAccountNumber": "ACC-2025-000002",
  "debitReferenceNumber": "uuid-debit-ref",
  "creditReferenceNumber": "uuid-credit-ref",
  "amount": 1000.0,
  "remainingAmount": 4500.0,
  "beforeAmount": 5500.0,
  "status": "SUCCESS",
  "description": "Payment for services",
  "createdAt": "2025-01-18T10:40:00"
}

Error Responses:
- 400 Bad Request: Amount <= 0
  {
    "status": 400,
    "error": "BAD_REQUEST",
    "message": "Transfer amount must be greater than zero.",
    "timestamp": "2025-01-18T10:30:00"
  }
- 400 Bad Request: Same account transfer
  {
    "status": 400,
    "error": "BAD_REQUEST",
    "message": "Transfer between the same account is not allowed.",
    "timestamp": "2025-01-18T10:30:00"
  }
- 400 Bad Request: Insufficient balance
  {
    "status": 400,
    "error": "BAD_REQUEST",
    "message": "Insufficient Balance.",
    "timestamp": "2025-01-18T10:30:00"
  }
- 403 Forbidden: User trying to transfer from another user's account
- 404 Not Found: Account not found
```

#### 3.4 Get Statement (USER, ADMIN)
```
POST /api/transaction/statement
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "accountNumber": "ACC-2025-000001",  // Required, NotNull
  "fromDate": "2025-01-01",             // Optional, LocalDate format (YYYY-MM-DD)
  "toDate": "2025-01-31",               // Optional, LocalDate format (YYYY-MM-DD)
  "minAmount": 100.0,                   // Optional, PositiveOrZero
  "maxAmount": 10000.0                  // Optional, PositiveOrZero
}

Response (200 OK):
[
  {
    "id": 1,
    "accountId": 1,
    "referenceNumber": "uuid-reference-number",
    "type": "DEPOSIT",
    "amount": 1000.0,
    "status": "SUCCESS",
    "beforeBalance": 5000.0,
    "afterBalance": 6000.0,
    "description": "Salary deposit",
    "createdAt": "2025-01-18T10:30:00"
  },
  {
    "id": 2,
    "accountId": 1,
    "referenceNumber": "uuid-reference-number",
    "type": "WITHDRAW",
    "amount": 500.0,
    "status": "SUCCESS",
    "beforeBalance": 6000.0,
    "afterBalance": 5500.0,
    "description": "ATM withdrawal",
    "createdAt": "2025-01-18T10:35:00"
  }
]

Error Responses:
- 400 Bad Request: From date after To date
  {
    "status": 400,
    "error": "BAD_REQUEST",
    "message": "From date cannot be after To date",
    "timestamp": "2025-01-18T10:30:00"
  }
- 403 Forbidden: User trying to access another user's account statement
- 404 Not Found: Account not found
```

#### 3.5 Get Transaction by ID (ADMIN ONLY)
```
GET /api/transaction/{transactionId}
Authorization: Bearer <token> (ADMIN role required)

Path Parameter:
- transactionId: Long (e.g., 1, 2, 3)

Response (200 OK):
{
  "id": 1,
  "accountId": 1,
  "referenceNumber": "uuid-reference-number",
  "type": "DEPOSIT",
  "amount": 1000.0,
  "status": "SUCCESS",
  "beforeBalance": 5000.0,
  "afterBalance": 6000.0,
  "description": "Salary deposit",
  "createdAt": "2025-01-18T10:30:00"
}

Error Responses:
- 401 Unauthorized: Invalid/expired token
- 403 Forbidden: USER role cannot access
- 404 Not Found: Transaction not found
```

---

### 4. User Endpoints (`/api/user`)

**All endpoints require**: `Authorization: Bearer <token>`

#### 4.1 Register User (ADMIN ONLY)
```
POST /api/user/registerUser
Authorization: Bearer <token> (ADMIN role required)
Content-Type: application/json

Request Body:
{
  "fullName": "Jane Smith",           // Required, NotBlank
  "email": "jane@example.com",        // Required, Valid Email, NotBlank
  "password": "password123"           // Required, NotBlank, Min 6 characters
}

Response (201 Created):
{
  "id": 2,
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "role": "ROLE_USER",
  "createdAt": "2025-01-18T10:30:00"
}

Error Responses:
- 400 Bad Request: Email already exists
- 401 Unauthorized: Invalid/expired token
- 403 Forbidden: USER role cannot access
```

#### 4.2 Get Current User Data (USER, ADMIN)
```
GET /api/user/getUserData
Authorization: Bearer <token>

Response (200 OK):
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "ROLE_USER",
  "createdAt": "2025-01-18T10:30:00"
}

Error Responses:
- 401 Unauthorized: Invalid/expired token
- 404 Not Found: User not found
```

#### 4.3 Get All Users (ADMIN ONLY)
```
GET /api/user
Authorization: Bearer <token> (ADMIN role required)

Response (200 OK):
[
  {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "ROLE_USER",
    "createdAt": "2025-01-18T10:30:00"
  },
  {
    "id": 2,
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "role": "ROLE_USER",
    "createdAt": "2025-01-18T11:00:00"
  }
]

Error Responses:
- 401 Unauthorized: Invalid/expired token
- 403 Forbidden: USER role cannot access
```

#### 4.4 Get User Entity by ID (ADMIN ONLY)
```
GET /api/user/entity/{userId}
Authorization: Bearer <token> (ADMIN role required)

Path Parameter:
- userId: Long (e.g., 1, 2, 3)

Response (200 OK):
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "hashed-password",
  "role": "ROLE_USER",
  "createdAt": "2025-01-18T10:30:00",
  "accounts": [ ... ]  // Full User entity with accounts
}

Error Responses:
- 401 Unauthorized: Invalid/expired token
- 403 Forbidden: USER role cannot access
- 404 Not Found: User not found
```

#### 4.5 Get User by Email (ADMIN ONLY)
```
GET /api/user/email?email=john@example.com
Authorization: Bearer <token> (ADMIN role required)

Query Parameter:
- email: String (e.g., "john@example.com")

Response (200 OK):
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "hashed-password",
  "role": "ROLE_USER",
  "createdAt": "2025-01-18T10:30:00",
  "accounts": [ ... ]  // Full User entity with accounts
}

Error Responses:
- 401 Unauthorized: Invalid/expired token
- 403 Forbidden: USER role cannot access
- 404 Not Found: User not found
```

---

## Error Response Format

All errors follow this structure:
```json
{
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Error message here",
  "timestamp": "2025-01-18T10:30:00"
}
```

**Error Types:**
- `NOT_FOUND` (404): Resource not found
- `ACCESS_DENIED` (403): Insufficient permissions
- `BAD_REQUEST` (400): Invalid request data
- `VALIDATION_ERROR` (400): Validation failed
- `INTERNAL_SERVER_ERROR` (500): Server error

---

## Frontend Application Requirements

### Technology Stack Recommendations
- **Framework**: React
- **State Management**: Redux, Zustand, or Context API
- **HTTP Client**: Axios or 
- **Routing**: React Router
- **UI Library**: Tailwind CSS
- **Form Validation**: React Hook Form, Formik, or VeeValidate

### Authentication Implementation

#### Token Management
```javascript
// Store token after login
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data));

// Include token in all API requests
const token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Logout function (CRITICAL)
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Clear any other user-related data
  window.location.href = '/login';
}
```

#### Protected Route Implementation
- Check if token exists before accessing protected routes
- Redirect to login if token is missing or expired
- Handle 401 Unauthorized responses by clearing token and redirecting to login

---

## USER DASHBOARD Requirements

### Layout
- **Header**: User name, email, role badge, logout button
- **Sidebar Navigation**: 
  - Dashboard (Overview)
  - My Accounts
  - Transactions
  - Account Statement
  - Profile

### Pages/Sections

#### 1. Dashboard (Overview)
- **Welcome Section**: Display user's full name
- **Account Summary Cards**: 
  - Total Accounts count
  - Total Balance (sum of all accounts) and balance per account
  - Recent Transactions (last 5)
- **Quick Actions**:
  - Create New Account button
  - Deposit button
  - Withdraw button
  - Transfer button

#### 2. My Accounts Page
- **List View**: Display all user's accounts in cards or table
  - Account Number
  - Account Type (Savings/Current)
  - Balance (formatted as currency)
  - Created Date
  - Action buttons: View Details, View Statement
- **Create Account Form**:
  - Account Type dropdown (Savings/Current)
  - Submit button
- **Account Details Modal/Page**:
  - Full account information
  - Recent transactions for this account
  - Quick actions (Deposit, Withdraw, Transfer)

#### 3. Transactions Page
- **Transaction History Table**:
  - Date/Time
  - Type (DEPOSIT, WITHDRAW, TRANSFER_DEBIT, TRANSFER_CREDIT)
  - Amount (with color coding: green for credit, red for debit)
  - Reference Number
  - Status
  - Description
  - Before Balance / After Balance
- **Filters**:
  - Account Number dropdown
  - Date Range (From Date, To Date)
  - Amount Range (Min, Max)
  - Transaction Type
- **Action Buttons**:
  - Deposit
  - Withdraw
  - Transfer

#### 4. Deposit Page/Modal
- **Form Fields**:
  - Account Number (dropdown of user's accounts)
  - Amount (number input, must be > 0)
  - Description (optional textarea)
- **Validation**:
  - Account Number required
  - Amount required, must be positive
  - Show error messages from API
- **Success**: Show success message, update balance, refresh account list

#### 5. Withdraw Page/Modal
- **Form Fields**:
  - Account Number (dropdown of user's accounts)
  - Amount (number input, must be > 0)
  - Description (optional textarea)
- **Validation**:
  - Account Number required
  - Amount required, must be positive
  - Check balance before allowing withdrawal
- **Error Handling**:
  - Show "Insufficient balance" error if amount > balance
- **Success**: Show success message, update balance, refresh account list

#### 6. Transfer Page/Modal
- **Form Fields**:
  - From Account Number (dropdown of user's accounts)
  - To Account Number (text input with validation)
  - Amount (number input, must be > 0)
  - Description (optional textarea)
- **Validation**:
  - Both account numbers required
  - Amount required, must be positive
  - Cannot transfer to same account
  - Check balance before allowing transfer
- **Error Handling**:
  - Show "Insufficient balance" error
  - Show "Same account transfer not allowed" error
  - Show "Account not found" error for recipient account
- **Success**: Show success message with reference numbers, update balances

#### 7. Account Statement Page
- **Filter Form**:
  - Account Number (required dropdown)
  - From Date (date picker, optional)
  - To Date (date picker, optional)
  - Min Amount (number input, optional)
  - Max Amount (number input, optional)
- **Validation**:
  - If both dates provided, From Date must be before To Date
- **Results Table**:
  - Display filtered transactions
  - Same columns as Transactions page
  - Export to PDF/CSV button (optional)

#### 8. Profile Page
- **Display User Information**:
  - Full Name
  - Email
  - Role
  - Account Created Date
- **Edit Profile** (if backend supports, otherwise read-only)

---

## ADMIN DASHBOARD Requirements

### Layout
- **Header**: Admin name, email, "ADMIN" badge, logout button
- **Sidebar Navigation**:
  - Dashboard (Overview)
  - All Users
  - All Accounts
  - All Transactions
  - User Management
  - Reports/Analytics

### Pages/Sections

#### 1. Dashboard (Overview)
- **Statistics Cards**:
  - Total Users count
  - Total Accounts count
  - Total Transactions count
  - Total System Balance
- **Recent Activity**:
  - Latest registered users
  - Latest transactions
  - Latest accounts created
- **Quick Actions**:
  - Register New User
  - View All Users
  - View All Transactions

#### 2. All Users Page
- **Users Table**:
  - User ID
  - Full Name
  - Email
  - Role
  - Created Date
  - Number of Accounts
  - Actions: View Details, View Accounts, View Transactions
- **Search/Filter**:
  - Search by name or email
  - Filter by role
- **Register New User Button**:
  - Opens modal/form
  - Fields: Full Name, Email, Password
  - Submit creates new user

#### 3. User Details Page
- **User Information Section**:
  - Full user details (from `/api/user/entity/{userId}`)
  - All accounts linked to user
  - Transaction history
- **Actions**:
  - View all accounts
  - View transaction history
  - Edit user (if supported)

#### 4. All Accounts Page
- **Accounts Table**:
  - Account ID
  - Account Number
  - Account Type
  - Balance
  - Owner (User Name/Email)
  - Created Date
  - Actions: View Details, View Transactions
- **Search/Filter**:
  - Search by account number
  - Filter by account type
  - Filter by user
- **View Account Details**:
  - Full account information
  - Owner details
  - Transaction history

#### 5. All Transactions Page
- **Transactions Table**:
  - Transaction ID
  - Date/Time
  - Type
  - Amount
  - Account Number
  - Account Owner
  - Reference Number
  - Status
  - Description
  - Before/After Balance
- **Filters**:
  - Date Range
  - Transaction Type
  - Account Number
  - User
  - Amount Range
- **View Transaction Details**:
  - Full transaction information
  - Related account details

#### 6. User Management Page
- **Register New User Form**:
  - Full Name (required)
  - Email (required, validated)
  - Password (required, min 6 characters)
  - Submit button
- **User List**:
  - All users with actions
  - Delete/Deactivate user (if supported)

---

## UI/UX Requirements

### Design Principles
1. **Modern & Clean**: Use modern design patterns, clean layouts
2. **Responsive**: Must work on desktop, tablet, and mobile
3. **Accessible**: Follow WCAG guidelines, proper contrast, keyboard navigation
4. **Professional**: Banking application should look trustworthy and professional
5. **Color Scheme**:
   - Primary: Blue (trust, security)
   - Success: Green (for deposits, credits)
   - Danger: Red (for withdrawals, debits)
   - Warning: Orange/Yellow (for alerts)
   - Neutral: Gray (for backgrounds, borders)

### Component Requirements

#### Forms
- Clear labels
- Placeholder text where helpful
- Real-time validation
- Error messages below fields
- Success messages after submission
- Loading states during API calls
- Disable submit button while processing

#### Tables
- Sortable columns
- Pagination (if many records)
- Search functionality
- Responsive design (horizontal scroll on mobile)
- Row actions (view, edit, delete)

#### Modals/Dialogs
- Clear titles
- Close button (X)
- Cancel and Submit buttons
- Form validation
- Loading states

#### Notifications
- Success toasts/notifications
- Error toasts/notifications
- Auto-dismiss after 5 seconds
- Manual dismiss option

### Loading States
- Show loading spinners during API calls
- Skeleton loaders for data tables
- Disable buttons during processing
- Show progress indicators for long operations

### Error Handling
- Display API error messages to users
- Handle network errors gracefully
- Show retry options for failed requests
- Logout user on 401 Unauthorized
- Show friendly error messages (not technical details)

---

## State Management

### Required State
1. **Authentication State**:
   - Token
   - User data (email, fullName, role)
   - Is authenticated flag

2. **User State** (for USER role):
   - Accounts list
   - Selected account
   - Transactions list
   - Current balance

3. **Admin State** (for ADMIN role):
   - All users list
   - All accounts list
   - All transactions list
   - Selected user/account/transaction

4. **UI State**:
   - Loading states
   - Error messages
   - Success messages
   - Modal open/close states

---

## Routing Structure

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Require Authentication)

#### USER Routes
- `/dashboard` - User dashboard
- `/accounts` - My accounts
- `/accounts/:accountNumber` - Account details
- `/transactions` - Transaction history
- `/deposit` - Deposit page
- `/withdraw` - Withdraw page
- `/transfer` - Transfer page
- `/statement` - Account statement
- `/profile` - User profile

#### ADMIN Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - All users
- `/admin/users/:userId` - User details
- `/admin/accounts` - All accounts
- `/admin/accounts/:accountId` - Account details
- `/admin/transactions` - All transactions
- `/admin/transactions/:transactionId` - Transaction details
- `/admin/register-user` - Register new user

### Route Guards
- Check authentication before accessing protected routes
- Check user role before accessing admin routes
- Redirect to login if not authenticated
- Redirect to appropriate dashboard based on role

---

## API Integration Details

### HTTP Client Setup
```javascript
// Axios configuration example
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json'
  }
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
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Service Functions
Create service functions for each endpoint:
- `authService.login(credentials)`
- `authService.register(userData)`
- `accountService.getMyAccounts()`
- `accountService.createAccount(accountData)`
- `transactionService.deposit(depositData)`
- `transactionService.withdraw(withdrawData)`
- `transactionService.transfer(transferData)`
- `transactionService.getStatement(statementData)`
- `userService.getCurrentUser()`
- `adminService.getAllUsers()`
- `adminService.getAllAccounts()`
- `adminService.getAllTransactions()`
- etc.

---

## Data Formatting

### Currency Formatting
- Format all amounts as currency (e.g., Rs. 1,234.56 or Rs. 1,234.56)
- Use 2 decimal places
- Add thousand separators
- Use Nepali currency

### Date/Time Formatting
- Display dates in readable format (e.g., "Jan 18, 2025" or "18/01/2025")
- Display times in 12-hour or 24-hour format
- Show relative time for recent transactions (e.g., "2 hours ago")

### Account Number Display
- Display account numbers clearly
- Option to copy to clipboard

---

## Security Considerations

1. **Token Security**:
   - Store token securely (localStorage is acceptable for this app)
   - Never log tokens to console
   - Clear token on logout

2. **Input Validation**:
   - Validate all inputs on frontend
   - Sanitize user inputs
   - Prevent XSS attacks

3. **Error Messages**:
   - Don't expose sensitive information in error messages
   - Show user-friendly messages

4. **HTTPS**:
   - Use HTTPS in production
   - Warn if API calls are made over HTTP in production

---

## Testing Requirements

### Test Cases to Implement
1. **Authentication**:
   - Login with valid credentials
   - Login with invalid credentials
   - Register new user
   - Logout functionality
   - Token expiration handling

2. **User Dashboard**:
   - View accounts
   - Create account
   - Deposit money
   - Withdraw money
   - Transfer money
   - View statement
   - Filter transactions

3. **Admin Dashboard**:
   - View all users
   - Register new user
   - View all accounts
   - View all transactions
   - Access control (USER cannot access admin routes)

4. **Error Handling**:
   - Network errors
   - API errors
   - Validation errors
   - Unauthorized access

---

## Additional Features 

1. **Dark Mode**: Toggle between light and dark themes
2. **Export Functionality**: Export statements to PDF/CSV
3. **Print Functionality**: Print account statements
6. **Search**: Global search across accounts and transactions
7. **Filters**: Advanced filtering options
8. **Pagination**: For large data sets
9. **Sorting**: Sort tables by different columns
10. **Responsive Design**: Mobile-first approach

---

## Implementation Checklist

### Phase 1: Setup & Authentication
- [ ] Project setup with chosen framework
- [ ] API client configuration
- [ ] Login page
- [ ] Register page
- [ ] Token management
- [ ] Protected route guards
- [ ] Logout functionality

### Phase 2: User Dashboard
- [ ] Dashboard layout
- [ ] My Accounts page
- [ ] Create Account functionality
- [ ] Deposit functionality
- [ ] Withdraw functionality
- [ ] Transfer functionality
- [ ] Transaction history
- [ ] Account statement with filters
- [ ] Profile page

### Phase 3: Admin Dashboard
- [ ] Admin dashboard layout
- [ ] All Users page
- [ ] Register User functionality
- [ ] User details page
- [ ] All Accounts page
- [ ] Account details page
- [ ] All Transactions page
- [ ] Transaction details page

### Phase 4: Polish & Testing
- [ ] Error handling
- [ ] Loading states
- [ ] Success/Error notifications
- [ ] Form validation
- [ ] Responsive design
- [ ] Testing
- [ ] Documentation

---

## Example API Call Implementations

### Login Example
```javascript
async function login(email, password) {
  try {
    const response = await axios.post('http://localhost:8081/api/auth/login', {
      email,
      password
    });
    
    // Store token and user data
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
    
    // Set default authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    
    // Redirect based on role
    if (response.data.role === 'ROLE_ADMIN') {
      window.location.href = '/admin/dashboard';
    } else {
      window.location.href = '/dashboard';
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
```

### Get My Accounts Example
```javascript
async function getMyAccounts() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8081/api/accounts/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired, logout user
      logout();
    }
    throw error.response?.data || error;
  }
}
```

### Deposit Example
```javascript
async function deposit(accountNumber, amount, description) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:8081/api/transaction/deposit',
      {
        accountNumber,
        amount,
        description
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
```

---

## Final Notes

1. **Base URL**: All API calls should use `http://localhost:8081` as base URL
2. **CORS**: Ensure backend CORS is configured to allow frontend origin
3. **Token Expiration**: Handle token expiration gracefully (1 hour)
4. **Role-Based UI**: Show/hide features based on user role
5. **Error Messages**: Display API error messages to users in a user-friendly way
6. **Loading States**: Always show loading indicators during API calls
7. **Form Validation**: Validate on both client and server side
8. **Responsive**: Ensure all pages work on mobile devices
9. **Accessibility**: Follow accessibility best practices
10. **Performance**: Optimize API calls, use caching where appropriate

---


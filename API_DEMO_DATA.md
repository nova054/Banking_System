# Banking System API - Demo Data & Endpoints

This document contains complete demo data and example requests for testing the Banking System API.
All endpoints assume the application is running at http://localhost:8081.

## Authentication Headers
All requests (except login/register) require:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 1. Authentication APIs

### POST /api/auth/register
**Description:** Register a new user
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

### POST /api/auth/login
**Description:** User login
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

---

## 2. User APIs

### GET /api/user/getUserData
**Description:** Get current user profile
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "role": "USER",
  "status": "ACTIVE",
  "isActive": true,
  "createdAt": "2026-01-26T10:30:00",
  "lastLoginAt": "2026-01-26T15:30:00"
}
```

---

## 3. Account APIs

### GET /api/account/user
**Description:** Get all accounts for current user
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
[
  {
    "id": 1,
    "accountNumber": "ACC-2026-000001",
    "accountType": "SAVING",
    "balance": 5000.00,
    "status": "OPEN",
    "createdAt": "2026-01-26T10:30:00"
  }
]
```

### POST /api/account
**Description:** Create new account
**Headers:** `Authorization: Bearer <token>`
```json
{
  "accountType": "CURRENT",
  "initialDeposit": 1000.00
}
```

### GET /api/account/number/{accountNumber}
**Description:** Get account by account number
**Headers:** `Authorization: Bearer <token>`
**Path Variable:** `accountNumber` (e.g., "ACC-2026-000001")
**Response:**
```json
{
  "id": 1,
  "accountNumber": "ACC-2026-000001",
  "accountType": "SAVING",
  "balance": 5000.00,
  "status": "OPEN",
  "createdAt": "2026-01-26T10:30:00"
}
```

---

## 4. Transaction APIs

### POST /api/transaction/deposit
**Description:** Deposit money to account
**Headers:** `Authorization: Bearer <token>`
```json
{
  "accountNumber": "ACC-2026-000001",
  "amount": 500.00,
  "description": "Salary deposit"
}
```

### POST /api/transaction/withdraw
**Description:** Withdraw money from account
**Headers:** `Authorization: Bearer <token>`
```json
{
  "accountNumber": "ACC-2026-000001",
  "amount": 200.00,
  "description": "ATM withdrawal"
}
```

### POST /api/transaction/transfer
**Description:** Transfer money between accounts
**Headers:** `Authorization: Bearer <token>`
```json
{
  "fromAccountNumber": "ACC-2026-000001",
  "toAccountNumber": "ACC-2026-000002",
  "amount": 300.00,
  "description": "Rent payment"
}
```

### POST /api/transaction/statement
**Description:** Get account statement
**Headers:** `Authorization: Bearer <token>`
```json
{
  "accountNumber": "ACC-2026-000001",
  "fromDate": "2026-01-01T00:00:00",
  "toDate": "2026-01-26T23:59:59",
  "minAmount": 0,
  "maxAmount": 10000
}
```
**Query Parameters:** `?page=0&size=20&sort=createdAt,desc`
**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "referenceNumber": "REF-123456",
      "type": "DEPOSIT",
      "amount": 500.00,
      "status": "SUCCESS",
      "beforeAmount": 4500.00,
      "remainingAmount": 5000.00,
      "description": "Salary deposit",
      "createdAt": "2026-01-26T10:30:00"
    }
  ],
  "pageable": {
    "page": 0,
    "size": 20
  }
}
```

---

## 5. Admin APIs

### 5.1 Admin Dashboard

### GET /api/admin/dashboard
**Description:** Get system overview
**Headers:** `Authorization: Bearer <admin_token>`
**Response:**
```json
{
  "totalUsers": 150,
  "activeUsers": 142,
  "totalAccounts": 280,
  "activeAccounts": 265,
  "todayTransactionCount": 45,
  "todayTransactionAmount": 12500.50
}
```

### 5.2 Admin User Management

### GET /api/admin/user
**Description:** Get all users (paginated)
**Query Parameters:** `?page=0&size=10&sort=createdAt,desc`

### POST /api/admin/user/filter
**Description:** Filter users
```json
{
  "fullName": "John",
  "email": "john@example.com",
  "role": "USER",
  "isActive": true,
  "status": "ACTIVE",
  "fromDate": "2026-01-01T00:00:00",
  "toDate": "2026-01-26T23:59:59"
}
```

### GET /api/admin/user/{userId}
**Description:** Get user by ID
**Response:**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "role": "USER",
  "isActive": true,
  "status": "ACTIVE",
  "accountCount": 2,
  "lastLoginAt": "2026-01-26T15:30:00",
  "createdAt": "2026-01-20T10:30:00"
}
```

### GET /api/admin/user/email?email=john@example.com
**Description:** Get user by email

### POST /api/admin/user/register
**Description:** Register new user (admin)
```json
{
  "fullName": "Jane Smith",
  "email": "jane.smith@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

### GET /api/admin/user/enable/{id}
**Description:** Enable user account

### GET /api/admin/user/disable/{id}
**Description:** Disable user account

### PATCH /api/admin/user/resetPassword
**Description:** Reset user password
```json
{
  "email": "john.doe@example.com",
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

### 5.3 Admin Account Management

### GET /api/admin/account
**Description:** Get all accounts (paginated)

### POST /api/admin/account/filter
**Description:** Filter accounts
```json
{
  "accountNumber": "ACC-2026-000001",
  "userEmail": "john@example.com",
  "status": "OPEN",
  "type": "SAVING",
  "minBalance": 1000.0,
  "maxBalance": 50000.0
}
```

### GET /api/admin/account/id/{accountId}
**Description:** Get account by ID

### GET /api/admin/account/user-email?email=john@example.com
**Description:** Get accounts by user email

### POST /api/admin/account/createAccount?email=john@example.com
**Description:** Create account for user
```json
{
  "accountType": "SAVING",
  "initialDeposit": 5000.00
}
```

### PATCH /api/admin/account/change-status
**Description:** Change account status
```json
{
  "id": 1,
  "status": "FROZEN"
}
```

### 5.4 Admin Transaction Management

### GET /api/admin/transaction
**Description:** Get all transactions (paginated)

### POST /api/admin/transaction/filter
**Description:** Filter transactions
```json
{
  "accountNumber": "ACC-2026-000001",
  "userEmail": "john@example.com",
  "type": "DEPOSIT",
  "status": "SUCCESS",
  "fromDate": "2026-01-01T00:00:00",
  "toDate": "2026-01-26T23:59:59",
  "minAmount": 100.0,
  "maxAmount": 10000.0
}
```

### GET /api/admin/transaction/{transactionId}
**Description:** Get transaction by ID
**Response:**
```json
{
  "id": 1,
  "referenceNumber": "REF-123456",
  "type": "DEPOSIT",
  "amount": 500.00,
  "status": "SUCCESS",
  "beforeBalance": 4500.00,
  "afterBalance": 5000.00,
  "description": "Salary deposit",
  "createdAt": "2026-01-26T10:30:00",
  "accountNumber": "ACC-2026-000001",
  "transferId": null
}
```

### 5.5 Admin Audit Logs

### GET /api/admin/audits
**Description:** Get all audit logs (paginated)
**Headers:** `Authorization: Bearer <admin_token>`
**Query Parameters:** `?page=0&size=20&sort=createdAt,desc`
**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "auditAction": "LOGIN",
      "entityType": "USER",
      "entityId": 1,
      "performedBy": "admin@example.com",
      "role": "ADMIN",
      "ipAddress": "192.168.1.100",
      "status": "SUCCESS",
      "description": "User login successful",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2026-01-26T10:30:00"
    }
  ],
  "pageable": {
    "page": 0,
    "size": 20
  }
}
```

### POST /api/admin/audits/filters
**Description:** Filter audit logs
**Headers:** `Authorization: Bearer <admin_token>`
```json
{
  "userEmail": "admin@example.com",
  "action": "LOGIN",
  "entityType": "USER",
  "fromDate": "2026-01-01T00:00:00",
  "toDate": "2026-01-26T23:59:59"
}
```

---

## 6. Error Response Format

All errors follow this format:
```json
{
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "accountNumber: must not be blank",
  "timestamp": "2026-01-26T16:19:22.5593931"
}
```

### Common Error Codes:
- **400 BAD_REQUEST** - Invalid input data
- **401 UNAUTHORIZED** - Not authenticated
- **403 FORBIDDEN** - Insufficient permissions
- **404 NOT_FOUND** - Resource not found
- **500 INTERNAL_SERVER_ERROR** - Server error

---

## 7. Enum Values Reference

### Role
- `USER`
- `ADMIN`

### UserStatus
- `ACTIVE`
- `INACTIVE`
- `SUSPENDED`

### AccountType
- `SAVING`
- `CURRENT`

### AccountStatus
- `OPEN`
- `CLOSED`
- `FROZEN`
- `SUSPENDED`

### TransactionType
- `DEPOSIT`
- `WITHDRAW`
- `TRANSFER_CREDIT`
- `TRANSFER_DEBIT`

### TransactionStatus
- `INITIATED`
- `PENDING`
- `SUCCESS`
- `FAILED`

### AuditAction
- `LOGIN`
- `REGISTER`
- `ACCOUNT_CREATED`
- `ACCOUNT_UPDATED`
- `DEPOSIT`
- `WITHDRAW`
- `TRANSFER`
- `PASSWORD_RESET`
- `VIEW_STATEMENT`
- `SECURITY_VIOLATION`
- `TRANSACTION_VIEW`
- `TRANSACTION_INITIATED`
- `TRANSACTION_COMPLETED`
- `TRANSACTION_FAILED`
- `TRANSACTION_REVERSED`

### AuditEntityType
- `USER`
- `ACCOUNT`
- `TRANSACTION`

---

## 8. Testing Tips

1. **Login First:** Get JWT token from `/api/auth/login`
2. **Use Admin Token:** For admin endpoints, login with admin credentials
3. **Base URL:** http://localhost:8081/
4. **Pagination:** Use `page`, `size`, `sort` query parameters for paginated endpoints
5. **Date Format:** Use ISO format `YYYY-MM-DDTHH:mm:ss` for datetime fields
6. **Validation:** All `@Valid` annotated endpoints will return 400 for invalid data
7. **Authentication:** Include `Authorization: Bearer <token>` header for protected endpoints

### Quick Test Sequence

1. **Register User:**
   ```bash
   curl -X POST http://localhost:8081/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
      "fullName":"Test User",
      "email":"test@example.com",
      "password":"Test123!",
      "confirmPassword":"Test123!"
   }'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:8081/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!"}'
   ```

3. **Create Account:**
   ```bash
   curl -X POST http://localhost:8081/api/account \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <JWT_TOKEN>" \
     -d '{"accountType":"SAVING","initialDeposit":1000}'
   ```

4. **Deposit:**
   ```bash
   curl -X POST http://localhost:8081/api/transaction/deposit \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <JWT_TOKEN>" \
     -d '{"accountNumber":"ACC-2026-000001","amount":500,"description":"Test deposit"}'
   ```

---


# Banking System Backend API

A production-grade, secure, and scalable banking system backend built with Java Spring Boot. This API-only system provides comprehensive banking functionality with enterprise-level security, audit logging, and administrative capabilities.

## Project Overview

This Banking System API addresses the critical need for a secure, reliable, and auditable backend infrastructure in modern banking environments. In an era where digital banking is the norm, financial institutions require robust systems that can handle sensitive transactions while maintaining strict security protocols and regulatory compliance.

The system provides a complete backend solution for core banking operations including user authentication, account management, transaction processing, and administrative oversight. Built with enterprise-grade architecture patterns, it ensures data integrity, transaction safety, and comprehensive audit trails essential for financial operations. The API-first design enables seamless integration with various frontend applications while maintaining strict security boundaries.

## Key Features

### Authentication & Security
- **JWT-based Authentication**: Stateless authentication with secure token generation and validation
- **Role-Based Access Control**: Granular permissions with USER and ADMIN roles
- **Secure Account Ownership Validation**: Prevents unauthorized access to user accounts
- **BCrypt Password Encryption**: Strong password hashing with configurable strength
- **CORS Configuration**: Secure cross-origin resource sharing policies

### Transaction Management
- **Transaction Safety**: Pessimistic locking prevents race conditions during concurrent operations
- **Atomic Operations**: Database-level transaction consistency with proper rollback mechanisms
- **Multiple Transaction Types**: Deposit, withdrawal, and inter-account transfers
- **Reference Number Generation**: Unique transaction identifiers for traceability
- **Balance Validation**: Real-time balance checks with insufficient fund protection

### Audit & Compliance
- **Comprehensive Audit Logging**: Success and failure logging for all critical operations
- **Security Event Tracking**: Detailed logging of authentication attempts and access violations
- **Admin Audit Visibility**: Complete audit trail access for administrative oversight
- **IP and User Agent Tracking**: Request metadata for forensic analysis
- **Entity-Level Auditing**: Granular tracking of user, account, and transaction operations

### Administrative Features
- **User Management**: View, filter, and manage user accounts with status controls
- **Account Oversight**: Complete visibility into all system accounts with advanced filtering
- **Transaction Monitoring**: System-wide transaction monitoring with comprehensive search capabilities
- **Dashboard Analytics**: Real-time statistics on users, accounts, and transactions
- **Security Controls**: User and Account lock/unlock capabilities and password reset functionality

### Data Management
- **Pagination & Sorting**: Efficient data retrieval with configurable page sizes
- **Advanced Filtering**: Multi-parameter filtering across all major entities
- **Database Optimization**: Strategic indexing for performance-critical queries
- **DTO Pattern**: Clean data transfer with proper separation of concerns

## Tech Stack

- **Java 17**: Modern Java with enhanced performance and security features
- **Spring Boot 3.2.4**: Enterprise-grade application framework
- **Spring Security**: Comprehensive security framework with JWT integration
- **JWT (JJWT 0.12.6)**: Stateless authentication with secure token handling
- **Spring Data JPA**: Database abstraction with Hibernate ORM
- **Oracle Database**: Enterprise-grade relational database with full compatibility
- **SpringDoc OpenAPI 2.3.0**: Interactive API documentation with Swagger UI
- **Lombok 1.18.30**: Code generation for cleaner, more maintainable code
- **Spring Validation**: Comprehensive input validation and error handling

## System Architecture

### Layered Architecture
The system follows a clean, layered architecture pattern:

```
Client Request → JWT Filter → Controller → Service → Repository → Database
```

### Component Layers

**Controller Layer**
- RESTful API endpoints with proper HTTP methods and status codes
- Input validation using `@Valid` annotations
- DTO transformation for clean API contracts
- Security enforcement with `@PreAuthorize` annotations

**Service Layer**
- Business logic implementation with transactional boundaries
- Account ownership validation and security checks
- Audit logging integration for all operations
- Complex business rules and data transformations

**Repository Layer**
- JPA repositories with custom query methods
- Optimized database queries with proper indexing
- Pagination and sorting support
- Pessimistic locking for transaction safety

### Request Lifecycle

1. **Authentication**: JWT filter validates token and sets security context
2. **Authorization**: Spring Security enforces role-based access control
3. **Validation**: Input validation at controller level
4. **Business Logic**: Service layer processes request with security checks
5. **Data Access**: Repository layer interacts with database
6. **Audit Logging**: Comprehensive logging of all operations
7. **Response**: Formatted response with appropriate status codes

## Authentication & Security Design

### JWT Implementation
JWT tokens are used for stateless authentication with the following design decisions:

- **Token Storage**: Tokens are not stored in the database, reducing overhead and maintaining statelessness
- **Token Expiration**: Configurable expiration time for security
- **Secret Key Management**: Base64-encoded secret key for HMAC-SHA signing
- **Token Validation**: Comprehensive validation including expiration and signature verification

### Authentication Flow
1. User submits credentials to `/api/auth/login`
2. System validates credentials against database
3. JWT token generated with user identity and role information
4. Token returned to client for subsequent requests
5. JWT filter validates token on each protected endpoint access

### Authorization Model
- **Role-Based Access**: USER and ADMIN roles with distinct permissions
- **Method-Level Security**: `@PreAuthorize` annotations for fine-grained control
- **Account Ownership**: Users can only access their own accounts and transactions
- **Admin Privileges**: Administrative users have system-wide access with audit trails

### Security Features
- **Password Encryption**: BCrypt with strength 12 for robust password hashing
- **CORS Protection**: Configurable cross-origin policies
- **Input Validation**: Comprehensive validation to prevent injection attacks
- **Security Headers**: Proper HTTP security headers configuration

## Audit Logging Design

### Banking Compliance Requirements
Audit logging is critical in banking systems for regulatory compliance, fraud detection, and operational transparency. This system implements comprehensive logging for all sensitive operations.

### Audited Operations
- **Authentication Events**: Login attempts, successes, and failures
- **Account Operations**: Creation, updates, and access attempts
- **Transaction Processing**: All financial transactions with complete details
- **Administrative Actions**: User management, account modifications, and system changes
- **Security Violations**: Unauthorized access attempts and policy violations

### Audit Data Structure
Each audit log captures:
- **Action Type**: Categorized operation (CREATE, READ, UPDATE, DELETE, SECURITY_VIOLATION)
- **Entity Information**: Affected entity type and ID
- **User Context**: Performing user and their role
- **Request Metadata**: IP address and user agent
- **Operation Status**: Success or failure with descriptive messages
- **Timestamp**: Precise operation timing

### Audit Access Control
- **Admin Only Access**: Audit logs are restricted to administrative users
- **Advanced Filtering**: Search by date range, user, action type, and entity
- **Immutable Records**: Audit logs cannot be modified or deleted
- **Performance Optimized**: Efficient indexing for fast audit trail queries

## Admin Capabilities

### User Management
- **User Directory**: Complete user listing with advanced filtering capabilities
- **Status Management**: Lock/unlock user accounts for security enforcement
- **Password Reset**: Secure password reset functionality for account recovery
- **User Analytics**: Registration trends and activity monitoring

### Account Oversight
- **System-Wide View**: Access to all accounts across the banking system
- **Account Filtering**: Search by account number, user email, status, and balance ranges
- **Status Management**: Monitor and control account statuses (OPEN, CLOSED, SUSPENDED)
- **Balance Analytics**: Account distribution and balance insights

### Transaction Monitoring
- **Global Transaction View**: Access to all system transactions
- **Advanced Search**: Filter by date ranges, amounts, transaction types, and status
- **Fraud Detection**: Transaction pattern analysis and anomaly detection
- **Settlement Reporting**: Daily and periodic transaction summaries

### Dashboard Analytics
- **System Overview**: Real-time statistics on users, accounts, and transactions
- **Daily Metrics**: Transaction volume and value tracking
- **User Activity**: Active user counts and engagement metrics
- **Account Distribution**: Account type and status breakdowns

## API Documentation & Usage

### Swagger UI Integration
The system includes comprehensive API documentation accessible via Swagger UI:
- **Interactive Documentation**: Available at `/swagger-ui.html`
- **JWT Authentication**: Built-in JWT authentication for testing protected endpoints
- **API Exploration**: Try out all endpoints directly from the browser
- **Schema Documentation**: Complete request/response schema definitions

### Authentication in Swagger
1. Navigate to `/swagger-ui.html`
2. Click the "Authorize" button
3. Enter `Bearer <JWT_TOKEN>` in the value field
4. Click "Authorize" to authenticate for protected endpoints

### Postman Testing
The system includes comprehensive API documentation in `API_DEMO_DATA.md` with:
- **Authentication Examples**: Login and registration request formats
- **Endpoint Documentation**: Complete API endpoint specifications
- **Request Examples**: Sample requests for all major operations
- **Response Formats**: Expected response structures and status codes

## Database Design

### Core Entities

**User Entity**
- Primary identity with authentication and authorization data
- Relationships to accounts and audit logs
- Status tracking for account lifecycle management
- Optimized indexing on email for authentication queries

**Account Entity**
- Financial account representation with balance tracking
- Pessimistic locking for transaction safety
- Status management for account lifecycle
- Unique account number generation for identification

**Transaction Entity**
- Complete transaction history with before/after balances
- Reference number generation for traceability
- Status tracking for transaction lifecycle
- Relationship to accounts for data integrity

**AuditLog Entity**
- Comprehensive audit trail for compliance
- Entity relationship tracking for forensic analysis
- Optimized indexing for efficient audit queries
- Immutable record design for data integrity

### Database Optimizations
- **Sequence Generators**: Optimized primary key generation with allocation size 1
- **Strategic Indexing**: Performance-critical queries optimized with proper indexes
- **Lazy Loading**: Efficient relationship loading to prevent N+1 queries
- **Pessimistic Locking**: Account-level locking during transactions

### Query Optimization
- **Pagination**: Efficient data retrieval with configurable page sizes
- **Filtering**: Database-level filtering for reduced data transfer
- **Join Optimization**: Optimized joins for complex queries
- **Count Queries**: Efficient counting operations for dashboard metrics

## Error Handling & Validation

### Global Exception Handling
The system implements comprehensive error handling through `GlobalExceptionHandler`:

- **Resource Not Found (404)**: Proper handling of missing entities
- **Access Denied (403)**: Security violations and authorization failures
- **Bad Request (400)**: Validation errors and invalid input
- **Validation Errors**: Detailed field-level validation feedback
- **Generic Exceptions**: Graceful handling of unexpected errors

### Custom Exception Types
- **AccessDeniedException**: Custom security violations
- **AccountValidationException**: Account-specific validation errors
- **UserValidationException**: User-specific validation errors
- **BadRequestException**: General business rule violations
- **ResourceNotFoundException**: Missing resource handling

### Validation Strategy
- **Input Validation**: `@Valid` annotations with custom validators
- **Business Rule Validation**: Service-level validation for complex rules
- **Security Validation**: Account ownership and authorization checks
- **Data Integrity**: Database constraints and application-level validation

## How to Run the Project

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher
- Oracle Database 11g or higher (or Oracle XE for development)
- Git for version control

### Environment Variables
The application uses `application.properties` with the following default configuration:

```properties
# Application Configuration
spring.application.name=Banking System API
server.port=8081

# Database Configuration
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:xe
spring.datasource.username=bankadmin
spring.datasource.password=root

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.community.dialect.Oracle10gDialect

# JWT Configuration
jwt.secret= #Secret Key
jwt.expiration=3600000  # 1 hour in milliseconds

```

**Important**: Update the database credentials and JWT secret for production environments.

### Database Setup

#### Option 1: Oracle XE (Development)
1. **Download and Install Oracle XE**:
   - Download Oracle Database XE from Oracle website
   - Install with default settings (port: 1521, SID: xe)
   - Set admin password during installation

2. **Create Database User**:
   ```sql
   -- Connect as SYS or SYSTEM
   CREATE USER bankadmin IDENTIFIED BY root;
   GRANT CONNECT, RESOURCE, DBA TO bankadmin;
   GRANT UNLIMITED TABLESPACE TO bankadmin;
   ```

3. **Verify Connection**:
   ```bash
   # Test connection using SQL*Plus or SQL Developer
   sqlplus bankadmin/root@localhost:1521/xe
   ```

#### Option 2: Oracle Database (Production)
1. **Create Database Schema**:
   ```sql
   CREATE USER bankadmin IDENTIFIED BY your_secure_password;
   GRANT CONNECT, RESOURCE TO bankadmin;
   GRANT CREATE SESSION, CREATE TABLE, CREATE SEQUENCE TO bankadmin;
   ```

2. **Update Configuration**:
   - Modify `application.properties` with your database details
   - Update credentials for production environment

3. **Table Creation**:
   - Tables are auto-created by Hibernate with `ddl-auto=update`
   - Verify creation: USERS, ACCOUNTS, TRANSACTIONS, AUDIT_LOGS

### Installation Steps

#### 1. Clone and Build
```bash
# Clone the repository
git clone <https://github.com/nova054/Banking_System>
cd banking-system-api

# Verify Java version
java -version  # Should be 17 or higher

# Clean and compile
mvn clean compile

# Run tests
mvn test

# Build the application
mvn clean package -DskipTests
```

#### 2. Database Preparation
```bash
# Ensure Oracle is running
# Test connection with configured credentials
# Verify user permissions
```

#### 3. Run the Application

**Option A: Using Maven**
```bash
mvn spring-boot:run
```

**Option B: Using JAR**
```bash
java -jar target/banking-system-api-0.0.1-SNAPSHOT.jar
```

**Option C: Using IDE**
- Import as Maven project
- Run `BankingSystemApiApplication.java` main class

#### 4. Verify Installation
```bash
# Check application logs for successful startup
# Test health endpoint
curl http://localhost:8081/actuator/health

# Test Swagger UI
# Open browser: http://localhost:8081/swagger-ui.html
```

### Initial Setup

#### Create Admin User
1. **Register First User**:
   ```bash
   curl -X POST http://localhost:8081/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "fullName": "System Administrator",
       "email": "admin@bank.com",
       "password": "AdminPass123!",
       "confirmPassword": "AdminPass123!"
     }'
   ```

2. **Update User Role to ADMIN**:
   - Connect to database
   ```sql
   UPDATE USERS SET ROLE = 'ADMIN' WHERE EMAIL = 'admin@bank.com';
   ```

3. **Login as Admin**:
   ```bash
   curl -X POST http://localhost:8081/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@bank.com",
       "password": "AdminPass123!"
     }'
   ```

### Accessing the Application
- **API Base URL**: http://localhost:8081
- **Swagger UI**: http://localhost:8081/swagger-ui.html
- **Health Check**: http://localhost:8081/actuator/health
- **API Documentation**: http://localhost:8081/v3/api-docs

### Troubleshooting

#### Common Issues
1. **Database Connection Failed**:
   - Verify Oracle service is running
   - Check connection string and credentials
   - Ensure firewall allows port 1521

2. **Port Already in Use**:
   ```bash
   # Check what's using port 8081
   netstat -ano | findstr :8081
   
   # Kill process or change port in application.properties
   server.port=8082
   ```

3. **JWT Token Issues**:
   - Verify JWT secret is properly Base64 encoded
   - Check token expiration settings

4. **Hibernate DDL Issues**:
   - Ensure database user has CREATE TABLE permissions
   - Check Oracle version compatibility
   ```properties
   # For Oracle 19c+
   spring.jpa.database-platform=org.hibernate.dialect.OracleDialect
   ```

#### Log Analysis
```bash
# Enable debug logging temporarily
# Add to application.properties:
debug=true
logging.level.webapp.bankingsystemapi=DEBUG
```

## Future Improvements

### Authentication Enhancements
- **Refresh Tokens**: Implement token refresh mechanism for better user experience
- **Token Revocation**: Add token blacklist functionality for immediate logout
- **Multi-Factor Authentication**: Enhanced security with 2FA support
- **OAuth2 Integration**: Support for third-party authentication providers

### Performance & Scalability
- **Caching Layer**: Redis integration for frequently accessed data
- **Connection Pooling**: Optimized database connection management
- **Async Processing**: Asynchronous audit logging to improve response times
- **Database Sharding**: Horizontal scaling for large user bases

### Advanced Features
- **Fraud Detection**: Machine learning-based transaction monitoring
- **Event-Driven Architecture**: Kafka integration for real-time processing
- **Microservices**: Decomposition into specialized services
- **API Rate Limiting**: Prevent abuse and ensure fair usage

### Compliance & Reporting
- **Regulatory Reporting**: Automated compliance report generation
- **Data Export**: CSV/PDF export for financial statements
- **Backup Automation**: Automated database backup and recovery
- **Disaster Recovery**: Multi-region deployment for high availability

This Banking System API represents a complete, production-ready backend solution that addresses real-world banking requirements while showcasing advanced software engineering principles and best practices.

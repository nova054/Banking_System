import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { InterfaceModeProvider } from "@/contexts/InterfaceModeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// User Dashboard Pages
import UserDashboard from "./pages/dashboard/UserDashboard";
import AccountsPage from "./pages/dashboard/AccountsPage";
import TransactionsPage from "./pages/dashboard/TransactionsPage";
import StatementPage from "./pages/dashboard/StatementPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminAccountsPage from "./pages/admin/AdminAccountsPage";
import AdminTransactionsPage from "./pages/admin/AdminTransactionsPage";
import AdminRegisterUserPage from "./pages/admin/AdminRegisterUserPage";
import AdminAuditPage from "./pages/admin/AdminAuditPage";
import AdminStatementPage from "./pages/admin/AdminStatementPage";

const queryClient = new QueryClient();

// Redirect component based on auth state
function AuthRedirect() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/dashboard"} replace />;
  }
  
  return <Index />;
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <InterfaceModeProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<AuthRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/accounts" element={
                  <ProtectedRoute>
                    <AccountsPage />
                  </ProtectedRoute>
                } />
                <Route path="/transactions" element={
                  <ProtectedRoute>
                    <TransactionsPage />
                  </ProtectedRoute>
                } />
                <Route path="/statement" element={
                  <ProtectedRoute>
                    <StatementPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />

                {/* Admin Protected Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute adminOnly>
                    <AdminUsersPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/accounts" element={
                  <ProtectedRoute adminOnly>
                    <AdminAccountsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/transactions" element={
                  <ProtectedRoute adminOnly>
                    <AdminTransactionsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/register-user" element={
                  <ProtectedRoute adminOnly>
                    <AdminRegisterUserPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/audits" element={
                  <ProtectedRoute adminOnly>
                    <AdminAuditPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/statement" element={
                  <ProtectedRoute adminOnly>
                    <AdminStatementPage />
                  </ProtectedRoute>
                } />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </InterfaceModeProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

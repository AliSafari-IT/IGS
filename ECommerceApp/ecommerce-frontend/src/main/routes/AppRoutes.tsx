import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ProductList, HomePage, CategoryPage, CategoriesPage, ProductDetails, HealthAdvice, AboutUs, ContactUs } from '../../presentation/components';
import Login from '../../presentation/components/auth/Login';
import Register from '../../presentation/components/auth/Register';
import ForgotPassword from '../../presentation/components/auth/ForgotPassword';
import ResetPassword from '../../presentation/components/auth/ResetPassword';
import UserAccount from '../../presentation/components/auth/UserAccount';
import { useAuth } from '../../infrastructure/auth/AuthContext';
import PrivacyPolicy from '../../presentation/docs/legalDocs/PrivacyPolicy';

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while authentication is being checked
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Store the current path for redirect after login
    const currentPath = window.location.pathname;
    sessionStorage.setItem('redirectPath', currentPath);
    // Use Navigate component for smoother in-app navigation
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the protected component
  return element;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="medications" element={<ProductList category="otc" />} />
        <Route path="prescriptions" element={<ProductList category="prescription" />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="category/:categoryId" element={<CategoryPage />} />
        <Route path="product/:productId" element={<ProductDetails />} />
        <Route path="health-advice" element={<HealthAdvice />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="contact-us" element={<ContactUs />} />
        
        {/* Auth routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="account" element={<ProtectedRoute element={<UserAccount />} />} />
        
        {/* Legal docs */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

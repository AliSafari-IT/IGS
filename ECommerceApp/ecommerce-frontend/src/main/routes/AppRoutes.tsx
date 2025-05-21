import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ProductList, HomePage, CategoryPage, ProductDetails, HealthAdvice, AboutUs } from '../../presentation/components';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="medications" element={<ProductList />} />
        <Route path="prescriptions" element={<ProductList category="prescriptions" />} />
        <Route path="categories" element={<Navigate to="/category/1" replace />} />
        <Route path="category/:categoryId" element={<CategoryPage />} />
        <Route path="product/:productId" element={<ProductDetails />} />
        <Route path="health-advice" element={<HealthAdvice />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

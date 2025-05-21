import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout, ProductList, HomePage, CategoryPage, CategoriesPage, ProductDetails, HealthAdvice, AboutUs, ContactUs } from '../../presentation/components';

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
        <Route path="*" element={<div>Page not found</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

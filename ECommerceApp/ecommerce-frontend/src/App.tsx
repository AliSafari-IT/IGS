import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './main/routes/AppRoutes';
import { AuthProvider } from './infrastructure/auth/AuthContext';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

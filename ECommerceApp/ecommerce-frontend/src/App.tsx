import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './main/routes/AppRoutes';
import { AuthProvider } from './infrastructure/auth/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
// import ThemeDebugComponent from './components/ThemeDebugComponent';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <AppRoutes />
              {/* <ThemeDebugComponent /> */}
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

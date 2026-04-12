import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerRegister from './pages/register/OwnerRegister';
import TenantRegister from './pages/register/TenantRegister';
import StaffRegister from './pages/register/StaffRegister';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import ViewTenant from './pages/ViewTenant';
import UpdateTenant from './pages/UpdateTenant';
import ExtendStay from './pages/ExtendStay';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/owner" element={<OwnerRegister />} />
            <Route path="/register/tenant" element={<TenantRegister />} />
            <Route path="/register/staff" element={<StaffRegister />} />
            <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="properties" element={<Properties />} />
              <Route path="rooms" element={<div>Rooms Page</div>} />
              <Route path="tenants" element={<Tenants />} />
              <Route path="tenants/view/:id" element={<ViewTenant />} />
              <Route path="tenants/edit/:id" element={<UpdateTenant />} />
              <Route path="tenants/extend/:id" element={<ExtendStay />} />
              <Route path="payments" element={<div>Payments Page</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/layout';
import { Home, Login, Register, Dashboard, CreateResource, EditResource, ResourceDetail } from './pages';
import { useAuth } from './contexts';

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public Routes */}
        <Route element={<Layout><Home /></Layout>}>
          <Route path="/" />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route 
            path="/dashboard" 
            element={
              <Layout>
                <Dashboard />
              </Layout>
            } 
          />
          <Route 
            path="/resources/new" 
            element={
              <Layout>
                <CreateResource />
              </Layout>
            } 
          />
          <Route 
            path="/resources/:id" 
            element={
              <Layout>
                <ResourceDetail />
              </Layout>
            } 
          />
          <Route 
            path="/resources/:id/edit" 
            element={
              <Layout>
                <EditResource />
              </Layout>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

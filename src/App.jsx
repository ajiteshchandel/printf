import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrderProvider, useOrders } from './context/OrderContext';
import { Sidebar } from './components/Sidebar';
import { HeaderBar } from './components/HeaderBar';
import { DashboardView } from './components/DashboardView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomerLoginPage } from './components/CustomerLoginPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UploadModal } from './components/UploadModal';
import { PrintConfigurator } from './components/PrintConfigurator';
import { OrderSummaryModal } from './components/OrderSummaryModal';
import { AuthModal } from './components/AuthModal';
import { InvoiceModal } from './components/InvoiceModal';
import { Toast } from './components/Toast';

// Component that redirects root '/' or wildcard paths based on role
const RootRedirect = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/customer/dashboard" replace />;
};

const MainLayout = ({ initialTab = 'dashboard' }) => {
  const { currentUser } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    if (location.pathname.startsWith('/admin/dashboard')) {
      setActiveTab('admin_operator');
    } else if (location.pathname.startsWith('/customer/my-orders')) {
      setActiveTab('my_orders');
    } else if (location.pathname.startsWith('/customer/dashboard')) {
      setActiveTab('dashboard');
    } else {
      setActiveTab(initialTab);
    }
  }, [location.pathname, initialTab]);

  // Navigation click handler syncing state & URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'admin_operator') {
      navigate('/admin/dashboard');
    } else if (tab === 'my_orders') {
      navigate('/customer/my-orders');
    } else if (tab === 'dashboard') {
      navigate('/customer/dashboard');
    }
  };

  // Direct Order Submission Flow State
  const [orderStep, setOrderStep] = useState(null);
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [configuredData, setConfiguredData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUploaded = (fileData) => {
    setUploadedFileData(fileData);
    setIsUploadModalOpen(false);
    setOrderStep('config');
  };

  const handleConfigProceed = (configData) => {
    setConfiguredData(configData);
    setOrderStep('summary');
  };

  const handleDirectOrderSubmit = async (finalPayload) => {
    setIsSubmitting(true);
    try {
      await createOrder({
        ...finalPayload,
        paymentStatus: 'Submitted (No Payment Required)'
      });
      setIsSubmitting(false);
      setOrderStep(null);
      handleTabChange('my_orders');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex font-sans text-slate-900 selection:bg-brand-500 selection:text-white">
      
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <HeaderBar
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
        />

        <main className="flex-1">
          {/* Multi-step direct order flow */}
          {orderStep === 'config' && (
            <PrintConfigurator
              uploadedFileData={uploadedFileData}
              onBack={() => setOrderStep(null)}
              onProceedToSummary={handleConfigProceed}
            />
          )}

          {orderStep === 'summary' && (
            <OrderSummaryModal
              configData={configuredData}
              onBack={() => setOrderStep('config')}
              onSubmitOrder={handleDirectOrderSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Regular Dashboard Views */}
          {!orderStep && activeTab === 'dashboard' && (
            <DashboardView
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onViewInvoice={(order) => setActiveInvoiceOrder(order)}
              setActiveTab={handleTabChange}
            />
          )}

          {!orderStep && activeTab === 'my_orders' && (
            <CustomerDashboard
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onViewInvoice={(order) => setActiveInvoiceOrder(order)}
            />
          )}

          {!orderStep && activeTab === 'admin_operator' && (
            currentUser?.role === 'admin' ? (
              <AdminDashboard />
            ) : (
              <div className="p-12 text-center text-slate-400 space-y-4">
                <h2 className="text-2xl font-bold text-rose-400">403 - Access Denied</h2>
                <p className="text-xs">Admin privileges are required to view the Operator Terminal.</p>
                <button
                  onClick={() => handleTabChange('dashboard')}
                  className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
                >
                  Return to Dashboard
                </button>
              </div>
            )
          )}

          {!orderStep && (activeTab === 'profile' || activeTab === 'support') && (
            <div className="p-12 text-center text-slate-500 space-y-4">
              <h2 className="text-2xl font-black text-white capitalize">{activeTab} Settings</h2>
              <p className="text-xs text-slate-400">Your Printf account preferences and support tickets.</p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileUploaded={handleFileUploaded}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <InvoiceModal
        isOpen={!!activeInvoiceOrder}
        order={activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
      />

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Dedicated Authentication Portals */}
            <Route path="/login" element={<CustomerLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Customer Routes */}
            <Route 
              path="/customer/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['customer', 'admin']}>
                  <MainLayout initialTab="dashboard" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/my-orders" 
              element={
                <ProtectedRoute allowedRoles={['customer', 'admin']}>
                  <MainLayout initialTab="my_orders" />
                </ProtectedRoute>
              } 
            />

            {/* Protected Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MainLayout initialTab="admin_operator" />
                </ProtectedRoute>
              } 
            />

            {/* Fallback & Root Redirection */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </OrderProvider>
    </AuthProvider>
  );
}

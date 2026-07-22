import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrderProvider, useOrders } from './context/OrderContext';
import { Sidebar } from './components/Sidebar';
import { HeaderBar } from './components/HeaderBar';
import { DashboardView } from './components/DashboardView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginPage } from './components/LoginPage';
import { UploadModal } from './components/UploadModal';
import { PrintConfigurator } from './components/PrintConfigurator';
import { OrderSummaryModal } from './components/OrderSummaryModal';
import { AuthModal } from './components/AuthModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { InvoiceModal } from './components/InvoiceModal';
import { Toast } from './components/Toast';

const MainContent = () => {
  const { currentUser } = useAuth();
  const { createOrder } = useOrders();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'my_orders' | 'admin_operator' | 'profile' | 'support' | 'login'
  
  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);

  const [mobileOpen, setMobileOpen] = useState(false);

  // Direct Order Submission Flow State
  const [orderStep, setOrderStep] = useState(null); // null | 'config' | 'summary'
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
      setActiveTab('my_orders');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  // If user is logged out or explicitly on the login screen, show the Split-Screen LoginPage!
  if (!currentUser || activeTab === 'login') {
    return (
      <>
        <LoginPage
          onLoginSuccess={() => setActiveTab('dashboard')}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        />
        <SupabaseConfigModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
        />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-surface-bg flex font-sans text-slate-900 selection:bg-brand-500 selection:text-white">
      
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setOrderStep(null);
          setActiveTab(tab);
        }}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <HeaderBar
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
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
              setActiveTab={setActiveTab}
            />
          )}

          {!orderStep && activeTab === 'my_orders' && (
            <CustomerDashboard
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onViewInvoice={(order) => setActiveInvoiceOrder(order)}
            />
          )}

          {!orderStep && activeTab === 'admin_operator' && (
            <AdminDashboard />
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

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
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
        <MainContent />
      </OrderProvider>
    </AuthProvider>
  );
}

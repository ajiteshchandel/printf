import React, { createContext, useContext, useState, useEffect } from 'react';
import { databaseService, storageService } from '../services/db';
import { useAuth } from './AuthContext';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeToast, setActiveToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setActiveToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setActiveToast(null);
    }, 4000);
  };

  // Real-time listener for orders
  useEffect(() => {
    setLoadingOrders(true);
    const unsubscribe = databaseService.subscribeToOrders(
      (updatedOrders) => {
        setOrders(updatedOrders);
        setLoadingOrders(false);
      },
      (error) => {
        console.error("Order context sync error:", error);
        setLoadingOrders(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Filter user orders strictly for current logged-in customer
  const customerOrders = orders.filter(o => 
    (currentUser?.id && o.userId === currentUser.id) || 
    (currentUser?.email && o.customerEmail && o.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  );

  const uploadDocument = async (file) => {
    if (!currentUser) throw new Error("Must be logged in to upload document.");
    setUploadProgress(10);
    try {
      const fileUrl = await storageService.uploadFile(file, currentUser.id, (progress) => {
        setUploadProgress(progress);
      });
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
      return fileUrl;
    } catch (err) {
      setUploadProgress(0);
      showToast("File upload failed: " + err.message, "error");
      throw err;
    }
  };

  const createOrder = async (orderPayload) => {
    try {
      const created = await databaseService.createOrder({
        ...orderPayload,
        userId: currentUser.id,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        customerPhone: currentUser.phone || '',
        paymentStatus: 'Payment Successful',
        orderStatus: 'Order Confirmed'
      });
      showToast(`Order ${created.orderId} created successfully!`, "success");
      return created;
    } catch (err) {
      showToast("Order creation failed: " + err.message, "error");
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, newStatus, adminRemarks = '') => {
    try {
      await databaseService.updateOrderStatus(orderId, newStatus, adminRemarks);
      showToast(`Order ${orderId} updated to "${newStatus}"`, "success");
    } catch (err) {
      showToast("Failed to update status: " + err.message, "error");
      throw err;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        customerOrders,
        loadingOrders,
        uploadProgress,
        activeToast,
        showToast,
        uploadDocument,
        createOrder,
        updateOrderStatus
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within an OrderProvider");
  return context;
};

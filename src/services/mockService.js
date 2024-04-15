// Robust Mock Storage Service for Printf

const INITIAL_USERS = [
  {
    id: 'user_customer_demo',
    name: 'Alex Johnson',
    email: 'customer@printf.com',
    phone: '+1 (555) 234-5678',
    role: 'customer',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 'user_admin_demo',
    name: 'Master Printer Admin',
    email: 'admin@printf.com',
    phone: '+1 (555) 987-6543',
    role: 'admin',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  }
];

const SAMPLE_PDF_BASE64 = "data:application/pdf;base64,JVBERi0xLjQKJSDi48jpCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iaiAyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovQ291bnQgMQovS2lkcyBbMyAwIFJdCj4+CmVuZG9iaiAzIDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMiAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDQgMCBSCj4+CmVuZG9iaiA0IDAgb2JqCjw8Ci9MZW5ndGggNTY+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjEwMCA3MDAgVGQKKFByaW50ZiBEZW1vIERvY3VtZW50IC0gU3VjY2Vzc2Z1bGx5IFVwbG9hZGVkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iaiB0cmFpbGVyCjw8Ci9Sb290IDEgMC BSCj4+CiVFRU9G";

const INITIAL_ORDERS = [
  {
    id: 'PRF-20260721-001',
    orderId: 'PRF-20260721-001',
    userId: 'user_customer_demo',
    customerName: 'Alex Johnson',
    customerEmail: 'customer@printf.com',
    customerPhone: '+1 (555) 234-5678',
    fileName: 'Final_Project_Report_v2.pdf',
    fileUrl: SAMPLE_PDF_BASE64,
    fileType: 'application/pdf',
    fileSize: 1420500, // ~1.4 MB
    copies: 2,
    colorType: 'Color',
    paperSize: 'A4',
    pageRange: 'All Pages (1-12)',
    printSides: 'Double-Sided',
    orientation: 'Portrait',
    instructions: 'Please staple the top left corner and use thick cover paper if available.',
    collectionInstructions: 'Will collect around 5:30 PM today after work.',
    paymentStatus: 'Payment Successful',
    orderStatus: 'Ready for Collection',
    totalAmount: 18.50,
    adminRemarks: 'Document printed cleanly in high quality. Packaged at pickup counter #2.',
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 'PRF-20260722-002',
    orderId: 'PRF-20260722-002',
    userId: 'user_customer_demo',
    customerName: 'Alex Johnson',
    customerEmail: 'customer@printf.com',
    customerPhone: '+1 (555) 234-5678',
    fileName: 'Architecture_Blueprint_A3.pdf',
    fileUrl: SAMPLE_PDF_BASE64,
    fileType: 'application/pdf',
    fileSize: 4890000,
    copies: 5,
    colorType: 'Black & White',
    paperSize: 'A3',
    pageRange: '1-3',
    printSides: 'Single-Sided',
    orientation: 'Landscape',
    instructions: 'Do not fold the paper. Keep flat in protective sleeve.',
    collectionInstructions: 'Express pickup requested.',
    paymentStatus: 'Payment Successful',
    orderStatus: 'Printing',
    totalAmount: 22.00,
    adminRemarks: 'Currently printing on A3 laser printer.',
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString()
  },
  {
    id: 'PRF-20260720-003',
    orderId: 'PRF-20260720-003',
    userId: 'user_customer_demo',
    customerName: 'Alex Johnson',
    customerEmail: 'customer@printf.com',
    customerPhone: '+1 (555) 234-5678',
    fileName: 'Executive_Summary_Slide.pptx',
    fileUrl: SAMPLE_PDF_BASE64,
    fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    fileSize: 2150000,
    copies: 1,
    colorType: 'Color',
    paperSize: 'Letter',
    pageRange: 'All Pages (1-8)',
    printSides: 'Double-Sided',
    orientation: 'Landscape',
    instructions: 'Spiral binding required.',
    collectionInstructions: 'Collected yesterday.',
    paymentStatus: 'Payment Successful',
    orderStatus: 'Completed',
    totalAmount: 14.20,
    adminRemarks: 'Order completed and delivered to customer.',
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600000).toISOString()
  }
];

class MockStorageBus extends EventTarget {}
const bus = new MockStorageBus();

// Initialize local storage if empty
const getStoredOrders = () => {
  const data = localStorage.getItem('printf_mock_orders');
  if (!data) {
    localStorage.setItem('printf_mock_orders', JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_ORDERS;
  }
};

const getStoredUsers = () => {
  const data = localStorage.getItem('printf_mock_users');
  if (!data) {
    localStorage.setItem('printf_mock_users', JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_USERS;
  }
};

const saveOrders = (orders) => {
  localStorage.setItem('printf_mock_orders', JSON.stringify(orders));
  bus.dispatchEvent(new CustomEvent('orders_changed', { detail: orders }));
};

const saveUsers = (users) => {
  localStorage.setItem('printf_mock_users', JSON.stringify(users));
};

export const mockAuth = {
  login: async (email, password) => {
    await new Promise(r => setTimeout(r, 400));
    const users = getStoredUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Auto-create user if demo login
      const isAdmin = email.toLowerCase().includes('admin');
      user = {
        id: 'user_' + Date.now(),
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        phone: '+1 (555) 000-0000',
        role: isAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };
      users.push(user);
      saveUsers(users);
    }
    return user;
  },
  
  register: async ({ name, email, phone, role = 'customer' }) => {
    await new Promise(r => setTimeout(r, 500));
    const users = getStoredUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("User with this email already exists.");
    }
    const user = {
      id: 'user_' + Date.now(),
      name,
      email,
      phone: phone || '+1 (555) 000-0000',
      role,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
    return user;
  }
};

export const mockDb = {
  createOrder: async (orderData) => {
    await new Promise(r => setTimeout(r, 600));
    const orders = getStoredOrders();
    const orderId = `PRF-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      ...orderData,
      id: orderId,
      orderId: orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    saveOrders(orders);
    return newOrder;
  },

  updateOrderStatus: async (orderId, newStatus, adminRemarks = '') => {
    await new Promise(r => setTimeout(r, 300));
    const orders = getStoredOrders();
    const index = orders.findIndex(o => o.id === orderId || o.orderId === orderId);
    if (index === -1) throw new Error("Order not found");
    
    orders[index] = {
      ...orders[index],
      orderStatus: newStatus,
      ...(adminRemarks ? { adminRemarks } : {}),
      updatedAt: new Date().toISOString()
    };
    saveOrders(orders);
    return orders[index];
  },

  subscribeOrders: (callback) => {
    // Initial emit
    callback(getStoredOrders());
    
    const handler = (e) => {
      callback(e.detail);
    };
    bus.addEventListener('orders_changed', handler);
    return () => bus.removeEventListener('orders_changed', handler);
  }
};

export const mockStorage = {
  uploadFile: async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }
};

import { supabase, isSupabaseActive } from './supabaseConfig';
import { mockAuth, mockDb, mockStorage } from './mockService';

// Unified Authentication Service (Supabase + Local Fallback)
export const authService = {
  isSupabase: () => isSupabaseActive,

  register: async ({ name, email, password, phone, role = 'customer' }) => {
    if (isSupabaseActive) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone, role }
        }
      });
      if (error) throw error;
      
      const userData = {
        id: data.user?.id || 'user_' + Date.now(),
        name,
        email,
        phone: phone || '',
        role,
        createdAt: new Date().toISOString()
      };

      try {
        await supabase.from('users').upsert(userData);
      } catch (e) {}

      return userData;
    } else {
      return await mockAuth.register({ name, email, phone, role });
    }
  },

  login: async (email, password) => {
    if (isSupabaseActive) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      const user = data.user;
      return {
        id: user.id,
        name: user.user_metadata?.name || email.split('@')[0],
        email: user.email,
        phone: user.user_metadata?.phone || '',
        role: user.user_metadata?.role || (email.includes('admin') ? 'admin' : 'customer'),
        createdAt: user.created_at
      };
    } else {
      return await mockAuth.login(email, password);
    }
  },

  loginWithGoogle: async () => {
    if (isSupabaseActive) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });
      if (error) throw error;
      return data;
    } else {
      return await mockAuth.login('google_user@printf.com', 'demo123');
    }
  },

  logout: async () => {
    if (isSupabaseActive) {
      await supabase.auth.signOut();
    }
  }
};

// Unified Database Service
export const databaseService = {
  createOrder: async (orderData) => {
    const orderId = `PRF-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100 + Math.random() * 900)}`;
    const payload = {
      ...orderData,
      id: orderId,
      orderId: orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isSupabaseActive) {
      const { error } = await supabase.from('orders').insert([payload]);
      if (error) {
        console.error("❌ Supabase Table Error:", error.message);
        if (error.message.includes('relation "public.orders" does not exist') || error.code === '42P01') {
          alert("⚠️ Supabase Setup Required: The 'orders' table does not exist in your Supabase database yet. Please run the SQL setup script in your Supabase SQL Editor!");
        }
        // Fallback to local store so user isn't blocked
        await mockDb.createOrder(orderData);
        return payload;
      }
      return payload;
    } else {
      return await mockDb.createOrder(orderData);
    }
  },

  updateOrderStatus: async (orderId, newStatus, adminRemarks = '') => {
    if (isSupabaseActive) {
      const updates = {
        orderStatus: newStatus,
        updatedAt: new Date().toISOString()
      };
      if (adminRemarks) updates.adminRemarks = adminRemarks;

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('orderId', orderId);

      if (error) {
        console.error("Supabase status update error:", error.message);
        await mockDb.updateOrderStatus(orderId, newStatus, adminRemarks);
      }
    } else {
      return await mockDb.updateOrderStatus(orderId, newStatus, adminRemarks);
    }
  },

  subscribeToOrders: (onData) => {
    if (isSupabaseActive) {
      supabase
        .from('orders')
        .select('*')
        .order('createdAt', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            onData(data);
          } else {
            mockDb.subscribeOrders(onData);
          }
        });

      const channel = supabase
        .channel('public:orders')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          () => {
            supabase
              .from('orders')
              .select('*')
              .order('createdAt', { ascending: false })
              .then(({ data }) => {
                if (data) onData(data);
              });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      return mockDb.subscribeOrders(onData);
    }
  }
};

// Unified File Storage Service
export const storageService = {
  uploadFile: async (file, userId, onProgress) => {
    const readAsDataUrl = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    };

    if (isSupabaseActive) {
      try {
        if (onProgress) onProgress(30);
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = `${userId || 'guest'}/${fileName}`;

        // Upload to Supabase 'printf' bucket
        const { data, error } = await supabase.storage
          .from('printf')
          .upload(filePath, file, { upsert: true });

        if (error) {
          console.error("❌ Supabase Storage Bucket Error:", error.message);
          if (error.message.includes('bucket not found') || error.message.includes('row-level security')) {
            alert(`⚠️ Supabase Storage Setup Required: ${error.message}. Please make sure the 'printf' bucket exists and has public RLS policies!`);
          }
          if (onProgress) onProgress(100);
          return await readAsDataUrl(file);
        }

        if (onProgress) onProgress(80);

        const { data: publicUrlData } = supabase.storage
          .from('printf')
          .getPublicUrl(filePath);

        if (onProgress) onProgress(100);
        return publicUrlData.publicUrl;
      } catch (err) {
        console.error("Supabase upload exception:", err.message);
        if (onProgress) onProgress(100);
        return await readAsDataUrl(file);
      }
    } else {
      if (onProgress) {
        onProgress(40);
        await new Promise(r => setTimeout(r, 150));
        onProgress(80);
        await new Promise(r => setTimeout(r, 150));
        onProgress(100);
      }
      return await readAsDataUrl(file);
    }
  }
};

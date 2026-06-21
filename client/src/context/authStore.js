import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
      updateUser: (user) => set({ user }),
      
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          if (data.success) {
            set({ user: data.data.user, token: data.data.tokens.accessToken });
            return { success: true };
          }
          return { success: false, message: data.message };
        } finally {
          set({ isLoading: false });
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
          const data = await response.json();
console.log("REGISTER RESPONSE:", data);
          if (data.success) {
            set({ user: data.data.user, token: data.data.tokens.accessToken });
            return { success: true };
          }
          return { success: false, message: data.message };
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: 'auth-storage' }
  )
);
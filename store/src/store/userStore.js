// src/store/userStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'user-storage', // name of the item in localStorage
      partialize: (state) => ({ user: state.user, token: state.token }), // optional: only persist specific keys
    }
  )
);

export default useUserStore;

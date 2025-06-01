import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import useUserStore from './userStore';

const useUserListStore = create(
  persist(
    (set, get) => ({
      users: [],
      storeOwners: [],        // ✅ NEW STATE
      loading: false,
      error: null,

      fetchUsers: async () => {
        const { token } = useUserStore.getState();
        set({ loading: true, error: null });

        try {
          const response = await axios.get('http://localhost:4000/api/admin/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set({ users: response.data, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to fetch users',
            loading: false,
          });
        }
      },

      // ✅ NEW FUNCTION TO FETCH STORE OWNERS
      fetchStoreOwners: async () => {
        const { token } = useUserStore.getState();
        set({ loading: true, error: null });

        try {
          const response = await axios.get('http://localhost:4000/api/admin/store-owners', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Fetched store owners:", response.data);
          set({ storeOwners: response.data, loading: false });
        } catch (error) {
          console.error("Error fetching store owners:", error);
          set({
            error: error.response?.data?.message || 'Failed to fetch store owners',
            loading: false,
          });
        }
      },

      setUsers: (users) => set({ users }),
      clearUsers: () => set({ users: [] }),
    }),
    {
      name: 'user-list-store',
      partialize: (state) => ({
        users: state.users,
        storeOwners: state.storeOwners, 
      }),
    }
  )
);

export default useUserListStore;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import useUserStore from './userStore';

const useStoreStore = create(
  persist(
    (set, get) => ({
      stores: [],
      loading: false,
      error: null,

      fetchStores: async () => {
        const { token } = useUserStore.getState();
        set({ loading: true, error: null });

        try {
          const response = await axios.get('http://localhost:4000/api/admin/stores', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set({ stores: response.data, loading: false });
          console.log('Fetched stores:', response.data);
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to fetch stores',
            loading: false,
          });
          console.error('Error fetching stores:', error);
        }
      },

      setStores: (stores) => set({ stores }),
      clearStores: () => set({ stores: [] }),
    }),
    {
      name: 'store-store', // Key name in localStorage
      partialize: (state) => ({ stores: state.stores }), // Persist only stores array
    }
  )
);

export default useStoreStore;

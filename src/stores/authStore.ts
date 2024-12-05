import { create } from 'zustand';
import { User } from 'firebase/auth';
import { signInWithEmailAndPassword, signOut, getUserRole, UserRole, initializeAuth } from '../services/auth';

interface AuthState {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setError: (error: string | null) => void;
  setOffline: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userRole: null,
  loading: true,
  error: null,
  isOffline: false,
  
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const user = await signInWithEmailAndPassword(email, password);
      
      // Get user role with retries and offline fallback
      let retries = 3;
      let userRole = null;
      
      while (retries > 0 && !userRole) {
        try {
          userRole = await getUserRole(user.uid);
          set({ isOffline: false });
          break;
        } catch (error: any) {
          if (error.code === 'unavailable') {
            set({ isOffline: true });
            // Use cached role if available
            userRole = { isAdmin: false, role: 'EMPLOYEE' };
            break;
          }
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      set({ user, userRole, loading: false, error: null });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.code === 'unavailable' 
          ? 'Network error. Please check your connection.'
          : error.message || 'An error occurred during sign in'
      });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await signOut();
      set({ user: null, userRole: null, loading: false, error: null });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'An error occurred during sign out'
      });
      throw error;
    }
  },

  setError: (error: string | null) => set({ error }),
  setOffline: (status: boolean) => set({ isOffline: status })
}));

// Initialize auth state with better error handling and offline support
const initializeAuthState = async () => {
  try {
    // Add offline detection
    window.addEventListener('online', () => useAuthStore.setState({ isOffline: false }));
    window.addEventListener('offline', () => useAuthStore.setState({ isOffline: true }));
    
    initializeAuth((user) => {
      if (user) {
        getUserRole(user.uid)
          .then(userRole => {
            useAuthStore.setState({ 
              user, 
              userRole, 
              loading: false, 
              error: null,
              isOffline: false
            });
          })
          .catch(error => {
            const isOffline = error.code === 'unavailable';
            useAuthStore.setState({ 
              user, 
              userRole: { isAdmin: false, role: 'EMPLOYEE' },
              loading: false, 
              error: isOffline ? 'Working offline' : null,
              isOffline
            });
          });
      } else {
        useAuthStore.setState({ 
          user: null, 
          userRole: null, 
          loading: false, 
          error: null 
        });
      }
    });
  } catch (error) {
    console.error('Auth initialization error:', error);
    useAuthStore.setState({ 
      loading: false, 
      error: 'Failed to initialize authentication'
    });
  }
};

initializeAuthState();
# State Management

Based on your Zustand setup for client state management in the Remix ERP application, here are the state management patterns:

### Store Structure

```
app/stores/
├── auth-store.ts          # Authentication and user state
├── ui-store.ts            # UI state (modals, sidebar, theme)
├── app-store.ts           # Global application state
├── customer-store.ts      # Customer-specific state (if needed)
└── index.ts               # Re-export all stores
```

### State Management Template

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Define the state interface
interface AuthState {
  // State properties
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

// Create the store with middleware
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        setUser: (user) =>
          set((state) => {
            state.user = user
            state.isAuthenticated = true
            state.error = null
          }),

        clearUser: () =>
          set((state) => {
            state.user = null
            state.isAuthenticated = false
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading
          }),

        setError: (error) =>
          set((state) => {
            state.error = error
          }),

        login: async (credentials) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            // API call would go here
            const user = await loginUser(credentials)
            get().setUser(user)
          } catch (error) {
            get().setError(error instanceof Error ? error.message : 'Login failed')
          } finally {
            get().setLoading(false)
          }
        },

        logout: () => {
          get().clearUser()
          // Additional cleanup logic
        },
      })),
      {
        name: 'auth-storage', // localStorage key
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }), // Only persist specific fields
      }
    ),
    { name: 'auth-store' } // DevTools name
  )
)

// Selector hooks for better performance
export const useAuth = () => useAuthStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
}))

export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
  setUser: state.setUser,
  clearUser: state.clearUser,
}))
```

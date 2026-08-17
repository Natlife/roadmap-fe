import { createContext, useEffect, useReducer, useCallback, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

import authService from '@/services/authService';
import { tokenStore } from '@/api/axios';
import type { AuthContextValue, AuthUser, LoginCredentials } from '@/types';

// --------------------------- reducer ----------------------------------------
interface AuthState {
  isInitialized: boolean;
  isLoggedIn: boolean;
  user: AuthUser | null;
}

type AuthAction =
  | { type: 'INIT'; payload: { isLoggedIn: boolean; user: AuthUser | null } }
  | { type: 'LOGIN'; payload: { user: AuthUser } }
  | { type: 'LOGOUT' };

const initialState: AuthState = { isInitialized: false, isLoggedIn: false, user: null };

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INIT':
      return { isInitialized: true, isLoggedIn: action.payload.isLoggedIn, user: action.payload.user };
    case 'LOGIN':
      return { ...state, isLoggedIn: true, user: action.payload.user };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, user: null };
    default:
      return state;
  }
}

// --------------------------- token validity ---------------------------------
function isTokenValid(token?: string | null): boolean {
  if (!token) return false;
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    return !exp || exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

// --------------------------- context ----------------------------------------
const JWTContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // restore session on first load
  useEffect(() => {
    (async () => {
      const token = tokenStore.get();
      if (isTokenValid(token)) {
        try {
          const user = await authService.getProfile();
          dispatch({ type: 'INIT', payload: { isLoggedIn: true, user } });
          return;
        } catch {
          tokenStore.clear();
        }
      } else {
        tokenStore.clear();
      }
      dispatch({ type: 'INIT', payload: { isLoggedIn: false, user: null } });
    })();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { token, user } = await authService.login(credentials);
    tokenStore.set(token);
    dispatch({ type: 'LOGIN', payload: { user } });
    return user;
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <JWTContext.Provider
      value={{
        isInitialized: state.isInitialized,
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        login,
        logout
      }}
    >
      {children}
    </JWTContext.Provider>
  );
}

export default JWTContext;

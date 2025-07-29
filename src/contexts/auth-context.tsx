import React, { 
  createContext, 
  useState, 
  useEffect, 
  useCallback, 
  useContext, 
  useMemo, 
  ReactNode 
} from 'react';
import apiClient from '../api/apiClient';
import { User } from '../types';

// --- Сервис для работы с токенами ---
const tokenService = {
  getAccess: () => localStorage.getItem('accessToken'),
  getRefresh: () => localStorage.getItem('refreshToken'),
  set: (access: string, refresh: string) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  },
  clear: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// --- Типы и начальное состояние ---
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const INITIAL_STATE: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

// --- Контекст ---
export const AuthContext = createContext<AuthContextType>({
  ...INITIAL_STATE,
  login: async () => { throw new Error('Login function not implemented'); },
  logout: () => {},
  refetchUser: async () => {},
});

// --- Провайдер ---
export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(INITIAL_STATE);

  const setAuthorizationHeader = (token: string | null) => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  };

  const logout = useCallback(() => {
    tokenService.clear();
    setAuthorizationHeader(null);
    setAuthState({ isAuthenticated: false, user: null, isLoading: false });
    // Принудительное перенаправление, если пользователь не на главной странице
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, []);

  const fetchUser = useCallback(async () => {
    const token = tokenService.getAccess();
    if (!token) {
      setAuthState({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }
    setAuthorizationHeader(token);
    try {
      const { data } = await apiClient.get<User>('/users/me/');
      setAuthState({ isAuthenticated: true, user: data, isLoading: false });
    } catch (error) {
      console.error("Не удалось получить пользователя по токену.", error);
      // logout() будет вызван автоматически перехватчиком в apiClient
    }
  }, [logout]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const { data: tokenData } = await apiClient.post('/token/', { email, password });
      tokenService.set(tokenData.access, tokenData.refresh);
      setAuthorizationHeader(tokenData.access);
      
      const { data: userData } = await apiClient.get<User>('/users/me/');
      setAuthState({ isAuthenticated: true, user: userData, isLoading: false });
      return userData;
    } catch (error) {
      // Пробрасываем ошибку дальше, чтобы компонент LoginPage мог ее поймать
      console.error("Ошибка входа:", error);
      throw error;
    }
  };
  
  const contextValue = useMemo(() => ({
    ...authState,
    login,
    logout,
    refetchUser: fetchUser,
  }), [authState, logout, fetchUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Хук для удобного использования контекста ---
export const useAuth = () => useContext(AuthContext);
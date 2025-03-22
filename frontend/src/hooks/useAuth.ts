import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import i18n from '../i18n';

// 定义用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    codeEditorTheme?: string;
    fontSize?: number;
  };
}

// 定义认证上下文类型
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  authError: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithWechat: () => Promise<void>;
  clearAuthError: () => void;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API地址
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api';

// 获取存储的Token
const getStoredToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// 保存Token
const saveToken = (token: string, rememberMe = false): void => {
  if (rememberMe) {
    localStorage.setItem('token', token);
  } else {
    sessionStorage.setItem('token', token);
    localStorage.removeItem('token');
  }
};

// 清除Token
const clearToken = (): void => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

// 认证提供者组件
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 设置认证头
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // 获取用户信息
  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users/me`);
      setUser(response.data);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      clearToken();
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // 初始加载时获取用户信息
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 清除认证错误
  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  // 登录函数
  const login = useCallback(
    async (email: string, password: string, rememberMe = false) => {
      try {
        setLoading(true);
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });

        const { token: newToken, user: userData } = response.data;

        saveToken(newToken, rememberMe);
        setToken(newToken);
        setUser(userData);

        message.success(i18n.t('auth.loginSuccess'));
        return userData;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          i18n.t('auth.errors.loginFailed');
        setAuthError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 注册函数
  const register = useCallback(
    async (email: string, password: string, username: string) => {
      try {
        setLoading(true);
        const response = await axios.post(`${API_URL}/auth/register`, {
          email,
          password,
          username,
        });

        message.success(i18n.t('auth.registerSuccess'));
        return response.data;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          i18n.t('auth.errors.registerFailed');
        setAuthError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 登出函数
  const logout = useCallback(async () => {
    try {
      if (token) {
        await axios.post(`${API_URL}/auth/logout`);
      }
    } catch (error) {
      console.error('登出错误:', error);
    } finally {
      clearToken();
      setToken(null);
      setUser(null);
      navigate('/');
      message.success(i18n.t('auth.logoutSuccess'));
    }
  }, [token, navigate]);

  // 更新用户信息
  const updateUser = useCallback(
    async (userData: Partial<User>) => {
      if (!token || !user) {
        throw new Error(i18n.t('auth.errors.notAuthenticated'));
      }

      try {
        setLoading(true);
        const response = await axios.patch(`${API_URL}/users/${user.id}`, userData);
        setUser({ ...user, ...response.data });
        message.success(i18n.t('auth.profileUpdated'));
        return response.data;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          i18n.t('auth.errors.updateFailed');
        setAuthError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [token, user]
  );

  // GitHub登录
  const loginWithGithub = useCallback(async () => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    // 打开OAuth窗口
    const popup = window.open(
      `${API_URL}/auth/github`,
      'githublogin',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    if (!popup) {
      setAuthError(i18n.t('auth.errors.popupBlocked'));
      return Promise.reject(new Error(i18n.t('auth.errors.popupBlocked')));
    }
    
    return new Promise<void>((resolve, reject) => {
      // 监听消息事件
      const handleMessage = (event: MessageEvent) => {
        // 验证消息源
        if (event.origin !== window.location.origin) return;
        
        // 关闭弹出窗口
        popup.close();
        
        // 移除事件监听器
        window.removeEventListener('message', handleMessage);
        
        const { token: newToken, user: userData, error } = event.data;
        
        if (error) {
          setAuthError(error);
          reject(new Error(error));
          return;
        }
        
        if (newToken && userData) {
          saveToken(newToken, true);
          setToken(newToken);
          setUser(userData);
          message.success(i18n.t('auth.socialLoginSuccess', { provider: 'GitHub' }));
          resolve();
        } else {
          const errorMsg = i18n.t('auth.errors.invalidResponse');
          setAuthError(errorMsg);
          reject(new Error(errorMsg));
        }
      };
      
      window.addEventListener('message', handleMessage);
    });
  }, []);

  // Google登录
  const loginWithGoogle = useCallback(async () => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    // 打开OAuth窗口
    const popup = window.open(
      `${API_URL}/auth/google`,
      'googlelogin',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    if (!popup) {
      setAuthError(i18n.t('auth.errors.popupBlocked'));
      return Promise.reject(new Error(i18n.t('auth.errors.popupBlocked')));
    }
    
    return new Promise<void>((resolve, reject) => {
      // 监听消息事件
      const handleMessage = (event: MessageEvent) => {
        // 验证消息源
        if (event.origin !== window.location.origin) return;
        
        // 关闭弹出窗口
        popup.close();
        
        // 移除事件监听器
        window.removeEventListener('message', handleMessage);
        
        const { token: newToken, user: userData, error } = event.data;
        
        if (error) {
          setAuthError(error);
          reject(new Error(error));
          return;
        }
        
        if (newToken && userData) {
          saveToken(newToken, true);
          setToken(newToken);
          setUser(userData);
          message.success(i18n.t('auth.socialLoginSuccess', { provider: 'Google' }));
          resolve();
        } else {
          const errorMsg = i18n.t('auth.errors.invalidResponse');
          setAuthError(errorMsg);
          reject(new Error(errorMsg));
        }
      };
      
      window.addEventListener('message', handleMessage);
    });
  }, []);

  // 微信登录
  const loginWithWechat = useCallback(async () => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    // 打开OAuth窗口
    const popup = window.open(
      `${API_URL}/auth/wechat`,
      'wechatlogin',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    if (!popup) {
      setAuthError(i18n.t('auth.errors.popupBlocked'));
      return Promise.reject(new Error(i18n.t('auth.errors.popupBlocked')));
    }
    
    return new Promise<void>((resolve, reject) => {
      // 监听消息事件
      const handleMessage = (event: MessageEvent) => {
        // 验证消息源
        if (event.origin !== window.location.origin) return;
        
        // 关闭弹出窗口
        popup.close();
        
        // 移除事件监听器
        window.removeEventListener('message', handleMessage);
        
        const { token: newToken, user: userData, error } = event.data;
        
        if (error) {
          setAuthError(error);
          reject(new Error(error));
          return;
        }
        
        if (newToken && userData) {
          saveToken(newToken, true);
          setToken(newToken);
          setUser(userData);
          message.success(i18n.t('auth.socialLoginSuccess', { provider: '微信' }));
          resolve();
        } else {
          const errorMsg = i18n.t('auth.errors.invalidResponse');
          setAuthError(errorMsg);
          reject(new Error(errorMsg));
        }
      };
      
      window.addEventListener('message', handleMessage);
    });
  }, []);

  // 提供上下文值
  const value = {
    user,
    token,
    loading,
    authError,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    loginWithGithub,
    loginWithGoogle,
    loginWithWechat,
    clearAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 使用Auth钩子
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内使用');
  }
  return context;
};

export default useAuth;
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { FaUser, FaLock, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { SiWechat } from 'react-icons/si';
import { IoMdEye, IoMdEyeOff, IoMdWarning } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    username?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const {
    login,
    register,
    loginWithGithub,
    loginWithGoogle,
    loginWithWechat,
    authError,
    clearAuthError,
  } = useAuth();

  // 重置表单
  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setErrors({});
    clearAuthError();
  }, [clearAuthError]);

  // 模式切换
  const toggleMode = useCallback(() => {
    resetForm();
    setMode((prevMode) => (prevMode === 'login' ? 'register' : 'login'));
  }, [resetForm]);

  // 表单验证
  const validateForm = useCallback(() => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      username?: string;
    } = {};
    let isValid = true;

    // 电子邮件验证
    if (!email.trim()) {
      newErrors.email = t('auth.errors.emailRequired');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.errors.emailInvalid');
      isValid = false;
    }

    // 密码验证
    if (!password) {
      newErrors.password = t('auth.errors.passwordRequired');
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = t('auth.errors.passwordLength');
      isValid = false;
    }

    // 注册时的额外验证
    if (mode === 'register') {
      // 确认密码验证
      if (!confirmPassword) {
        newErrors.confirmPassword = t('auth.errors.confirmPasswordRequired');
        isValid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = t('auth.errors.passwordsNotMatch');
        isValid = false;
      }

      // 用户名验证
      if (!username.trim()) {
        newErrors.username = t('auth.errors.usernameRequired');
        isValid = false;
      } else if (username.length < 3) {
        newErrors.username = t('auth.errors.usernameLength');
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [email, password, confirmPassword, username, mode, t]);

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password, rememberMe);
        onClose();
      } else {
        await register(email, password, username);
        setMode('login');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('认证错误:', error);
      // 错误已在 useAuth 钩子中处理
    } finally {
      setLoading(false);
    }
  };

  // 社交登录处理
  const handleSocialLogin = async (provider: 'github' | 'google' | 'wechat') => {
    clearAuthError();
    setLoading(true);

    try {
      switch (provider) {
        case 'github':
          await loginWithGithub();
          break;
        case 'google':
          await loginWithGoogle();
          break;
        case 'wechat':
          await loginWithWechat();
          break;
      }
      onClose();
    } catch (error) {
      console.error(`${provider} 登录错误:`, error);
      // 错误已在 useAuth 钩子中处理
    } finally {
      setLoading(false);
    }
  };

  // ESC 键关闭模态框
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // 监听模态框开关状态，重置表单
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      resetForm();
    }
  }, [isOpen, initialMode, resetForm]);

  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="login-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="login-modal-container">
        <button className="modal-close-button" onClick={onClose}>
          <MdClose />
        </button>

        <div className="auth-header">
          <h2 className="auth-title">
            {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
          </h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? t('auth.loginSubtitle')
              : t('auth.registerSubtitle')}
          </p>
        </div>

        {(authError || errors.general) && (
          <div className="auth-error">
            <IoMdWarning />
            <span>{authError || errors.general}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* 电子邮件输入 */}
          <div className="form-group">
            <div
              className={`input-wrapper ${errors.email ? 'input-error' : ''}`}
            >
              <div className="input-icon-container">
                <FaUser className="input-icon" />
              </div>
              <div className="input-field-container">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>
            {errors.email && (
              <div className="field-error-message">{errors.email}</div>
            )}
          </div>

          {/* 注册模式下的用户名输入 */}
          {mode === 'register' && (
            <div className="form-group">
              <div
                className={`input-wrapper ${
                  errors.username ? 'input-error' : ''
                }`}
              >
                <div className="input-icon-container">
                  <FaUser className="input-icon" />
                </div>
                <div className="input-field-container">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('auth.usernamePlaceholder')}
                    disabled={loading}
                    autoComplete="username"
                  />
                </div>
              </div>
              {errors.username && (
                <div className="field-error-message">{errors.username}</div>
              )}
            </div>
          )}

          {/* 密码输入 */}
          <div className="form-group">
            <div
              className={`input-wrapper ${
                errors.password ? 'input-error' : ''
              }`}
            >
              <div className="input-icon-container">
                <FaLock className="input-icon" />
              </div>
              <div className="input-field-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  disabled={loading}
                  autoComplete={
                    mode === 'login' ? 'current-password' : 'new-password'
                  }
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </button>
              </div>
            </div>
            {errors.password && (
              <div className="field-error-message">{errors.password}</div>
            )}
          </div>

          {/* 注册模式下的确认密码输入 */}
          {mode === 'register' && (
            <div className="form-group">
              <div
                className={`input-wrapper ${
                  errors.confirmPassword ? 'input-error' : ''
                }`}
              >
                <div className="input-icon-container">
                  <FaLock className="input-icon" />
                </div>
                <div className="input-field-container">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && (
                <div className="field-error-message">
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          )}

          {/* 登录选项 */}
          {mode === 'login' && (
            <div className="form-actions">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                {t('auth.rememberMe')}
              </label>
              <a href="#forgot-password" className="forgot-password">
                {t('auth.forgotPassword')}
              </a>
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading
              ? t('auth.processingText')
              : mode === 'login'
              ? t('auth.loginButton')
              : t('auth.registerButton')}
          </button>
        </form>

        <div className="auth-divider">
          <span>{t('auth.orDivider')}</span>
        </div>

        <div className="social-login">
          <button
            type="button"
            className="social-button github"
            onClick={() => handleSocialLogin('github')}
            disabled={loading}
          >
            <FaGithub />
            <span>GitHub</span>
          </button>
          <button
            type="button"
            className="social-button google"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <FcGoogle />
            <span>Google</span>
          </button>
          <button
            type="button"
            className="social-button wechat"
            onClick={() => handleSocialLogin('wechat')}
            disabled={loading}
          >
            <SiWechat />
            <span>微信</span>
          </button>
        </div>

        <div className="auth-footer">
          {mode === 'login' ? (
            <p>
              {t('auth.noAccountText')}{' '}
              <a href="#register" onClick={(e) => {
                e.preventDefault();
                toggleMode();
              }}>
                {t('auth.registerNowText')}
              </a>
            </p>
          ) : (
            <p>
              {t('auth.hasAccountText')}{' '}
              <a href="#login" onClick={(e) => {
                e.preventDefault();
                toggleMode();
              }}>
                {t('auth.loginNowText')}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Sun,
  Moon,
  KeyRound,
  Compass,
  Phone,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

export const AuthView: React.FC = () => {
  const {
    login,
    signup,
    userAccounts,
    language,
    setLanguage,
    theme,
    toggleTheme,
    t,
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Login form state
  const [loginId, setLoginId] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('+974 ');
  const [signupRole, setSignupRole] = useState<UserRole>('transit-agent');
  const [signupDept, setSignupDept] = useState('Airport Desk Operations');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Status feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isRtl = language === 'ar';

  const handleQuickLogin = (username: string, pass: string) => {
    setLoginId(username);
    setLoginPassword(pass);
    setErrorMessage(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginId.trim()) {
      setErrorMessage(
        isRtl ? 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني.' : 'Please enter your username or email.'
      );
      return;
    }
    if (!loginPassword) {
      setErrorMessage(
        isRtl ? 'يرجى إدخال كلمة المرور.' : 'Please enter your password.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(loginId, loginPassword);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
      } else {
        setSuccessMessage(
          isRtl ? `مرحباً بك مجدداً، ${res.user?.name}!` : `Welcome back, ${res.user?.name}!`
        );
      }
    }, 400);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!signupName.trim()) {
      setErrorMessage(isRtl ? 'يرجى كتابة الاسم الكامل.' : 'Please enter your full name.');
      return;
    }
    if (!signupUsername.trim()) {
      setErrorMessage(isRtl ? 'يرجى اختيار اسم مستخدم.' : 'Please choose a username.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMessage(isRtl ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
      return;
    }
    if (!signupPassword || signupPassword.length < 4) {
      setErrorMessage(
        isRtl ? 'يجب أن لا تقل كلمة المرور عن 4 أحرف.' : 'Password must be at least 4 characters.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = signup({
        name: signupName.trim(),
        username: signupUsername.trim(),
        email: signupEmail.trim(),
        password: signupPassword.trim(),
        role: signupRole,
        phone: signupPhone.trim(),
        department: signupDept,
        status: 'active',
      });
      setIsLoading(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Registration failed.');
      } else {
        setSuccessMessage(
          isRtl ? 'تم إنشاء الحساب بنجاح وتسجيل الدخول!' : 'Account created successfully! Logging in...'
        );
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <BrandLogo size="md" variant="full" />

        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition"
            title="Switch Language / تبديل اللغة"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'en' ? 'العربية' : 'EN'}</span>
          </button>

          {/* Theme Switch */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition"
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </header>

      {/* Main Content Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          {/* Card Container */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            {/* Header / Mode Switcher */}
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <span>
                    {authMode === 'login'
                      ? isRtl ? 'تسجيل دخول المنظومة' : 'Operations ERP Portal'
                      : isRtl ? 'إنشاء حساب موظف جديد' : 'New Staff Registration'}
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {authMode === 'login'
                    ? isRtl ? 'أدخل اسم المستخدم وكلمة المرور للوصول إلى لوحة التحكم' : 'Authenticate credentials for Hamad Airport & Qatar Tourism operations'
                    : isRtl ? 'سجّل حساباً معتمداً للوصول إلى مهام وكاونترات المنظومة' : 'Register an authorized staff profile with department role assignment'}
                </p>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="flex items-center p-1 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isRtl ? 'دخول' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isRtl ? 'تسجيل جديد' : 'Sign Up'}
                </button>
              </div>
            </div>

            {/* Error or Success feedback banners */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Quick Demo Credentials Bar (Click to Auto-fill) */}
            <div className="mb-6 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <KeyRound className="w-3 h-3 text-amber-400" />
                  <span>{isRtl ? 'حسابات تجريبية سريعة بنقرة واحدة (ID & Pass):' : 'One-Click Demo Credentials (ID & Password):'}</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">5 Accounts</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {userAccounts.map((acc) => {
                  const isSelected = loginId === acc.username;
                  const getRoleBadge = (role: UserRole) => {
                    switch (role) {
                      case 'super-admin': return '👑 Admin';
                      case 'operations-manager': return '⚡ Ops';
                      case 'transit-agent': return '🏢 Agent';
                      case 'driver-guide': return '🚗 Driver';
                      case 'finance-accountant': return '💰 Finance';
                      default: return '👤 Staff';
                    }
                  };

                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleQuickLogin(acc.username, acc.password)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-xs'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                      title={`Username: ${acc.username} | Password: ${acc.password} (${acc.role})`}
                    >
                      <span className="font-bold text-[10px] text-amber-400">{getRoleBadge(acc.role)}</span>
                      <span className="font-mono">{acc.username}</span>
                      <span className="text-[9px] text-slate-500 font-mono">({acc.password})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ======================= LOGIN FORM ======================= */}
            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                {/* ID / Username / Email Field */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    {isRtl ? 'اسم المستخدم أو البريد الإلكتروني (ID / Username / Email)' : 'Account ID / Username / Email'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="e.g. admin or admin@artrust.qa"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2.5 pl-9 rtl:pl-3 rtl:pr-9 text-white font-mono text-xs outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-300 font-medium">
                      {isRtl ? 'كلمة المرور (Password)' : 'Account Password'}
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {isRtl ? 'افتراضي: admin123' : 'Default: admin123'}
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2.5 pl-9 rtl:pl-3 rtl:pr-9 pr-10 rtl:pr-3 rtl:pl-10 text-white font-mono text-xs outline-none transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1 text-slate-400">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
                    />
                    <span>{isRtl ? 'تذكر بياناتي في هذا المتصفح' : 'Remember credentials on this terminal'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginId('admin');
                      setLoginPassword('admin123');
                    }}
                    className="text-blue-400 hover:underline text-[11px]"
                  >
                    {isRtl ? 'إعادة ضبط للافتراضي' : 'Reset to Admin'}
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="animate-pulse">{isRtl ? 'جارٍ التحقق...' : 'Verifying credentials...'}</span>
                  ) : (
                    <>
                      <span>{isRtl ? 'دخول لوحة العمليات' : 'Sign In to Operations Console'}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* ======================= SIGNUP FORM ======================= */
              <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      {isRtl ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Jassem Al-Bader"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-white font-medium outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      {isRtl ? 'اسم المستخدم (User ID)' : 'Unique Username / ID'}
                    </label>
                    <input
                      type="text"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      placeholder="e.g. jassem"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-white font-mono outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      {isRtl ? 'البريد الإلكتروني الرسمي' : 'Official Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="user@artrust.qa"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 pl-8 rtl:pl-3 rtl:pr-8 text-white font-mono outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      {isRtl ? 'رقم الهاتف / الجوال' : 'Contact Mobile / Phone'}
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        placeholder="+974 5511 2233"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 pl-8 rtl:pl-3 rtl:pr-8 text-white font-mono outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      {isRtl ? 'كلمة المرور الجديدة' : 'Set Password'}
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 pl-8 rtl:pl-3 rtl:pr-8 pr-9 rtl:pr-3 rtl:pl-9 text-white font-mono outline-none transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      {isRtl ? 'الدور الوظيفي والصلاحيات' : 'Assigned Role & Scope'}
                    </label>
                    <select
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value as UserRole)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-white font-medium outline-none transition cursor-pointer"
                    >
                      <option value="transit-agent">Transit Agent (Airport Counter & Hotels)</option>
                      <option value="operations-manager">Operations / Branch Manager</option>
                      <option value="driver-guide">Chauffeur / Licensed Tour Guide</option>
                      <option value="finance-accountant">Finance / Treasury Accountant</option>
                      <option value="super-admin">Super Admin (Executive Access)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {isRtl ? 'القسم / المحطة التشغيلية' : 'Department or Station'}
                  </label>
                  <input
                    type="text"
                    value={signupDept}
                    onChange={(e) => setSignupDept(e.target.value)}
                    placeholder="e.g. Airport Arrivals Counter 4"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-white font-medium outline-none transition"
                  />
                </div>

                {/* Submit Signup */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="animate-pulse">{isRtl ? 'جارٍ إنشاء الحساب...' : 'Creating profile...'}</span>
                  ) : (
                    <>
                      <span>{isRtl ? 'إنشاء الحساب ودخول المنظومة فوراً' : 'Create Account & Launch Console'}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Bottom Security Info Footer */}
          <div className="mt-6 text-center text-[11px] text-slate-500 space-y-1">
            <p>
              AR Trust Travel & Tourism W.L.L. · Qatar Tourism DMC Accreditation #QTA-QA-8819
            </p>
            <p className="text-[10px] text-slate-600 font-mono">
              Protected by Qatar Central Bank (QCB) compliance standards & 256-bit encrypted credential audit.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

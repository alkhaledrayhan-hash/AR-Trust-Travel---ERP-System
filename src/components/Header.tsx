import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Globe,
  Sun,
  Moon,
  Check,
  TrendingUp,
  X,
  ExternalLink,
  DollarSign,
  ShieldCheck,
  ChevronDown,
  PanelLeftOpen,
  PanelLeftClose,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Currency, UserRole } from '../types';
import { ROLE_CONFIGS } from '../data/mockData';

export const Header: React.FC = () => {
  const {
    currentRole,
    setRole,
    roleConfig,
    language,
    setLanguage,
    currency,
    setCurrency,
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    rates,
    notifications,
    markNotificationRead,
    openModal,
    sidebarOpen,
    toggleSidebar,
    t,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const currencyOptions: Currency[] = ['QAR', 'USD', 'EUR', 'GBP'];

  const roleList: UserRole[] = [
    'super-admin',
    'operations-manager',
    'transit-agent',
    'driver-guide',
    'finance-accountant',
  ];

  return (
    <header className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors select-none">
      {/* Zone 0: Left Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 flex items-center justify-center border border-slate-200/60 dark:border-slate-800"
        title={
          sidebarOpen
            ? language === 'ar'
              ? 'تصغير إلى لوحة أيقونات'
              : 'Collapse Sidebar to Icon Panel'
            : language === 'ar'
            ? 'توسيع القائمة الجانبية'
            : 'Expand Full Sidebar'
        }
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? (
          <PanelLeftClose className="w-4.5 h-4.5" />
        ) : (
          <PanelLeftOpen className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
        )}
      </button>

      {/* Zone 1: Global Search & Context */}
      <div className="flex-1 max-w-sm relative">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all rtl:pl-8 rtl:pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rtl:right-auto rtl:left-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Zone 2: Live FX Ticker (QAR, USD, EUR, GBP) */}
      <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="text-[11px] uppercase tracking-wide font-mono">QCB Peg:</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">1 USD =</span>
            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{rates.USD} QAR</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">1 EUR =</span>
            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{rates.EUR} QAR</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">1 GBP =</span>
            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{rates.GBP} QAR</span>
          </div>
        </div>
      </div>

      {/* Zone 3: Role Switcher, Currency, Language, Theme, Notifications & New Booking CTA */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Prominent Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100/60 text-xs font-bold text-blue-800 dark:text-blue-300 transition-all cursor-pointer shadow-xs"
            title="Switch Operational Role & Scope"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="truncate max-w-[130px] font-sans">
              {roleConfig.title}
            </span>
            <ChevronDown className="w-3 h-3 text-blue-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-76 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50">
              <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>Select Operational Role</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">5 Scopes</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-1">
                {roleList.map((r) => {
                  const cfg = ROLE_CONFIGS[r];
                  const isSelected = currentRole === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left rtl:text-right p-2.5 rounded-xl transition flex flex-col gap-0.5 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{cfg.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {cfg.scopeSummary}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Currency Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            title="Display Currency"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-mono">{currency}</span>
          </button>

          {showCurrencyDropdown && (
            <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-1.5 w-32 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-40">
              <div className="px-3 py-1 text-[10px] uppercase font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-700">
                Display Base
              </div>
              {currencyOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCurrency(c);
                    setShowCurrencyDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left rtl:text-right hover:bg-slate-100 dark:hover:bg-slate-700 ${
                    currency === c
                      ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="font-mono">{c}</span>
                  {currency === c && <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
          title="Switch Language / تبديل اللغة"
        >
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-semibold">{language === 'en' ? 'العربية' : 'EN'}</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title={theme === 'dark' ? 'Switch to Clean Light Mode' : 'Switch to Dark Slate Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors relative"
            title="Operational Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-84 sm:w-96 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {language === 'ar' ? 'تنبيهات العمليات المباشرة' : 'Live Flight & Desk Alerts'}
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                    {unreadCount} new
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer ${
                      !notif.read ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-xs">
                        {language === 'ar' ? notif.titleAr : notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {notif.time}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {language === 'ar' ? notif.messageAr : notif.message}
                    </p>
                    {notif.actionLabel && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        <span>{notif.actionLabel}</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Action: + New Booking */}
        <button
          onClick={() => openModal('new-booking')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('newBooking')}</span>
        </button>
      </div>
    </header>
  );
};

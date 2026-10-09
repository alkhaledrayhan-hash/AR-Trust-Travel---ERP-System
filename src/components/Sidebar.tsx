import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck2,
  Store,
  Compass,
  Receipt,
  BadgePercent,
  Coins,
  Settings,
  ShieldCheck,
  FileText,
  Clock,
  UserCheck,
  Users,
  ChevronDown,
  Building2,
  Sparkles,
  DollarSign,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './common/BrandLogo';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    roleConfig,
    currentRole,
    setRole,
    language,
    expenses,
    sidebarOpen,
    toggleSidebar,
    t,
  } = useApp();

  const isRtl = language === 'ar';
  const pendingExpensesCount = expenses.filter((e) => e.status === 'Pending Review').length;

  const allNavItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, badge: 'Live' },
    { id: 'bookings', label: language === 'ar' ? 'حجوزات المنظومة الموحدة' : 'Unified Bookings Engine', icon: CalendarCheck2, count: 8 },
    { id: 'guests', label: language === 'ar' ? 'سجل الضيوف والمسافرين' : 'Guests & Travelers', icon: UserCheck, count: 7 },
    { id: 'services', label: language === 'ar' ? 'باقات وخدمات الرحلات' : 'Tour Services & Packages', icon: Sparkles, badge: currentRole === 'super-admin' ? 'Admin' : undefined },
    { id: 'pos', label: t('pos'), icon: Store, badge: 'HIA C4' },
    { id: 'employees', label: language === 'ar' ? 'الكوادر وموظفو الكاونترات' : 'Employees & Desk Staff', icon: Users, badge: 'Staff' },
    { id: 'dispatch', label: language === 'ar' ? 'توجيه الأسطول والكوادر' : 'Fleet & Field Ops', icon: Compass, count: 28 },
    { id: 'eod', label: t('eod'), icon: Receipt, alert: true },
    { id: 'payroll', label: language === 'ar' ? 'الرواتب والعمولات' : 'Salaries & Commissions', icon: BadgePercent },
    {
      id: 'expenses',
      label: language === 'ar' ? 'مصروفات الشركة واعتماداتها' : 'Company Expenses & Approvals',
      icon: DollarSign,
      count: pendingExpensesCount > 0 ? pendingExpensesCount : undefined,
      badge: pendingExpensesCount > 0 ? `${pendingExpensesCount} Review` : undefined,
      alert: pendingExpensesCount > 0,
    },
    { id: 'ledger', label: language === 'ar' ? 'الخزينة متعددة العملات' : 'Multi-Currency Treasury', icon: Coins },
    { id: 'reports', label: language === 'ar' ? 'التقارير والأرباح (P&L)' : 'Financial Reports & P&L', icon: FileText, badge: '68% Margin' },
    { id: 'audit-logs', label: language === 'ar' ? 'سجلات النظام والمراقبة' : 'System Logs & Audit', icon: ShieldCheck },
    { id: 'driver-portal', label: language === 'ar' ? 'لوحة مهام السائق' : 'Driver Mission Console', icon: Compass, badge: 'Driver' },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  // Filter based on active role permissions
  const visibleNavItems = allNavItems.filter((item) =>
    roleConfig.allowedTabs.includes(item.id) ||
    (currentRole === 'super-admin' &&
      (item.id === 'reports' ||
        item.id === 'audit-logs' ||
        item.id === 'services' ||
        item.id === 'employees' ||
        item.id === 'guests' ||
        item.id === 'expenses'))
  );

  // Helper for role initials in compact mode
  const getRoleInitials = () => {
    switch (currentRole) {
      case 'super-admin':
        return 'SA';
      case 'operations-manager':
        return 'OM';
      case 'transit-agent':
        return 'TA';
      case 'driver-guide':
        return 'DG';
      case 'finance-accountant':
        return 'FA';
      default:
        return 'AR';
    }
  };

  return (
    <aside
      className={`shrink-0 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out select-none relative z-20 ${
        sidebarOpen ? 'w-72' : 'w-[72px]'
      }`}
    >
      {/* -------------------- EXPANDED SIDEBAR (sidebarOpen = true) -------------------- */}
      {sidebarOpen ? (
        <>
          <div className="flex-1 flex flex-col min-h-0">
            {/* Brand Header with Logo and Collapse Toggle */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
              <div className="flex items-center justify-between">
                <BrandLogo size="md" variant="full" />
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title={isRtl ? 'تصغير إلى لوحة أيقونات' : 'Collapse to icon rail panel'}
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Current Role Indicator Pill */}
              <div className="mt-3.5 flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <div className="truncate">
                    <span className="font-extrabold text-[11px] block text-slate-900 dark:text-white truncate">
                      {roleConfig.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block truncate">
                      {roleConfig.userDisplayName}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold shrink-0">
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                          isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-blue-500/80 text-white'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.count && (
                        <span
                          className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded-full ${
                            isActive
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                      {item.alert && (
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isActive ? 'bg-amber-300' : 'bg-amber-500 animate-pulse'
                          }`}
                          title="Action Pending"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Scope Summary & License Card */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 shrink-0">
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">
                Scope & Permissions
              </span>
              <p className="mt-0.5 text-[10px] text-slate-600 dark:text-slate-300 leading-tight">
                {roleConfig.scopeSummary}
              </p>
            </div>

            <div className="text-center">
              <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                AR Trust Travel · QTA DMC Lic. #QA-7819
              </p>
            </div>
          </div>
        </>
      ) : (
        /* -------------------- COLLAPSED ICON RAIL PANEL (sidebarOpen = false) -------------------- */
        <>
          <div className="flex-1 flex flex-col items-center min-h-0">
            {/* Compact Header with Emblem and Expand Toggle */}
            <div className="w-full py-3 px-2 border-b border-slate-100 dark:border-slate-800/80 flex flex-col items-center gap-2 shrink-0">
              <button
                onClick={toggleSidebar}
                className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200/60 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors shadow-xs group"
                title={isRtl ? 'توسيع القائمة الجانبية الكاملة' : 'Expand full sidebar'}
                aria-label="Expand sidebar"
              >
                <span className="font-extrabold font-mono text-xs tracking-tighter text-blue-700 dark:text-blue-300 group-hover:scale-105 transition-transform">
                  AR
                </span>
              </button>

              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={isRtl ? 'توسيع القائمة' : 'Expand Sidebar'}
              >
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Navigation Icons Stack */}
            <nav className="flex-1 w-full overflow-y-auto py-2.5 px-2 flex flex-col items-center gap-1.5">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <div key={item.id} className="relative group/tooltip flex justify-center w-full">
                    <button
                      onClick={() => setActiveTab(item.id)}
                      title={`${item.label} ${item.badge ? `[${item.badge}]` : ''}`}
                      aria-label={item.label}
                      className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400/40'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-transform group-hover/tooltip:scale-110 ${
                          isActive ? 'text-white' : ''
                        }`}
                      />

                      {/* Pending alert pulse dot */}
                      {item.alert && (
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                      )}

                      {/* Item count badge indicator */}
                      {item.count && !item.alert && (
                        <span className="absolute -top-1 -right-1 px-1 py-0.2 min-w-4 text-[9px] font-mono font-bold rounded-full bg-blue-600 text-white ring-2 ring-white dark:ring-slate-900 shadow-xs flex items-center justify-center">
                          {item.count}
                        </span>
                      )}

                      {/* Small badge dot if badge is present */}
                      {item.badge && !item.count && !item.alert && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </button>

                    {/* Floating Hover Tooltip Flyout */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-xs font-medium rounded-xl shadow-2xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-150 z-50 whitespace-nowrap border border-slate-700/80 flex items-center gap-2.5 ${
                        isRtl
                          ? 'right-full mr-2.5 shadow-[-4px_0_15px_rgba(0,0,0,0.3)]'
                          : 'left-full ml-2.5 shadow-[4px_0_15px_rgba(0,0,0,0.3)]'
                      }`}
                    >
                      <span className="font-semibold">{item.label}</span>

                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300 border border-blue-400/30">
                          {item.badge}
                        </span>
                      )}

                      {item.count && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">
                          {item.count}
                        </span>
                      )}

                      {/* Pointer triangle */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 border-4 border-transparent ${
                          isRtl
                            ? 'left-full border-l-slate-900/95 dark:border-l-slate-800/95'
                            : 'right-full border-r-slate-900/95 dark:border-r-slate-800/95'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Compact Footer with Role Avatar and Expand Prompt */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col items-center gap-2 shrink-0">
            <div className="relative group/role flex justify-center w-full">
              <button
                onClick={toggleSidebar}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200 hover:ring-2 hover:ring-blue-500/50 transition-all"
                title={`${roleConfig.title} - ${roleConfig.userDisplayName}`}
              >
                {getRoleInitials()}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </button>

              {/* Floating Tooltip for Active Role */}
              <div
                className={`absolute bottom-0 px-3 py-2 bg-slate-900 text-white text-xs rounded-xl shadow-xl opacity-0 pointer-events-none group-hover/role:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700 ${
                  isRtl ? 'right-full mr-2.5' : 'left-full ml-2.5'
                }`}
              >
                <div className="font-bold">{roleConfig.title}</div>
                <div className="text-[10px] text-slate-400 font-mono">{roleConfig.userDisplayName}</div>
                <div className="text-[9px] text-blue-400 mt-1">
                  {isRtl ? 'انقر لتوسيع الشريط الجانبي' : 'Click to expand sidebar'}
                </div>
              </div>
            </div>

            <button
              onClick={toggleSidebar}
              className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title={isRtl ? 'توسيع القائمة الجانبية' : 'Expand Sidebar'}
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </aside>
  );
};


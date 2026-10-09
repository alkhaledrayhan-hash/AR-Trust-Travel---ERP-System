import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_AIRPORT_DESKS,
  INITIAL_BOOKINGS,
  INITIAL_COMMISSION_RULES,
  INITIAL_DRIVERS,
  INITIAL_EMPLOYEES,
  INITIAL_FINANCE_EXPENSES,
  INITIAL_FLIGHTS,
  INITIAL_GUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PACKAGE_CATEGORIES,
  INITIAL_RATES,
  INITIAL_SALARY_RECORDS,
  INITIAL_SHIFT_DRAWER,
  INITIAL_SYSTEM_LOGS,
  INITIAL_TOUR_GUIDES,
  ROLE_CONFIGS,
  TOUR_PACKAGES,
  SystemAuditLog,
} from '../data/mockData';
import {
  AirportDesk,
  Booking,
  CommissionRule,
  Currency,
  Driver,
  Employee,
  EmployeeMonthlyRecord,
  ExchangeRates,
  FinanceExpense,
  FlightInfo,
  Guest,
  Language,
  NotificationItem,
  RoleConfig,
  SalaryRecord,
  ShiftDrawer,
  Theme,
  TourGuide,
  TourPackage,
  UserRole,
} from '../types';
import { DateFilterState, DEFAULT_DATE_FILTER } from '../utils/dateFilter';

interface AppContextType {
  // Role & Permissions
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  roleConfig: RoleConfig;

  // Language & Currency & Theme
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  theme: Theme;
  toggleTheme: () => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Date & Year Filter Engine
  dateFilter: DateFilterState;
  setDateFilter: React.Dispatch<React.SetStateAction<DateFilterState>>;
  resetDateFilter: () => void;

  // FX Rates & Conversion
  rates: ExchangeRates;
  updateRates: (newRates: Partial<ExchangeRates>) => void;
  convertAmount: (amountQAR: number, targetCurrency?: Currency) => { amount: number; formatted: string; symbol: string };

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateBookingStatus: (id: string, status: Booking['qrStatus']) => void;
  toggleVoucherSent: (id: string) => void;

  // Drivers & Fleet Management
  drivers: Driver[];
  updateDriverStatus: (id: string, status: Driver['status'], mission?: string) => void;
  addDriver: (driver: Omit<Driver, 'id'>) => { success: boolean; error?: string; driver?: Driver };
  updateDriver: (id: string, updated: Partial<Driver>) => { success: boolean; error?: string };
  deleteDriver: (id: string) => { success: boolean; error?: string };

  // Tour Guides & Scheduling
  tourGuides: import('../types').TourGuide[];
  assignDriverAndGuide: (bookingId: string, driverId: string, guideId?: string) => void;
  approveBooking: (bookingId: string) => void;

  // Salary & Commission Engine
  salaryRecords: import('../types').SalaryRecord[];
  updateSalaryPayout: (id: string, status: import('../types').SalaryRecord['payoutStatus']) => void;
  commissionRules: import('../types').CommissionRule[];
  updateCommissionRule: (id: string, rateValue: number) => void;

  // Tour Services, Packages & Dynamic Categories
  packages: TourPackage[];
  packageCategories: string[];
  addPackage: (pkg: Omit<TourPackage, 'id'>) => { success: boolean; error?: string; pkg?: TourPackage };
  updatePackage: (id: string, updated: Partial<TourPackage>) => { success: boolean; error?: string };
  deletePackage: (id: string) => { success: boolean; error?: string };
  addPackageCategory: (categoryName: string) => { success: boolean; error?: string };
  deletePackageCategory: (categoryName: string) => { success: boolean; error?: string };

  // Airport Desks Management
  airportDesks: AirportDesk[];
  activeDeskId: string;
  setActiveDeskId: (id: string) => void;
  activeDesk: AirportDesk;
  addAirportDesk: (desk: Omit<AirportDesk, 'id'>) => { success: boolean; error?: string; desk?: AirportDesk };
  updateAirportDesk: (id: string, updated: Partial<AirportDesk>) => { success: boolean; error?: string };
  deleteAirportDesk: (id: string) => { success: boolean; error?: string };

  // Employees, Staff & Performance Salary Engine
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => { success: boolean; error?: string; employee?: Employee };
  updateEmployee: (id: string, updated: Partial<Employee>) => { success: boolean; error?: string };
  deleteEmployee: (id: string) => { success: boolean; error?: string };
  recordEmployeeSalaryPayment: (employeeId: string, month: string, amountPaid: number, notes?: string) => { success: boolean; error?: string };
  addEmployeeExpense: (employeeId: string, month: string, expenseAmount: number, description: string) => { success: boolean; error?: string };

  // Guests & Passengers Directory
  guests: Guest[];
  addGuest: (guest: Omit<Guest, 'id'>) => { success: boolean; error?: string; guest?: Guest };
  updateGuest: (id: string, updated: Partial<Guest>) => { success: boolean; error?: string };
  deleteGuest: (id: string) => { success: boolean; error?: string };

  // Flights
  flights: FlightInfo[];

  // Shift & Drawer
  shiftDrawer: ShiftDrawer;
  updateDrawerCash: (currency: Currency, amount: number) => void;
  closeShiftAndAudit: (countedCash: { QAR: number; USD: number; EUR: number; GBP: number }, notes: string) => void;

  // Finance & Accounting / Company Expenses
  expenses: FinanceExpense[];
  addExpense: (expense: Omit<FinanceExpense, 'id'>) => { success: boolean; error?: string; expense?: FinanceExpense };
  updateExpense: (id: string, updated: Partial<FinanceExpense>) => { success: boolean; error?: string };
  updateExpenseStatus: (id: string, status: FinanceExpense['status'], approvalNotes?: string) => { success: boolean; error?: string };
  deleteExpense: (id: string) => { success: boolean; error?: string };
  systemLogs: SystemAuditLog[];
  addAuditLog: (action: string, category: SystemAuditLog['category'], details: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;

  // Modals
  activeModal: string | null;
  modalData: any;
  openModal: (modal: string, data?: any) => void;
  closeModal: () => void;

  // Sidebar Layout
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;

  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Translations dictionary for bilingual support (English & Arabic)
const TRANSLATIONS: Record<string, { en: string; ar: string }> = {
  // Brand & Nav
  brandName: { en: 'AR Trust Travel & Tourism', ar: 'الرائد للثقة للسياحة والسفر' },
  brandSubtitle: { en: 'Qatar Luxury DMC & Airport Concierge', ar: 'الدوحة - إدارة الوجهات واستقبال المطار' },
  dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  bookings: { en: 'Bookings & Calendar', ar: 'الحجوزات والتقويم' },
  pos: { en: 'Airport Desk POS', ar: 'نقطة بيع كاونتر المطار' },
  dispatch: { en: 'Dispatch & Field Ops', ar: 'العمليات والتوجيه الميداني' },
  eod: { en: 'Shift Reconciliation (EOD)', ar: 'مطابقة الوردية وإغلاق اليوم' },
  payroll: { en: 'Commission & Payroll', ar: 'العمولات والرواتب' },
  ledger: { en: 'Multi-Currency Ledger', ar: 'دفتر الأستاذ متعدد العملات' },
  'audit-logs': { en: 'System Logs & Audit', ar: 'سجلات النظام والمراقبة' },
  'payout-approvals': { en: 'Payout Approvals', ar: 'اعتمادات الصرف والعمولات' },
  expenses: { en: 'Expense Journal', ar: 'يومية المصروفات التشغيلية' },
  'tax-reports': { en: 'Tax & QTA Reports', ar: 'التقارير الضريبية والسياحية' },
  'driver-portal': { en: 'Driver Mission Console', ar: 'لوحة مهام السائق الميدانية' },
  employees: { en: 'Employees & Desk Staff', ar: 'الكوادر وموظفو الكاونترات' },
  guests: { en: 'Guests & Travelers', ar: 'سجل الضيوف والمسافرين' },
  'airport-desks': { en: 'Airport Desks & Counters', ar: 'كاونترات ومكاتب المطار' },
  'agent-bookings': { en: 'Counter Vouchers', ar: 'قسائم الكاونتر الصادرة' },
  'agent-drawer': { en: 'My Cash Drawer', ar: 'صندوقي النقدي الفعلي' },
  'agent-commission': { en: 'My Commission Log', ar: 'سجل عمولاتي اليومية' },
  settings: { en: 'Settings', ar: 'الإعدادات' },

  // Header
  searchPlaceholder: { en: 'Search PNR, passenger name, flight number, voucher...', ar: 'ابحث برقم الحجز، اسم الراكب، رقم الرحلة، القسيمة...' },
  newBooking: { en: '+ New Booking', ar: '+ حجز جديد' },
  liveFx: { en: 'Live FX', ar: 'أسعار الصرف' },
  activeBranch: { en: 'Hamad Int’l Airport (HIA) - Counter 4', ar: 'مطار حمد الدولي - كاونتر 4' },

  // Roles
  roleSuperAdmin: { en: 'Super Admin', ar: 'المدير العام' },
  roleOpsManager: { en: 'Branch / Ops Manager', ar: 'مدير العمليات' },
  roleTransitAgent: { en: 'Transit Desk Agent', ar: 'موظف الكاونتر' },
  roleDriverGuide: { en: 'Driver / Guide Portal', ar: 'تطبيق السائق' },
  roleAccountant: { en: 'Finance / Accountant', ar: 'المحاسب المالي' },

  // KPIs
  kpiDailyBookings: { en: 'Total Daily Bookings', ar: 'إجمالي حجوزات اليوم' },
  kpiDailyRevenue: { en: 'Multi-Currency Revenue', ar: 'الإيراد متعدد العملات' },
  kpiActiveDrivers: { en: 'Active Drivers Dispatched', ar: 'السائقون والمرشدون بالخدمة' },
  kpiPendingShifts: { en: 'Airport Desk Shift Status', ar: 'حالة ورديات كاونترات المطار' },
  vsYesterday: { en: 'vs. yesterday', ar: 'مقارنة بالأمس' },
  onDuty: { en: 'on duty & active', ar: 'على رأس العمل' },
  closingIn: { en: 'closing in 1h 05m', ar: 'ينتهي خلال ساعة و 5 دقائق' },

  // Widgets
  flightScheduleTitle: { en: 'Live Passenger Transit & Flight Radar (Hamad Int’l DOH)', ar: 'حركة الترانزيت واستقبال الرحلات (مطار حمد الدولي)' },
  bookingTrendsTitle: { en: 'Booking Volume Trends (24h Timeline)', ar: 'مؤشر حركة الحجوزات (خلال 24 ساعة)' },
  airportDeskBookings: { en: 'Live Airport Desk Bookings & QR Verification', ar: 'حجوزات كاونتر المطار والتحقق الفوري بالرمز' },
  eodReconTitle: { en: 'Daily EOD Shift Reconciliation (Counter 4)', ar: 'مطابقة الصندوق والوردية اليومية (كاونتر 4)' },

  // Table Headers
  pnrVoucher: { en: 'PNR / Voucher', ar: 'رقم الحجز / القسيمة' },
  passenger: { en: 'Passenger & Flight', ar: 'الراكب وتفاصيل الرحلة' },
  package: { en: 'Package / Service', ar: 'البرنامج / الخدمة' },
  amount: { en: 'Amount Total', ar: 'المبلغ الإجمالي' },
  driverVehicle: { en: 'Assigned Chauffeur', ar: 'السائق والمركبة' },
  status: { en: 'QR Check-in', ar: 'حالة التحقق' },
  actions: { en: 'Actions', ar: 'إجراءات' },

  // Statuses
  'checked-in': { en: 'Checked In', ar: 'تم التحقق' },
  'in-transit': { en: 'In Transit', ar: 'في الطريق' },
  scheduled: { en: 'Scheduled', ar: 'مجدول' },
  completed: { en: 'Completed', ar: 'مكتمل' },
  cancelled: { en: 'Cancelled', ar: 'ملغى' },

  // EOD
  countedCash: { en: 'Counted Drawer Cash', ar: 'النقد الفعلي بالصندوق' },
  systemExpectedText: { en: 'System Expected Cash', ar: 'النقد المسجل بالنظام' },
  cardPosTotal: { en: 'POS Card Terminals', ar: 'أجهزة الدفع الإلكتروني' },
  paymentLinks: { en: 'Online / Payment Links', ar: 'روابط الدفع الرقمية' },
  variance: { en: 'Drawer Variance', ar: 'فارق الصندوق' },
  balanced: { en: 'Exact Match · Balanced', ar: 'مطابق تماماً · متوازن' },
  closeShiftBtn: { en: 'Close Shift & Audit (EOD)', ar: 'إغلاق الوردية والمصادقة' },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active Role state: default to 'super-admin'
  const [currentRole, setCurrentRole] = useState<UserRole>('super-admin');
  const roleConfig = ROLE_CONFIGS[currentRole];

  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('QAR');
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('artrust_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // fallback
    }
    return 'dark';
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rates, setRates] = useState<ExchangeRates>(INITIAL_RATES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [flights] = useState<FlightInfo[]>(INITIAL_FLIGHTS);
  const [shiftDrawer, setShiftDrawer] = useState<ShiftDrawer>(INITIAL_SHIFT_DRAWER);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [expenses, setExpenses] = useState<FinanceExpense[]>(INITIAL_FINANCE_EXPENSES);
  const [systemLogs, setSystemLogs] = useState<SystemAuditLog[]>(INITIAL_SYSTEM_LOGS);
  const [tourGuides, setTourGuides] = useState<TourGuide[]>(INITIAL_TOUR_GUIDES);
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>(INITIAL_SALARY_RECORDS);
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>(INITIAL_COMMISSION_RULES);
  const [packages, setPackages] = useState<TourPackage[]>(TOUR_PACKAGES);
  const [packageCategories, setPackageCategories] = useState<string[]>(INITIAL_PACKAGE_CATEGORIES);

  // Airport Desks, Employees & Guests State
  const [airportDesks, setAirportDesks] = useState<AirportDesk[]>(INITIAL_AIRPORT_DESKS);
  const [activeDeskId, setActiveDeskId] = useState<string>('desk-hia-01');
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);

  // Date & Year Filter state
  const [dateFilter, setDateFilter] = useState<DateFilterState>(DEFAULT_DATE_FILTER);
  const resetDateFilter = () => setDateFilter(DEFAULT_DATE_FILTER);

  const activeDesk = airportDesks.find((d) => d.id === activeDeskId) || airportDesks[0];

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  // Sidebar Layout state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    // Update document dir and lang attribute
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    // Synchronize dark class on document root element for Tailwind CSS
    try {
      localStorage.setItem('artrust_theme', theme);
    } catch {
      // ignore
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const targetConfig = ROLE_CONFIGS[newRole];
    setActiveTab(targetConfig.defaultTab);

    // Add log
    addAuditLog('Role Context Switched', 'SECURITY', `User role switched to ${targetConfig.title}`);
  };

  const t = (key: string): string => {
    if (TRANSLATIONS[key]) {
      return TRANSLATIONS[key][language] || TRANSLATIONS[key].en;
    }
    return key;
  };

  const getCurrencyRate = (curr: Currency): number => {
    if (curr === 'USD') return rates.USD;
    if (curr === 'EUR') return rates.EUR;
    if (curr === 'GBP') return rates.GBP;
    return 1;
  };

  const updateRates = (newRates: Partial<ExchangeRates>) => {
    setRates((prev) => ({
      ...prev,
      ...newRates,
      lastUpdated: 'Manual Super Admin Override',
    }));
    addAuditLog('Exchange Rates Modified', 'FINANCE', `Rates updated: USD: ${newRates.USD ?? rates.USD}, EUR: ${newRates.EUR ?? rates.EUR}`);
  };

  const convertAmount = (amountQAR: number, targetCurrency: Currency = currency) => {
    let rate = 1;
    let symbol = 'QAR';

    switch (targetCurrency) {
      case 'USD':
        rate = 1 / rates.USD;
        symbol = '$';
        break;
      case 'EUR':
        rate = 1 / rates.EUR;
        symbol = '€';
        break;
      case 'GBP':
        rate = 1 / rates.GBP;
        symbol = '£';
        break;
      case 'QAR':
      default:
        rate = 1;
        symbol = language === 'ar' ? 'ر.ق' : 'QAR';
        break;
    }

    const calculated = amountQAR * rate;
    return {
      amount: calculated,
      formatted: `${symbol} ${calculated.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
      symbol,
    };
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const bookingDateStr = `Oct 09, 2026, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newBooking: Booking = {
      ...bookingData,
      id: `bkg-${Date.now()}`,
      createdAt: bookingDateStr,
    };
    setBookings((prev) => [newBooking, ...prev]);

    // 1. Synchronize Shift Drawer
    if (bookingData.paymentMethod === 'Cash') {
      const rate = getCurrencyRate(bookingData.paymentCurrency);
      const addedAmount = bookingData.totalQAR / rate;
      setShiftDrawer((prev) => ({
        ...prev,
        currentCashDrawer: {
          ...prev.currentCashDrawer,
          [bookingData.paymentCurrency]: (prev.currentCashDrawer[bookingData.paymentCurrency] || 0) + addedAmount,
        },
        systemExpected: {
          ...prev.systemExpected,
          [bookingData.paymentCurrency]: (prev.systemExpected[bookingData.paymentCurrency] || 0) + addedAmount,
        },
        transactionsCount: prev.transactionsCount + 1,
      }));
    } else if (bookingData.paymentMethod === 'POS Card') {
      setShiftDrawer((prev) => ({
        ...prev,
        posCardTotalQAR: prev.posCardTotalQAR + bookingData.totalQAR,
        transactionsCount: prev.transactionsCount + 1,
      }));
    }

    // 2. Synchronize Airport Desk cash balance
    if (bookingData.paymentMethod === 'Cash') {
      setAirportDesks((prev) =>
        prev.map((d) =>
          d.id === activeDeskId
            ? { ...d, currentDrawerCashQAR: (d.currentDrawerCashQAR || 0) + bookingData.totalQAR }
            : d
        )
      );
    }

    // 3. Synchronize Employee Performance, Target Count & Commission
    const targetDesk = airportDesks.find((d) => d.id === activeDeskId);
    const responsibleEmpId = targetDesk?.assignedEmployeeId || 'emp-102';
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === responsibleEmpId) {
          const currentMonthName = 'October 2026';
          let monthFound = false;
          const updatedMonthly = emp.monthlyRecords.map((mRec) => {
            if (mRec.month === currentMonthName) {
              monthFound = true;
              const newCompleted = mRec.completedServices + 1;
              const isMet = newCompleted >= mRec.targetServices;
              const excess = Math.max(0, newCompleted - mRec.targetServices);
              const commRate = mRec.commissionRatePerService || emp.commissionPerServiceQAR || 35;
              const commissionEarned = excess * commRate;
              const gross = mRec.baseSalaryQAR + commissionEarned + mRec.expensesReimbursedQAR - mRec.deductionsQAR;
              const due = Math.max(0, gross - mRec.amountPaidQAR);
              return {
                ...mRec,
                completedServices: newCompleted,
                targetMet: isMet,
                excessServices: excess,
                commissionEarnedQAR: commissionEarned,
                grossPayableQAR: gross,
                amountDueQAR: due,
                notes: `Auto-synced: ${newCompleted} services recorded.`,
              };
            }
            return mRec;
          });

          if (!monthFound) {
            updatedMonthly.unshift({
              month: currentMonthName,
              baseSalaryQAR: emp.baseSalaryMonthlyQAR,
              targetServices: emp.monthlyServiceTarget,
              completedServices: 1,
              targetMet: 1 >= emp.monthlyServiceTarget,
              excessServices: Math.max(0, 1 - emp.monthlyServiceTarget),
              commissionRatePerService: emp.commissionPerServiceQAR,
              commissionEarnedQAR: 0,
              expensesReimbursedQAR: 0,
              deductionsQAR: 0,
              grossPayableQAR: emp.baseSalaryMonthlyQAR,
              amountPaidQAR: 0,
              amountDueQAR: emp.baseSalaryMonthlyQAR,
              status: 'Pending Payout',
              notes: 'Initial monthly booking logged.',
            });
          }

          return { ...emp, monthlyRecords: updatedMonthly };
        }
        return emp;
      })
    );

    // 4. Synchronize Guest Directory (Passenger ledger)
    setGuests((prev) => {
      const matchIndex = prev.findIndex(
        (g) =>
          (bookingData.passengerPhone && g.phone === bookingData.passengerPhone) ||
          (bookingData.passengerEmail && g.email.toLowerCase() === bookingData.passengerEmail.toLowerCase()) ||
          g.name.toLowerCase() === bookingData.passengerName.toLowerCase()
      );

      if (matchIndex >= 0) {
        const existing = prev[matchIndex];
        const updatedGuest: Guest = {
          ...existing,
          totalBookings: existing.totalBookings + 1,
          totalSpentQAR: existing.totalSpentQAR + bookingData.totalQAR,
          lastArrivalAirport: bookingData.arrivalAirport || existing.lastArrivalAirport,
          lastFlight: bookingData.flightNumber || existing.lastFlight,
          lastTripDate: 'Oct 09, 2026',
          bookingIds: [newBooking.id, ...existing.bookingIds.filter((bId) => bId !== newBooking.id)],
        };
        const nextList = [...prev];
        nextList[matchIndex] = updatedGuest;
        return nextList;
      } else {
        const newGuest: Guest = {
          id: `gst-${Date.now()}`,
          name: bookingData.passengerName,
          nationality: bookingData.nationality || 'International',
          phone: bookingData.passengerPhone || '+974 5500 0000',
          email: bookingData.passengerEmail || `${bookingData.passengerName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@traveler.com`,
          vipTier: bookingData.totalQAR >= 2000 || bookingData.paxCount >= 4 ? 'VIP Gold' : 'Standard',
          totalBookings: 1,
          totalSpentQAR: bookingData.totalQAR,
          lastArrivalAirport: bookingData.arrivalAirport || 'Hamad Int’l Airport (DOH)',
          lastFlight: bookingData.flightNumber || 'QR 138',
          lastTripDate: 'Oct 09, 2026',
          specialPreferences: bookingData.notes || 'Counter booking',
          bookingIds: [newBooking.id],
        };
        return [newGuest, ...prev];
      }
    });

    // 5. Synchronize Driver Trip and Mission
    if (bookingData.driverId) {
      setDrivers((prev) =>
        prev.map((drv) =>
          drv.id === bookingData.driverId
            ? {
                ...drv,
                totalTripsToday: drv.totalTripsToday + 1,
                activePassengers: (drv.activePassengers || 0) + (bookingData.paxCount || 1),
                currentMission: `Assigned to ${bookingData.passengerName} (${bookingData.flightNumber || 'Arrival'})`,
              }
            : drv
        )
      );
    }

    addAuditLog(
      'New Booking Created & Synced',
      'POS',
      `Issued voucher ${newBooking.pnr} for ${newBooking.passengerName} (${newBooking.totalQAR} QAR). Synced with Shift Drawer, Desk, Guest profile and Staff performance.`
    );

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking['qrStatus']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, qrStatus: status } : b))
    );
  };

  const toggleVoucherSent = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, voucherSent: !b.voucherSent } : b))
    );
  };

  const updateDriverStatus = (id: string, status: Driver['status'], mission?: string) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, currentMission: mission || d.currentMission } : d))
    );
  };

  const addDriver = (driverData: Omit<Driver, 'id'>): { success: boolean; error?: string; driver?: Driver } => {
    if (currentRole !== 'super-admin' && currentRole !== 'operations-manager') {
      const errorMsg = 'Access Denied: Only Super Admin or Operations Manager has permission to register fleet vehicles.';
      addAuditLog('Unauthorized Fleet Addition Attempt', 'SECURITY', `Role "${roleConfig.title}" attempted to add vehicle "${driverData.vehicle}"`);
      return { success: false, error: errorMsg };
    }
    const newDriver: Driver = {
      ...driverData,
      id: `drv-${Date.now()}`,
      rating: driverData.rating || 5.0,
      totalTripsToday: driverData.totalTripsToday || 0,
      activePassengers: driverData.activePassengers || 0,
    };
    setDrivers((prev) => [newDriver, ...prev]);
    addAuditLog('New Fleet Vehicle & Chauffeur Added', 'DISPATCH', `${roleConfig.title} registered ${newDriver.vehicle} (${newDriver.plateNumber}) driven by ${newDriver.name}`);
    return { success: true, driver: newDriver };
  };

  const updateDriver = (id: string, updated: Partial<Driver>): { success: boolean; error?: string } => {
    if (currentRole !== 'super-admin' && currentRole !== 'operations-manager') {
      const errorMsg = 'Access Denied: Only Super Admin or Operations Manager has permission to modify fleet details.';
      addAuditLog('Unauthorized Fleet Edit Attempt', 'SECURITY', `Role "${roleConfig.title}" attempted to edit driver #${id}`);
      return { success: false, error: errorMsg };
    }
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)));
    addAuditLog('Fleet Vehicle / Chauffeur Updated', 'DISPATCH', `${roleConfig.title} updated vehicle/chauffeur record #${id}`);
    return { success: true };
  };

  const deleteDriver = (id: string): { success: boolean; error?: string } => {
    if (currentRole !== 'super-admin' && currentRole !== 'operations-manager') {
      const errorMsg = 'Access Denied: Only Super Admin or Operations Manager has permission to decommission fleet vehicles.';
      addAuditLog('Unauthorized Fleet Deletion Attempt', 'SECURITY', `Role "${roleConfig.title}" attempted to delete driver #${id}`);
      return { success: false, error: errorMsg };
    }
    setDrivers((prev) => prev.filter((d) => d.id !== id));
    addAuditLog('Fleet Vehicle Decommissioned', 'DISPATCH', `${roleConfig.title} decommissioned driver/vehicle #${id}`);
    return { success: true };
  };

  const assignDriverAndGuide = (bookingId: string, driverId: string, guideId?: string) => {
    const drv = drivers.find((d) => d.id === driverId);
    const gd = tourGuides.find((g) => g.id === guideId);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              driverId,
              driverName: drv ? drv.name : b.driverName,
              driverVehicle: drv ? `${drv.vehicle} (${drv.plateNumber})` : b.driverVehicle,
              driverPhone: drv ? drv.phone : b.driverPhone,
              guideId: guideId || b.guideId,
              guideName: gd ? gd.name : b.guideName,
              qrStatus: 'driver-assigned',
            }
          : b
      )
    );
    addAuditLog('Driver/Guide Scheduled', 'DISPATCH', `Assigned ${drv?.name} and ${gd?.name || 'Guide'} to PNR booking`);
  };

  const approveBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, qrStatus: 'confirmed' }
          : b
      )
    );
    addAuditLog('Web Booking Approved', 'DISPATCH', `Web Integration API reservation ${bookingId} approved`);
  };

  const updateSalaryPayout = (id: string, status: SalaryRecord['payoutStatus']) => {
    setSalaryRecords((prev) =>
      prev.map((s) => (s.id === id ? { ...s, payoutStatus: status } : s))
    );
    addAuditLog('Salary Payout Status Updated', 'FINANCE', `Salary record #${id} updated to ${status}`);
  };

  const updateCommissionRule = (id: string, rateValue: number) => {
    setCommissionRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, rateValue } : r))
    );
    addAuditLog('Commission Rate Altered', 'FINANCE', `Commission rule #${id} updated to ${rateValue}`);
  };

  const updateDrawerCash = (curr: Currency, amount: number) => {
    setShiftDrawer((prev) => ({
      ...prev,
      currentCashDrawer: {
        ...prev.currentCashDrawer,
        [curr]: amount,
      },
    }));
  };

  const closeShiftAndAudit = (countedCash: { QAR: number; USD: number; EUR: number; GBP: number }, notes: string) => {
    setShiftDrawer((prev) => ({
      ...prev,
      currentCashDrawer: countedCash,
      status: 'Audited & Closed',
    }));

    const auditNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Shift Audit Closed & Filed (Z-Report)',
      titleAr: 'تم إغلاق الوردية والمصادقة (تقرير Z)',
      message: `Shift HIA-CTR-04 closed by ${roleConfig.userDisplayName}. Notes: ${notes || 'Zero discrepancy.'}`,
      messageAr: `تم إغلاق كاونتر 4. الملاحظات: ${notes || 'مطابقة تامة'}`,
      time: 'Just now',
      type: 'cash',
      read: false,
    };
    setNotifications((prev) => [auditNotif, ...prev]);

    addAuditLog(
      'EOD Shift Audited & Locked',
      'FINANCE',
      `Counter 4 drawer audited. Net cash: QAR ${countedCash.QAR.toLocaleString()}`
    );
  };

  const addExpense = (expenseData: Omit<FinanceExpense, 'id'>): { success: boolean; error?: string; expense?: FinanceExpense } => {
    if (!expenseData.description || !expenseData.amountQAR) {
      return { success: false, error: 'Please provide description and valid amount in QAR.' };
    }
    const newExp: FinanceExpense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
    addAuditLog(
      'Company Expense Filed',
      'FINANCE',
      `${expenseData.category}: QAR ${Number(expenseData.amountQAR).toLocaleString()} (${expenseData.description}) filed by ${expenseData.requestedBy || roleConfig.userDisplayName}`
    );
    return { success: true, expense: newExp };
  };

  const updateExpense = (id: string, updated: Partial<FinanceExpense>): { success: boolean; error?: string } => {
    const existing = expenses.find((e) => e.id === id);
    if (!existing) return { success: false, error: 'Expense record not found' };

    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
    addAuditLog('Expense Record Modified', 'FINANCE', `Expense #${id} modified by ${roleConfig.userDisplayName}`);
    return { success: true };
  };

  const updateExpenseStatus = (id: string, status: FinanceExpense['status'], approvalNotes?: string): { success: boolean; error?: string } => {
    const target = expenses.find((e) => e.id === id);
    if (!target) return { success: false, error: 'Expense record not found.' };

    const approvedBy = (status === 'Approved' || status === 'Paid') ? roleConfig.userDisplayName : target.approvedBy;
    const approvedAt = (status === 'Approved' || status === 'Paid' || status === 'Rejected') ? 'Just now' : target.approvedAt;

    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status,
              approvedBy,
              approvedAt,
              approvalNotes: approvalNotes !== undefined ? approvalNotes : e.approvalNotes,
            }
          : e
      )
    );

    // Create notification if status changes to Approved, Paid, or Rejected
    if (status === 'Approved' || status === 'Rejected' || status === 'Paid') {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Expense ${status}: ${target.category}`,
        titleAr: `تم تحديث حالة المصروف: ${target.category}`,
        message: `Expense #${target.id} (${target.amountQAR.toLocaleString()} QAR) was marked as "${status}" by ${roleConfig.userDisplayName}.${approvalNotes ? ` Notes: ${approvalNotes}` : ''}`,
        messageAr: `المصروف #${target.id} بقيمة ${target.amountQAR.toLocaleString()} ر.ق تم اعتماده/تحديثه إلى "${status}"`,
        time: 'Just now',
        type: 'cash',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    addAuditLog(
      `Expense Status Updated: ${status}`,
      'FINANCE',
      `Expense #${id} (${target.amountQAR.toLocaleString()} QAR - ${target.category}) marked as "${status}" by ${roleConfig.userDisplayName}.${approvalNotes ? ` Remarks: ${approvalNotes}` : ''}`
    );

    return { success: true };
  };

  const deleteExpense = (id: string): { success: boolean; error?: string } => {
    const target = expenses.find((e) => e.id === id);
    if (!target) return { success: false, error: 'Expense not found' };

    setExpenses((prev) => prev.filter((e) => e.id !== id));
    addAuditLog('Expense Record Deleted', 'FINANCE', `Expense #${id} (${target.amountQAR} QAR) removed by ${roleConfig.userDisplayName}`);
    return { success: true };
  };

  const addAuditLog = (action: string, category: SystemAuditLog['category'], details: string) => {
    const newLog: SystemAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      actor: roleConfig.userDisplayName,
      role: roleConfig.title,
      action,
      category,
      details,
      status: 'SUCCESS',
    };
    setSystemLogs((prev) => [newLog, ...prev]);
  };

  const addPackage = (pkgData: Omit<TourPackage, 'id'>): { success: boolean; error?: string; pkg?: TourPackage } => {
    if (currentRole !== 'super-admin') {
      const errorMsg = 'Access Denied: Only Super Admin (Sheikh Nasser Al-Thani) has permission to add new tour services.';
      addAuditLog('Unauthorized Service Addition Attempt', 'SECURITY', `Role "${roleConfig.title}" attempted to add package "${pkgData.name}"`);
      return { success: false, error: errorMsg };
    }
    const newPkg: TourPackage = {
      ...pkgData,
      id: `pkg-${Date.now()}`,
    };
    setPackages((prev) => [newPkg, ...prev]);
    addAuditLog('New Tour Service Created', 'SYSTEM', `Super Admin added package "${newPkg.name}" (${newPkg.priceQAR} QAR)`);
    return { success: true, pkg: newPkg };
  };

  const updatePackage = (id: string, updated: Partial<TourPackage>): { success: boolean; error?: string } => {
    if (currentRole !== 'super-admin') {
      const errorMsg = 'Access Denied: Only Super Admin has permission to modify tour services.';
      addAuditLog('Unauthorized Service Edit Attempt', 'SECURITY', `Role "${roleConfig.title}" attempted to edit package #${id}`);
      return { success: false, error: errorMsg };
    }
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    addAuditLog('Tour Service Modified', 'SYSTEM', `Super Admin updated package #${id}`);
    return { success: true };
  };

  const deletePackage = (id: string): { success: boolean; error?: string } => {
    if (currentRole !== 'super-admin') {
      const errorMsg = 'Access Denied: Only Super Admin has permission to delete tour services.';
      addAuditLog('Unauthorized Service Deletion Attempt', 'SECURITY', `Role "${roleConfig.title}" attempted to delete package #${id}`);
      return { success: false, error: errorMsg };
    }
    setPackages((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('Tour Service Deleted', 'SYSTEM', `Super Admin deleted package #${id}`);
    return { success: true };
  };

  const addPackageCategory = (categoryName: string): { success: boolean; error?: string } => {
    if (currentRole !== 'super-admin') {
      const errorMsg = 'Access Denied: Only Super Admin (Sheikh Nasser Al-Thani) has permission to create tour package categories.';
      addAuditLog('Unauthorized Category Creation Attempt', 'SECURITY', `Role "${roleConfig.title}" attempted to create category "${categoryName}"`);
      return { success: false, error: errorMsg };
    }
    const trimmed = categoryName.trim();
    if (!trimmed) {
      return { success: false, error: 'Category name cannot be empty.' };
    }
    if (packageCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      return { success: false, error: `Category "${trimmed}" already exists in the catalog.` };
    }
    setPackageCategories((prev) => [...prev, trimmed]);
    addAuditLog('Tour Package Category Created', 'SYSTEM', `Super Admin created category "${trimmed}"`);
    return { success: true };
  };

  const deletePackageCategory = (categoryName: string): { success: boolean; error?: string } => {
    if (currentRole !== 'super-admin') {
      const errorMsg = 'Access Denied: Only Super Admin has permission to delete tour package categories.';
      addAuditLog('Unauthorized Category Deletion Attempt', 'SECURITY', `Role "${roleConfig.title}" attempted to delete category "${categoryName}"`);
      return { success: false, error: errorMsg };
    }
    // Check if any package is currently using this category
    const countUsing = packages.filter((p) => p.category.toLowerCase() === categoryName.toLowerCase()).length;
    if (countUsing > 0) {
      return { success: false, error: `Cannot delete category "${categoryName}" because ${countUsing} active package(s) are assigned to it.` };
    }
    setPackageCategories((prev) => prev.filter((c) => c.toLowerCase() !== categoryName.toLowerCase()));
    addAuditLog('Tour Package Category Deleted', 'SYSTEM', `Super Admin removed category "${categoryName}"`);
    return { success: true };
  };

  // Airport Desks Management
  const addAirportDesk = (deskData: Omit<AirportDesk, 'id'>): { success: boolean; error?: string; desk?: AirportDesk } => {
    if (!deskData.deskName.trim()) {
      return { success: false, error: 'Desk name is required.' };
    }
    const newDesk: AirportDesk = {
      ...deskData,
      id: `desk-${Date.now()}`,
    };
    setAirportDesks((prev) => [...prev, newDesk]);
    addAuditLog('New Airport Desk Added', 'DISPATCH', `Added desk "${newDesk.deskName}" at ${newDesk.airportName} assigned to ${newDesk.assignedEmployeeName}`);
    return { success: true, desk: newDesk };
  };

  const updateAirportDesk = (id: string, updated: Partial<AirportDesk>): { success: boolean; error?: string } => {
    setAirportDesks((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updated } : d))
    );
    // Sync with employee if assignedEmployeeId is modified
    if (updated.assignedEmployeeId) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === updated.assignedEmployeeId
            ? {
                ...emp,
                assignedDeskId: id,
                assignedDeskName: updated.deskName || emp.assignedDeskName,
              }
            : emp
        )
      );
    }
    addAuditLog('Airport Desk Updated', 'DISPATCH', `Updated airport desk #${id} and synced with assigned staff`);
    return { success: true };
  };

  const deleteAirportDesk = (id: string): { success: boolean; error?: string } => {
    if (airportDesks.length <= 1) {
      return { success: false, error: 'At least one airport desk must remain active.' };
    }
    setAirportDesks((prev) => prev.filter((d) => d.id !== id));
    if (activeDeskId === id) {
      const remaining = airportDesks.filter((d) => d.id !== id);
      if (remaining.length > 0) setActiveDeskId(remaining[0].id);
    }
    addAuditLog('Airport Desk Removed', 'DISPATCH', `Removed airport desk #${id}`);
    return { success: true };
  };

  // Employees Management
  const addEmployee = (empData: Omit<Employee, 'id'>): { success: boolean; error?: string; employee?: Employee } => {
    if (!empData.name.trim()) {
      return { success: false, error: 'Employee name is required.' };
    }
    const newId = `emp-${Math.floor(100 + Math.random() * 900)}`;
    const newEmployee: Employee = {
      ...empData,
      id: newId,
      monthlyRecords: empData.monthlyRecords && empData.monthlyRecords.length > 0 ? empData.monthlyRecords : [
        {
          month: 'October 2026',
          baseSalaryQAR: empData.baseSalaryMonthlyQAR,
          targetServices: empData.monthlyServiceTarget,
          completedServices: 0,
          targetMet: false,
          excessServices: 0,
          commissionRatePerService: empData.commissionPerServiceQAR,
          commissionEarnedQAR: 0,
          expensesReimbursedQAR: 0,
          deductionsQAR: 0,
          grossPayableQAR: empData.baseSalaryMonthlyQAR,
          amountPaidQAR: 0,
          amountDueQAR: empData.baseSalaryMonthlyQAR,
          status: 'Pending Payout',
          notes: 'New employee onboarded for current cycle.',
        }
      ],
      totalExpensesQAR: empData.totalExpensesQAR || 0,
      rating: empData.rating || 5.0,
    };
    setEmployees((prev) => [newEmployee, ...prev]);

    // If assigned to a desk, update that desk's assigned employee
    if (newEmployee.assignedDeskId) {
      setAirportDesks((prev) =>
        prev.map((d) =>
          d.id === newEmployee.assignedDeskId
            ? {
                ...d,
                assignedEmployeeId: newEmployee.id,
                assignedEmployeeName: newEmployee.name,
                assignedEmployeeRole: newEmployee.role,
              }
            : d
        )
      );
    }

    addAuditLog('New Staff / Employee Added', 'DISPATCH', `Registered employee "${newEmployee.name}" (${newEmployee.role}) at ${newEmployee.assignedAirport}`);
    return { success: true, employee: newEmployee };
  };

  const updateEmployee = (id: string, updated: Partial<Employee>): { success: boolean; error?: string } => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          return { ...emp, ...updated };
        }
        return emp;
      })
    );

    // If desk changed, sync with airportDesks
    if (updated.assignedDeskId && updated.name) {
      setAirportDesks((prev) =>
        prev.map((d) =>
          d.id === updated.assignedDeskId
            ? {
                ...d,
                assignedEmployeeId: id,
                assignedEmployeeName: updated.name || d.assignedEmployeeName,
                assignedEmployeeRole: updated.role || d.assignedEmployeeRole,
              }
            : d
        )
      );
    }

    addAuditLog('Employee Record Updated', 'DISPATCH', `Updated employee #${id} profile and salary parameters`);
    return { success: true };
  };

  const deleteEmployee = (id: string): { success: boolean; error?: string } => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    addAuditLog('Employee Removed', 'DISPATCH', `Removed employee #${id}`);
    return { success: true };
  };

  const recordEmployeeSalaryPayment = (employeeId: string, month: string, amountPaid: number, notes?: string): { success: boolean; error?: string } => {
    if (amountPaid <= 0) {
      return { success: false, error: 'Payment amount must be greater than 0.' };
    }
    let found = false;
    let targetEmployee: Employee | null = null;
    let isFullyPaid = false;

    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          found = true;
          targetEmployee = emp;
          const updatedRecords = emp.monthlyRecords.map((rec) => {
            if (rec.month === month) {
              const newAmountPaid = rec.amountPaidQAR + amountPaid;
              const newAmountDue = Math.max(0, rec.grossPayableQAR - newAmountPaid);
              const newStatus = newAmountDue <= 0 ? 'Fully Paid' : 'Partially Paid';
              if (newAmountDue <= 0) isFullyPaid = true;
              return {
                ...rec,
                amountPaidQAR: newAmountPaid,
                amountDueQAR: newAmountDue,
                status: newStatus as any,
                paidDate: `Oct 09, 2026`,
                notes: notes ? `${rec.notes ? rec.notes + ' | ' : ''}${notes}` : rec.notes,
              };
            }
            return rec;
          });
          return { ...emp, monthlyRecords: updatedRecords };
        }
        return emp;
      })
    );

    if (found && targetEmployee) {
      const emp: Employee = targetEmployee;
      // 1. Sync with Finance Expenses: automatically add record
      addExpense({
        date: 'Oct 09, 2026',
        category: 'Chauffeur Per Diem',
        description: `Staff Salary Payout to ${emp.name} (${emp.role}) for ${month}${notes ? ` - ${notes}` : ''}`,
        amountQAR: amountPaid,
        approvedBy: roleConfig.userDisplayName,
        status: 'Paid',
        paymentMethod: 'QNB Bank Transfer',
        department: emp.department === 'Airport Desk' ? 'Airport Operations' : 'Administration',
        requestedBy: emp.name,
        requestedByRole: emp.role,
        deskId: emp.assignedDeskId,
        deskName: emp.assignedDeskName,
        receiptRef: `SAL-${Date.now().toString().slice(-5)}`,
      });

      // 2. Sync with Salary Records
      setSalaryRecords((prev) =>
        prev.map((s) => {
          if (s.employeeName.toLowerCase() === emp.name.toLowerCase()) {
            return {
              ...s,
              payoutStatus: isFullyPaid ? 'Paid' : 'Processing',
            };
          }
          return s;
        })
      );

      addAuditLog(
        'Salary Payment Disbursed & Synced',
        'FINANCE',
        `Disbursed ${amountPaid} QAR salary payment to ${emp.name} for ${month}. Synced with Company Expenses.`
      );
      return { success: true };
    }
    return { success: false, error: 'Employee or month record not found.' };
  };

  const addEmployeeExpense = (employeeId: string, month: string, expenseAmount: number, description: string): { success: boolean; error?: string } => {
    if (expenseAmount <= 0) {
      return { success: false, error: 'Expense amount must be greater than 0.' };
    }
    let found = false;
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          found = true;
          const updatedRecords = emp.monthlyRecords.map((rec) => {
            if (rec.month === month) {
              const newExpenses = rec.expensesReimbursedQAR + expenseAmount;
              const newGross = rec.baseSalaryQAR + rec.commissionEarnedQAR + newExpenses - rec.deductionsQAR;
              const newDue = Math.max(0, newGross - rec.amountPaidQAR);
              return {
                ...rec,
                expensesReimbursedQAR: newExpenses,
                grossPayableQAR: newGross,
                amountDueQAR: newDue,
                status: (newDue <= 0 ? 'Fully Paid' : 'Partially Paid') as any,
              };
            }
            return rec;
          });
          return {
            ...emp,
            totalExpensesQAR: (emp.totalExpensesQAR || 0) + expenseAmount,
            monthlyRecords: updatedRecords,
          };
        }
        return emp;
      })
    );

    addExpense({
      date: 'Just now',
      category: 'Hospitality / Karak',
      description: `Staff Reimbursement (${description})`,
      amountQAR: expenseAmount,
      approvedBy: roleConfig.userDisplayName,
      status: 'Paid',
      paymentMethod: 'Corporate Petty Cash',
    });

    if (found) {
      addAuditLog('Employee Expense Reimbursed', 'FINANCE', `Reimbursed ${expenseAmount} QAR (${description}) for employee #${employeeId}`);
      return { success: true };
    }
    return { success: false, error: 'Employee or month record not found.' };
  };

  // Guests Management
  const addGuest = (guestData: Omit<Guest, 'id'>): { success: boolean; error?: string; guest?: Guest } => {
    if (!guestData.name.trim()) {
      return { success: false, error: 'Guest name is required.' };
    }
    const newGuest: Guest = {
      ...guestData,
      id: `gst-${Math.floor(100 + Math.random() * 900)}`,
    };
    setGuests((prev) => [newGuest, ...prev]);
    addAuditLog('New Guest Profile Created', 'SYSTEM', `Registered traveler "${newGuest.name}" (${newGuest.nationality})`);
    return { success: true, guest: newGuest };
  };

  const updateGuest = (id: string, updated: Partial<Guest>): { success: boolean; error?: string } => {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...updated } : g)));
    addAuditLog('Guest Profile Updated', 'SYSTEM', `Updated guest profile #${id}`);
    return { success: true };
  };

  const deleteGuest = (id: string): { success: boolean; error?: string } => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
    addAuditLog('Guest Profile Removed', 'SYSTEM', `Removed guest #${id}`);
    return { success: true };
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const openModal = (modal: string, data?: any) => {
    setActiveModal(modal);
    setModalData(data || null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setRole,
        roleConfig,
        language,
        setLanguage,
        currency,
        setCurrency,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        dateFilter,
        setDateFilter,
        resetDateFilter,
        rates,
        updateRates,
        convertAmount,
        bookings,
        addBooking,
        updateBookingStatus,
        toggleVoucherSent,
        drivers,
        updateDriverStatus,
        addDriver,
        updateDriver,
        deleteDriver,
        tourGuides,
        assignDriverAndGuide,
        approveBooking,
        salaryRecords,
        updateSalaryPayout,
        commissionRules,
        updateCommissionRule,
        packages,
        packageCategories,
        addPackage,
        updatePackage,
        deletePackage,
        addPackageCategory,
        deletePackageCategory,
        airportDesks,
        activeDeskId,
        setActiveDeskId,
        activeDesk,
        addAirportDesk,
        updateAirportDesk,
        deleteAirportDesk,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        recordEmployeeSalaryPayment,
        addEmployeeExpense,
        guests,
        addGuest,
        updateGuest,
        deleteGuest,
        flights,
        shiftDrawer,
        updateDrawerCash,
        closeShiftAndAudit,
        expenses,
        addExpense,
        updateExpense,
        updateExpenseStatus,
        deleteExpense,
        systemLogs,
        addAuditLog,
        notifications,
        markNotificationRead,
        activeModal,
        modalData,
        openModal,
        closeModal,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        t,
      }}
    >
      <div className={theme === 'dark' ? 'dark' : ''}>{children}</div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

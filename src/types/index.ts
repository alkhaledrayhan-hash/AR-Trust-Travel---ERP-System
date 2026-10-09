export type Currency = 'QAR' | 'USD' | 'EUR' | 'GBP';

export type Language = 'en' | 'ar';

export type Theme = 'dark' | 'light';

export type UserRole =
  | 'super-admin'
  | 'operations-manager'
  | 'transit-agent'
  | 'driver-guide'
  | 'finance-accountant';

export interface RoleConfig {
  id: UserRole;
  title: string;
  titleAr: string;
  userDisplayName: string;
  userDisplayNameAr: string;
  scopeSummary: string;
  scopeSummaryAr: string;
  defaultTab: string;
  allowedTabs: string[];
  permissions: {
    canViewAllFinancials: boolean;
    canEditExchangeRates: boolean;
    canApprovePayouts: boolean;
    canAssignDrivers: boolean;
    canAuditShifts: boolean;
    canIssueVouchers: boolean;
    canViewDriverTrips: boolean;
    canViewSystemLogs: boolean;
    canManageServices: boolean;
    canManageFleet: boolean;
    canManageEmployees?: boolean;
    canManageDesks?: boolean;
    canManageGuests?: boolean;
    canApproveExpenses?: boolean;
  };
}

export const AR_TRUST_LOGO_URL =
  'https://artrusttravel.com/wp-content/uploads/al_opt_content/IMAGE/artrusttravel.com/wp-content/uploads/2026/01/AR-Trust-Travel-logo--e1768655182358.png.bv_resized_desktop.png.bv.webp';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'driver-assigned'
  | 'in-progress'
  | 'checked-in'
  | 'in-transit'
  | 'scheduled'
  | 'completed'
  | 'cancelled';

export interface TourGuide {
  id: string;
  name: string;
  nameAr: string;
  phone: string;
  languages: string[];
  specialty: 'Desert Safari' | 'Doha Cultural Heritage' | 'Museum VIP' | 'Dhow Marina Cruise';
  status: 'Assigned' | 'Available' | 'On Tour';
  toursLedToday: number;
  totalCommissionQAR: number;
  rating: number;
}

export interface SalaryRecord {
  id: string;
  employeeName: string;
  roleTitle: string;
  department: 'Operations' | 'Airport Desk' | 'Field Drivers' | 'Tour Guides' | 'Finance';
  fixedBaseMonthlyQAR: number;
  accruedCommissionQAR: number;
  netPayableQAR: number;
  paymentCycle: 'Monthly 30th';
  payoutStatus: 'Paid' | 'Processing' | 'Approved for Payroll';
}

export interface CommissionRule {
  id: string;
  targetRole: 'Transit Desk Agent' | 'Field Chauffeur' | 'Licensed Tour Guide';
  ruleDescription: string;
  type: 'FIXED_PER_BOOKING' | 'PERCENTAGE_REVENUE' | 'PER_TRIP_COMPLETED';
  rateValue: number; // e.g. 25 QAR, 12%, 45 QAR
  unit: 'QAR' | '%';
  appliesTo: string;
}

export interface Booking {
  id: string;
  pnr: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  nationality: string;
  flightNumber: string;
  arrivalAirport: string;
  arrivalTime: string;
  terminalGate: string;
  pickupBay: string;
  packageId: string;
  packageName: string;
  packageNameAr: string;
  paxCount: number;
  totalQAR: number;
  paymentCurrency: Currency;
  paymentMethod: 'Cash' | 'POS Card' | 'Payment Link' | 'Prepaid OTA' | 'Website Online Gateway';
  driverId: string;
  driverName: string;
  driverVehicle: string;
  driverPhone: string;
  guideId?: string;
  guideName?: string;
  qrStatus: BookingStatus;
  qrCodeUrl: string;
  voucherSent: boolean;
  notes?: string;
  createdAt: string;
  source: 'Airport Desk' | 'Online Web' | 'VIP Concierge' | 'OTA Partner' | 'Web Integration API';
}

export interface ExchangeRates {
  USD: number; // e.g. 3.64 QAR per USD (pegged)
  EUR: number; // e.g. 3.96 QAR per EUR
  GBP: number; // e.g. 4.74 QAR per GBP
  SAR: number; // e.g. 0.99 QAR per SAR
  lastUpdated: string;
}

export interface TourPackage {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  duration: string;
  priceQAR: number;
  description: string;
  descriptionAr: string;
  pickupLocation: string;
  includes: string[];
}

export interface Driver {
  id: string;
  name: string;
  nameAr: string;
  phone: string;
  vehicle: string;
  plateNumber: string;
  vehicleType: '4x4 SUV' | 'VIP Van' | 'Luxury Sedan' | 'Mini Bus' | 'Luxury Limousine' | 'Coaster Bus' | string;
  status: 'Dispatched' | 'At Airport Bay' | 'En Route' | 'Standby' | 'Off Duty' | 'Maintenance';
  currentMission?: string;
  activePassengers?: number;
  totalTripsToday: number;
  location: string;
  rating: number;
}

export interface FlightInfo {
  flightNumber: string;
  airline: string;
  airlineCode: string;
  originCity: string;
  originIata: string;
  scheduledArrival: string;
  estimatedArrival: string;
  status: 'Landed' | 'Taxiing' | 'Baggage Claim' | 'Approaching' | 'Delayed';
  gate: string;
  carousel: string;
  assignedBookingsCount: number;
  terminal: 'Terminal 1 Arrivals' | 'VIP Al Maha Lounge' | 'Emiri Terminal';
}

export interface ShiftDrawer {
  counterId: string;
  counterName: string;
  counterNameAr: string;
  agentName: string;
  shiftStartTime: string;
  shiftEndTime: string;
  openingCash: {
    QAR: number;
    USD: number;
    EUR: number;
    GBP: number;
  };
  currentCashDrawer: {
    QAR: number;
    USD: number;
    EUR: number;
    GBP: number;
  };
  systemExpected: {
    QAR: number;
    USD: number;
    EUR: number;
    GBP: number;
  };
  posCardTotalQAR: number;
  paymentLinkTotalQAR: number;
  transactionsCount: number;
  status: 'Active' | 'Closing Pending' | 'Audited & Closed';
}

export interface NotificationItem {
  id: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  time: string;
  type: 'flight' | 'driver' | 'cash' | 'vip';
  read: boolean;
  actionLabel?: string;
}

export interface AirportDesk {
  id: string;
  airportCode: string;
  airportName: string;
  deskCode: string;
  deskName: string;
  deskNameAr: string;
  terminal: string;
  zone: string;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  assignedEmployeeRole?: string;
  status: 'Active' | 'Closing Soon' | 'Offline' | 'Under Maintenance';
  shiftTiming: string;
  phoneExt: string;
  notes?: string;
  operatingHours?: string;
  dailyTargetQAR?: number;
  currentDrawerCashQAR?: number;
}

export interface DeskAssignmentRecord {
  id: string;
  deskId: string;
  deskCode: string;
  deskName: string;
  airportCode: string;
  terminal: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  assignedDate: string; // e.g. 'Oct 09, 2026, 06:00 AM'
  shiftTiming: string;
  assignedBy: string;
  status: 'Active' | 'Completed' | 'Reassigned' | 'Shift Ended';
  notes?: string;
}

export interface EmployeeMonthlyRecord {
  month: string; // e.g. 'October 2026'
  baseSalaryQAR: number;
  targetServices: number;
  completedServices: number;
  targetMet: boolean;
  excessServices: number;
  commissionRatePerService: number;
  commissionEarnedQAR: number;
  expensesReimbursedQAR: number;
  deductionsQAR: number;
  grossPayableQAR: number;
  amountPaidQAR: number;
  amountDueQAR: number;
  status: 'Fully Paid' | 'Partially Paid' | 'Pending Payout' | 'Approved';
  paidDate?: string;
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  role: string;
  department: 'Airport Desk' | 'Operations' | 'Field Drivers' | 'Tour Guides' | 'Finance';
  assignedAirport: string;
  assignedDeskId: string;
  assignedDeskName: string;
  status: 'On Duty' | 'Available' | 'On Leave' | 'Off Duty';
  hireDate: string;
  baseSalaryMonthlyQAR: number;
  monthlyServiceTarget: number;
  commissionPerServiceQAR: number;
  monthlyRecords: EmployeeMonthlyRecord[];
  totalExpensesQAR: number;
  rating: number;
  emergencyContact: string;
}

export interface Guest {
  id: string;
  name: string;
  nationality: string;
  phone: string;
  email: string;
  vipTier: 'VIP Platinum' | 'VIP Gold' | 'VIP Silver' | 'Standard' | 'Transit Special';
  passportNo?: string;
  totalBookings: number;
  totalSpentQAR: number;
  lastArrivalAirport: string;
  lastFlight: string;
  lastTripDate: string;
  specialPreferences: string;
  bookingIds: string[];
}

export type ExpenseCategory =
  | 'Fleet Fuel'
  | 'Airport Apron Permits'
  | 'Camp Maintenance'
  | 'Hospitality / Karak'
  | 'Chauffeur Per Diem'
  | 'Vehicle Maintenance'
  | 'Marketing & Collateral'
  | 'Marketing & PR'
  | 'Uniforms & Badges'
  | 'IT & Telecom'
  | 'Office Supplies'
  | 'VIP Terminal Concierge'
  | 'Other Operational'
  | 'Licensing & Government'
  | 'Office & Utility'
  | 'Equipment & Gear';

export type ExpenseStatus = 'Pending Review' | 'Approved' | 'Paid' | 'Rejected';

export interface FinanceExpense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amountQAR: number;
  approvedBy: string;
  status: ExpenseStatus;
  paymentMethod?: string;
  department?: string;
  requestedBy?: string;
  requestedByRole?: string;
  submittedBy?: string;
  receiptRef?: string;
  receiptNumber?: string;
  merchant?: string;
  deskId?: string;
  relatedDeskId?: string;
  deskName?: string;
  approvedAt?: string;
  approvalNotes?: string;
  notes?: string;
  rejectedReason?: string;
}

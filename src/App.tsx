import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { UnifiedBookingsView } from './components/views/UnifiedBookingsView';
import { AirportDeskPOSView } from './components/views/AirportDeskPOSView';
import { FleetPersonnelView } from './components/views/FleetPersonnelView';
import { EODShiftView } from './components/views/EODShiftView';
import { PayrollCommissionView } from './components/views/PayrollCommissionView';
import { MultiCurrencyLedgerView } from './components/views/MultiCurrencyLedgerView';
import { FinancialReportsView } from './components/views/FinancialReportsView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { DriverPortalView } from './components/views/DriverPortalView';
import { ServicesManagementView } from './components/views/ServicesManagementView';
import { EmployeesView } from './components/views/EmployeesView';
import { GuestsView } from './components/views/GuestsView';
import { ExpensesView } from './components/views/ExpensesView';
import { SettingsView } from './components/views/SettingsView';

import { NewBookingModal } from './components/modals/NewBookingModal';
import { QRVoucherModal } from './components/modals/QRVoucherModal';
import { EODAuditModal } from './components/modals/EODAuditModal';
import { FlightDetailModal } from './components/modals/FlightDetailModal';

const MainLayout: React.FC = () => {
  const { activeTab, activeModal, currentRole } = useApp();

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <Header />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-[1600px] mx-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'bookings' && <UnifiedBookingsView />}
            {activeTab === 'guests' && <GuestsView />}
            {activeTab === 'services' && <ServicesManagementView />}
            {activeTab === 'pos' && <AirportDeskPOSView />}
            {activeTab === 'employees' && <EmployeesView />}
            {activeTab === 'dispatch' && <FleetPersonnelView />}
            {activeTab === 'eod' && <EODShiftView />}
            {activeTab === 'payroll' && <PayrollCommissionView />}
            {activeTab === 'expenses' && <ExpensesView />}
            {activeTab === 'ledger' && <MultiCurrencyLedgerView />}
            {activeTab === 'reports' && <FinancialReportsView />}
            {activeTab === 'audit-logs' && <AuditLogsView />}
            {activeTab === 'driver-portal' && <DriverPortalView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* 3. Conditional Interactive Modals */}
      {activeModal === 'new-booking' && <NewBookingModal />}
      {activeModal === 'qr-voucher' && <QRVoucherModal />}
      {activeModal === 'eod-audit' && <EODAuditModal />}
      {activeModal === 'flight-detail' && <FlightDetailModal />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

import React, { useState } from 'react';
import {
  Receipt,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  Calendar,
  Building2,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EODShiftView: React.FC = () => {
  const { shiftDrawer, openModal, convertAmount, language, t } = useApp();

  const [selectedBranch, setSelectedBranch] = useState('HIA-CTR-04');

  const branches = [
    { id: 'HIA-CTR-04', name: 'Hamad Int’l Airport (Counter 4)', agent: 'Tariq Al-Sulaiti', status: 'Pending Audit', cashQAR: 18450, posQAR: 62480 },
    { id: 'HIA-CTR-07', name: 'Hamad Int’l Airport (VIP Terminal)', agent: 'Maryam Al-Kuwari', status: 'Active Shift', cashQAR: 12200, posQAR: 48900 },
    { id: 'SW-HQ-01', name: 'Souq Waqif Flagship Head Office', agent: 'Hamad Al-Hajri', status: 'Audited & Closed', cashQAR: 24600, posQAR: 81200 },
    { id: 'LM-DK-02', name: 'Lusail Marina Concierge Desk', agent: 'Zaid Qasim', status: 'Active Shift', cashQAR: 8900, posQAR: 31400 },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-500" />
            <span>{language === 'ar' ? 'مطابقة الورديات وإغلاق اليوم المالي (EOD)' : 'Daily End of Day (EOD) Shift Reconciliation & Vault Drops'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Z-Report audit logs, cashier physical drawer balancing & QNB airport bank drop receipts
          </p>
        </div>

        <button
          onClick={() => openModal('eod-audit', shiftDrawer)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Scale className="w-4 h-4" />
          <span>Audit Counter 4 (Active Shift)</span>
        </button>
      </div>

      {/* Branch Shift Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {branches.map((b) => (
          <div
            key={b.id}
            onClick={() => setSelectedBranch(b.id)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedBranch === b.id
                ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-400 font-bold">{b.id}</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  b.status === 'Pending Audit'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : b.status === 'Audited & Closed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}
              >
                {b.status}
              </span>
            </div>

            <h3 className="mt-2 font-bold text-xs text-slate-900 dark:text-white leading-tight">
              {b.name}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Duty Agent: {b.agent}</p>

            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400">Cash: QAR {b.cashQAR.toLocaleString()}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                POS: {b.posQAR.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Branch Detailed Audit Ledger */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Shift Drawer Breakdown · Counter 4 (Hamad Airport)
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Opening Cash Balance: 5,000 QAR · Net Sales Today: 13,450 QAR
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1 font-medium"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print X-Report</span>
            </button>
            <button
              onClick={() => openModal('eod-audit', shiftDrawer)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Close Shift (Z-Report)
            </button>
          </div>
        </div>

        {/* Currency Denomination Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
            <span className="font-bold text-slate-700 dark:text-slate-300">Qatari Riyal (QAR)</span>
            <div className="mt-1 font-mono font-bold text-base text-slate-900 dark:text-white">
              {shiftDrawer.currentCashDrawer.QAR.toLocaleString()} QAR
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              500s: 22 notes · 100s: 64 notes · 50s: 21 notes
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
            <span className="font-bold text-slate-700 dark:text-slate-300">US Dollar (USD)</span>
            <div className="mt-1 font-mono font-bold text-base text-slate-900 dark:text-white">
              ${shiftDrawer.currentCashDrawer.USD.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              $100s: 30 notes · $50s: 9 notes (Peg: 3.64)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
            <span className="font-bold text-slate-700 dark:text-slate-300">Euro (EUR)</span>
            <div className="mt-1 font-mono font-bold text-base text-slate-900 dark:text-white">
              €{shiftDrawer.currentCashDrawer.EUR.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              €100s: 20 notes · €50s: 16 notes (Peg: 3.96)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
            <span className="font-bold text-slate-700 dark:text-slate-300">British Pound (GBP)</span>
            <div className="mt-1 font-mono font-bold text-base text-slate-900 dark:text-white">
              £{shiftDrawer.currentCashDrawer.GBP.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              £50s: 30 notes · £20s: 22 notes (Peg: 4.74)
            </div>
          </div>
        </div>

        {/* Audit Verification Log */}
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-emerald-900 dark:text-emerald-200 font-medium">
              Daily physical cash count exactly matches system calculations across all currencies. Zero drawer discrepancy.
            </span>
          </div>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            VERIFIED
          </span>
        </div>
      </div>
    </div>
  );
};

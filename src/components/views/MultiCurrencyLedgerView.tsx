import React from 'react';
import {
  Coins,
  Building2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DateFilterBar } from '../common/DateFilterBar';

export const MultiCurrencyLedgerView: React.FC = () => {
  const { rates, language, dateFilter, setDateFilter, t } = useApp();

  const holdings = [
    { currency: 'QAR', name: 'Qatari Riyal (Base Peg)', balance: 428900, symbol: 'ر.ق', eqvQAR: 428900, share: '56.4%', account: 'QNB Main Operating Account #QA92QNBA...' },
    { currency: 'USD', name: 'US Dollar (QCB Pegged 3.64)', balance: 54300, symbol: '$', eqvQAR: 197652, share: '26.0%', account: 'QNB Foreign Currency Vault #QA92QNBA...' },
    { currency: 'EUR', name: 'Eurozone Currency (EUR)', balance: 22800, symbol: '€', eqvQAR: 90288, share: '11.8%', account: 'Masraf Al Rayan FX Treasury #QA11MARB...' },
    { currency: 'GBP', name: 'British Pound Sterling (GBP)', balance: 9400, symbol: '£', eqvQAR: 44556, share: '5.8%', account: 'Commercial Bank of Qatar FX #QA44CBQK...' },
  ];

  const totalTreasuryQAR = holdings.reduce((sum, h) => sum + h.eqvQAR, 0);

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-500" />
            <span>{language === 'ar' ? 'دفتر الأستاذ متعدد العملات والاحتياطيات (QCB)' : 'Multi-Currency Foreign Exchange Treasury'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Qatar Central Bank pegged reserves, cash vault accounts & multi-currency deposits
          </p>
        </div>

        <div className="text-right font-mono">
          <span className="text-[10px] text-slate-400 block">TOTAL AGENCY RESERVES (QAR EQV)</span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            QAR {totalTreasuryQAR.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Date & Year Filter */}
      <DateFilterBar
        filter={dateFilter}
        onChange={setDateFilter}
        label={language === 'ar' ? 'تصفية تسويات العملات والاحتياطيات بالسنة' : 'Ledger Reserves Date & Year Filter'}
      />

      {/* Currency Holdings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {holdings.map((h) => (
          <div
            key={h.currency}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                {h.currency}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {h.share}
              </span>
            </div>

            <div>
              <div className="font-mono text-xl font-extrabold text-slate-900 dark:text-white">
                {h.symbol} {h.balance.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                ≈ QAR {h.eqvQAR.toLocaleString()}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 font-mono truncate">
              {h.account}
            </div>
          </div>
        ))}
      </div>

      {/* FX Rates & Bank Settlement Rules */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-blue-500" />
          <span>Qatar Central Bank (QCB) Pegging & Compliance Directives</span>
        </h3>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
          Under Qatar Central Bank regulations, the Qatari Riyal is officially pegged to the US Dollar at 1 USD = 3.64 QAR. Airport desk cashiers are authorized to accept US Dollars, Euros, and British Pounds at daily official board rates. All physical cash notes deposited at Hamad International Airport vault are settled daily with Qatar National Bank (QNB).
        </p>
      </div>
    </div>
  );
};

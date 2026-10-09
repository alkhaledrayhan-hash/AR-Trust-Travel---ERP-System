import React, { useState } from 'react';
import {
  CalendarCheck2,
  Globe,
  Store,
  CheckCircle2,
  Clock,
  Car,
  Compass,
  QrCode,
  Send,
  Plus,
  Filter,
  Search,
  Printer,
  ChevronRight,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { DateFilterBar } from '../common/DateFilterBar';
import { matchesDateFilter } from '../../utils/dateFilter';

export const UnifiedBookingsView: React.FC = () => {
  const {
    bookings,
    drivers,
    tourGuides,
    assignDriverAndGuide,
    approveBooking,
    openModal,
    convertAmount,
    language,
    dateFilter,
    setDateFilter,
    t,
  } = useApp();

  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Selected booking for assigning driver/guide modal
  const [assigningBooking, setAssigningBooking] = useState<Booking | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0].id);
  const [selectedGuideId, setSelectedGuideId] = useState(tourGuides[0].id);

  const filteredBookings = bookings.filter((b) => {
    // Date & Year Filter
    if (!matchesDateFilter(b.createdAt, dateFilter)) return false;

    const matchesSource =
      sourceFilter === 'all'
        ? true
        : sourceFilter === 'web'
        ? b.source === 'Web Integration API' || b.source === 'Online Web'
        : sourceFilter === 'airport'
        ? b.source === 'Airport Desk'
        : sourceFilter === 'vip'
        ? b.source === 'VIP Concierge'
        : true;

    const matchesStatus = statusFilter === 'all' || b.qrStatus === statusFilter;

    const matchesSearch =
      b.passengerName.toLowerCase().includes(search.toLowerCase()) ||
      b.pnr.toLowerCase().includes(search.toLowerCase()) ||
      b.flightNumber.toLowerCase().includes(search.toLowerCase());

    return matchesSource && matchesStatus && matchesSearch;
  });

  const webCount = bookings.filter((b) => b.source === 'Web Integration API' || b.source === 'Online Web').length;
  const airportCount = bookings.filter((b) => b.source === 'Airport Desk').length;
  const pendingCount = bookings.filter((b) => b.qrStatus === 'pending').length;

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningBooking) return;
    assignDriverAndGuide(assigningBooking.id, selectedDriverId, selectedGuideId);
    setAssigningBooking(null);
  };

  return (
    <div className="space-y-5 pb-8 select-none">
      {/* Unified Inventory Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {language === 'ar' ? 'منظومة الحجوزات الموحدة (موقع الشركة + كاونترات المطار)' : 'Unified Central Booking Engine (Website API + Airport Desk)'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Single live stream merging direct artrusttravel.com bookings and offline HIA walk-in passenger entries
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Channel stats badges */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
              {webCount} Website API
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
              {airportCount} Airport Desk
            </span>
            {pendingCount > 0 && (
              <span className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800 animate-pulse">
                {pendingCount} Pending Approval
              </span>
            )}
          </div>

          <button
            onClick={() => openModal('new-booking')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Reservation</span>
          </button>
        </div>
      </div>

      {/* Date & Year Filter */}
      <DateFilterBar
        filter={dateFilter}
        onChange={setDateFilter}
        totalCount={bookings.length}
        filteredCount={filteredBookings.length}
        label={language === 'ar' ? 'تصفية حجوزات الموقع والمطار' : 'Bookings Date & Year Filter'}
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs">
          <button
            onClick={() => setSourceFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              sourceFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            All Inventory ({bookings.length})
          </button>
          <button
            onClick={() => setSourceFilter('web')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              sourceFilter === 'web'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Website Web API ({webCount})
          </button>
          <button
            onClick={() => setSourceFilter('airport')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              sourceFilter === 'airport'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Airport Desk POS ({airportCount})
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search PNR, passenger, flight..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Unified Bookings Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase font-mono">
                <th className="py-3 px-4">Channel & PNR</th>
                <th className="py-3 px-4">Lead Guest</th>
                <th className="py-3 px-4">Flight & Gate</th>
                <th className="py-3 px-4">Package Service</th>
                <th className="py-3 px-4">Chauffeur & Guide</th>
                <th className="py-3 px-4 text-right rtl:text-left">Revenue Total</th>
                <th className="py-3 px-4 text-center">Lifecycle Flow</th>
                <th className="py-3 px-4 text-right rtl:text-left">Operational Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  {/* Channel & PNR */}
                  <td className="py-3 px-4 font-mono">
                    <div className="flex items-center gap-1.5">
                      {b.source === 'Web Integration API' ? (
                        <span title="artrusttravel.com Web API">
                          <Globe className="w-3.5 h-3.5 text-blue-500" />
                        </span>
                      ) : (
                        <span title="Airport Desk Walk-In">
                          <Store className="w-3.5 h-3.5 text-emerald-500" />
                        </span>
                      )}
                      <span className="font-bold text-slate-900 dark:text-white">{b.pnr}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{b.source}</span>
                  </td>

                  {/* Lead Guest */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{b.passengerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {b.paxCount} PAX · {b.nationality}
                    </div>
                  </td>

                  {/* Flight & Gate */}
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-blue-600 dark:text-blue-400">{b.flightNumber}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {b.arrivalTime} ({b.terminalGate})
                    </div>
                  </td>

                  {/* Package */}
                  <td className="py-3 px-4 max-w-[190px]">
                    <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{b.packageName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">Meeting: {b.pickupBay}</span>
                  </td>

                  {/* Chauffeur & Guide */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                      <Car className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[120px]">{b.driverName || 'Unassigned'}</span>
                    </div>
                    {b.guideName && (
                      <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <Compass className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{b.guideName}</span>
                      </div>
                    )}
                  </td>

                  {/* Revenue */}
                  <td className="py-3 px-4 text-right rtl:text-left font-mono tabular-nums">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {convertAmount(b.totalQAR).formatted}
                    </div>
                    <div className="text-[10px] text-slate-400">{b.paymentMethod}</div>
                  </td>

                  {/* Lifecycle Flow Status */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono capitalize ${
                        b.qrStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : b.qrStatus === 'confirmed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : b.qrStatus === 'driver-assigned'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : b.qrStatus === 'checked-in'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {b.qrStatus.replace('-', ' ')}
                    </span>
                  </td>

                  {/* Operational Action */}
                  <td className="py-3 px-4 text-right rtl:text-left">
                    <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                      {b.qrStatus === 'pending' && (
                        <button
                          onClick={() => approveBooking(b.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] shadow-xs"
                          title="Approve Web Integration Booking"
                        >
                          Approve
                        </button>
                      )}

                      <button
                        onClick={() => setAssigningBooking(b)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-[10px] font-semibold"
                        title="Schedule Chauffeur & Guide"
                      >
                        Schedule
                      </button>

                      <button
                        onClick={() => openModal('qr-voucher', b)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600"
                        title="Passenger Information Sheet & QR Voucher"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Driver & Guide Modal */}
      {assigningBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs select-none">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-500" />
              <span>Assign Fleet Personnel for {assigningBooking.pnr}</span>
            </h3>

            <p className="text-xs text-slate-500">
              Guest: <span className="font-bold text-slate-800 dark:text-slate-200">{assigningBooking.passengerName}</span> · {assigningBooking.packageName}
            </p>

            <form onSubmit={handleConfirmAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Select Chauffeur & 4x4 / Van</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.vehicle} ({d.plateNumber}) · {d.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Select Licensed Multilingual Guide</label>
                <select
                  value={selectedGuideId}
                  onChange={(e) => setSelectedGuideId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  {tourGuides.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.languages.join('/')}) — {g.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningBooking(null)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Confirm Assignment & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

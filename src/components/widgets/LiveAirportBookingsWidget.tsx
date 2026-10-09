import React, { useState } from 'react';
import {
  QrCode,
  Send,
  CheckCircle2,
  Clock,
  Car,
  Filter,
  Search,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { matchesDateFilter } from '../../utils/dateFilter';

export const LiveAirportBookingsWidget: React.FC = () => {
  const {
    bookings,
    searchQuery,
    convertAmount,
    currency,
    updateBookingStatus,
    toggleVoucherSent,
    openModal,
    language,
    dateFilter,
    t,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter bookings based on date filter, global search & local filter
  const filteredBookings = bookings.filter((b) => {
    if (!matchesDateFilter(b.createdAt, dateFilter)) return false;

    const matchesSearch =
      b.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.packageName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return b.qrStatus === statusFilter;
  });

  const handleCopyWhatsApp = (booking: Booking) => {
    const msg = `Marhaba ${booking.passengerName}! Your AR Trust Qatar booking (${booking.pnr}) for ${booking.packageName} is confirmed. Driver ${booking.driverName} (${booking.driverVehicle}) is awaiting you at Hamad Airport ${booking.pickupBay}. Track driver: https://artrust.qa/track/${booking.pnr}`;
    navigator.clipboard?.writeText(msg);
    setCopiedId(booking.id);
    toggleVoucherSent(booking.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t('airportDeskBookings')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'ar'
              ? 'تحقق فوري من التذاكر الإلكترونية، ركاب المطار، وإرسال قسائم الواتساب'
              : 'Hamad Int’l Counter 4 queue, QR boarding passes & instant WhatsApp dispatch'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
          {['all', 'checked-in', 'in-transit', 'scheduled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                statusFilter === st
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {st === 'all'
                ? language === 'ar'
                  ? 'الكل'
                  : 'All'
                : st === 'checked-in'
                ? language === 'ar'
                  ? 'تم التحقق'
                  : 'Checked In'
                : st === 'in-transit'
                ? language === 'ar'
                  ? 'في الطريق'
                  : 'In Transit'
                : language === 'ar'
                ? 'مجدول'
                : 'Scheduled'}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Table */}
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">Passenger & Flight</th>
              <th className="py-2.5 px-3">Package Tour</th>
              <th className="py-2.5 px-3 text-right rtl:text-left">Amount ({currency})</th>
              <th className="py-2.5 px-3">Driver / Chauffeur</th>
              <th className="py-2.5 px-3 text-center">QR Status</th>
              <th className="py-2.5 px-3 text-right rtl:text-left">Voucher</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No airport desk bookings match the active query.
                </td>
              </tr>
            ) : (
              filteredBookings.slice(0, 6).map((booking) => {
                const converted = convertAmount(booking.totalQAR);
                return (
                  <tr
                    key={booking.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Passenger & Flight */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{booking.passengerName}</span>
                        <span className="text-[10px] font-mono text-slate-400">({booking.paxCount} pax)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono mt-0.5">
                        <span className="font-bold text-blue-600 dark:text-blue-400">{booking.flightNumber}</span>
                        <span>·</span>
                        <span>Arr: {booking.arrivalTime}</span>
                        <span>·</span>
                        <span className="text-slate-400">{booking.pickupBay}</span>
                      </div>
                    </td>

                    {/* Package */}
                    <td className="py-3 px-3 max-w-[190px]">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {language === 'ar' ? booking.packageNameAr : booking.packageName}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        PNR: {booking.pnr}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-3 text-right rtl:text-left font-mono tabular-nums">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {converted.formatted}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {booking.paymentMethod}
                      </div>
                    </td>

                    {/* Driver & Vehicle */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                        <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[130px]">{booking.driverName}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">
                        {booking.driverVehicle}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => {
                          const nextStatus: Record<string, Booking['qrStatus']> = {
                            'scheduled': 'checked-in',
                            'checked-in': 'in-transit',
                            'in-transit': 'completed',
                            'completed': 'scheduled',
                          };
                          updateBookingStatus(booking.id, nextStatus[booking.qrStatus] || 'checked-in');
                        }}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-all hover:scale-105 ${
                          booking.qrStatus === 'checked-in'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : booking.qrStatus === 'in-transit'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                            : booking.qrStatus === 'completed'
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                        }`}
                        title="Click to advance status"
                      >
                        {booking.qrStatus === 'checked-in' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {booking.qrStatus === 'in-transit' && <Clock className="w-3 h-3 text-amber-600" />}
                        <span className="capitalize">{booking.qrStatus.replace('-', ' ')}</span>
                      </button>
                    </td>

                    {/* Actions: QR Pass & WhatsApp */}
                    <td className="py-3 px-3 text-right rtl:text-left">
                      <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                        {/* Digital QR Boarding Pass Modal Button */}
                        <button
                          onClick={() => openModal('qr-voucher', booking)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                          title="View QR Voucher Pass"
                        >
                          <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>

                        {/* WhatsApp Instant Voucher Dispatch */}
                        <button
                          onClick={() => handleCopyWhatsApp(booking)}
                          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                            copiedId === booking.id
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          }`}
                          title="Dispatch Instant WhatsApp Voucher"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {copiedId === booking.id ? (
                            <span className="text-[10px] font-bold">Sent!</span>
                          ) : null}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono">Showing {Math.min(6, filteredBookings.length)} of {bookings.length} reservations</span>
        <button
          onClick={() => openModal('new-booking')}
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          + Add Airport Desk Walk-In
        </button>
      </div>
    </div>
  );
};

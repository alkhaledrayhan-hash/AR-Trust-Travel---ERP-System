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
  Edit3,
  X,
  Calendar,
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
    updateBooking,
    drivers,
    tourGuides,
    toggleVoucherSent,
    openModal,
    language,
    dateFilter,
    t,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

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
              ? 'تحقق فوري من التذاكر الإلكترونية، ركاب المطار ومكاتب الفنادق، وإرسال قسائم الواتساب'
              : 'Agent Desk & Hotel counters queue, QR boarding passes & instant WhatsApp dispatch'}
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
            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">Lead Passenger</th>
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
                  No agent desk bookings match the active query.
                </td>
              </tr>
            ) : (
              filteredBookings.slice(0, 6).map((booking) => {
                const converted = convertAmount(booking.totalQAR);
                return (
                  <tr
                    key={booking.id}
                    onClick={() => setEditingBooking({ ...booking })}
                    className="hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
                    title="Click booking to view full details and edit status / info"
                  >
                    {/* Passenger Details */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{booking.passengerName}</span>
                        <span className="text-[10px] font-mono text-slate-400">({booking.paxCount} pax)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono mt-0.5">
                        <span>{booking.nationality}</span>
                        <span>·</span>
                        <span>{booking.passengerPhone}</span>
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
                        onClick={(e) => {
                          e.stopPropagation();
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

                    {/* Actions: QR Pass & WhatsApp & Edit */}
                    <td className="py-3 px-3 text-right rtl:text-left">
                      <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                        {/* Edit Full Dossier */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingBooking({ ...booking });
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                          title="View Full Booking Details & Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        </button>

                        {/* Digital QR Boarding Pass Modal Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('qr-voucher', booking);
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                          title="View QR Voucher Pass"
                        >
                          <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </button>

                        {/* WhatsApp Instant Voucher Dispatch */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyWhatsApp(booking);
                          }}
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
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
        >
          + Add Agent Desk Walk-In
        </button>
      </div>

      {/* Edit Booking Details Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs select-none">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80 shrink-0">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Booking Dossier & Admin Edit ({editingBooking.pnr})
                </h3>
              </div>
              <button onClick={() => setEditingBooking(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateBooking(editingBooking.id, editingBooking);
                setEditingBooking(null);
              }}
              className="p-6 space-y-4 text-xs overflow-y-auto flex-1"
            >
              {/* Passenger & Origin */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Passenger Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBooking.passengerName}
                    onChange={(e) => setEditingBooking({ ...editingBooking, passengerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={editingBooking.nationality}
                    onChange={(e) => setEditingBooking({ ...editingBooking, nationality: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* Booking Date & Time */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>Booking Date</span>
                  </label>
                  <input
                    type="date"
                    value={editingBooking.bookingDate || '2026-10-15'}
                    onChange={(e) => setEditingBooking({ ...editingBooking, bookingDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Booking / Pickup Time</span>
                  </label>
                  <input
                    type="time"
                    value={editingBooking.bookingTime || editingBooking.arrivalTime || '14:30'}
                    onChange={(e) => setEditingBooking({ ...editingBooking, bookingTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              {/* Contact & PAX */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={editingBooking.passengerPhone}
                    onChange={(e) => setEditingBooking({ ...editingBooking, passengerPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Passenger Count (PAX)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingBooking.paxCount}
                    onChange={(e) => setEditingBooking({ ...editingBooking, paxCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              {/* Status & PAX */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Booking Status
                  </label>
                  <select
                    value={editingBooking.qrStatus}
                    onChange={(e) => setEditingBooking({ ...editingBooking, qrStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="pending">Pending Approval</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="driver-assigned">Driver Assigned</option>
                    <option value="checked-in">Checked In / On Board</option>
                    <option value="in-transit">In Transit</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    PAX Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingBooking.paxCount}
                    onChange={(e) => setEditingBooking({ ...editingBooking, paxCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Driver & Guide */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chauffeur
                  </label>
                  <select
                    value={editingBooking.driverId || ''}
                    onChange={(e) => {
                      const d = drivers.find((drv) => drv.id === e.target.value);
                      setEditingBooking({
                        ...editingBooking,
                        driverId: e.target.value,
                        driverName: d ? d.name : 'Unassigned',
                        driverVehicle: d ? `${d.vehicle} (${d.plateNumber})` : editingBooking.driverVehicle,
                        driverPhone: d ? d.phone : editingBooking.driverPhone,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="">Unassigned</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.vehicle}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tour Guide
                  </label>
                  <select
                    value={editingBooking.guideId || ''}
                    onChange={(e) => {
                      const g = tourGuides.find((gd) => gd.id === e.target.value);
                      setEditingBooking({
                        ...editingBooking,
                        guideId: e.target.value,
                        guideName: g ? g.name : '',
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="">No Guide</option>
                    {tourGuides.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.languages.join('/')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Financials */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Revenue (QAR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingBooking.totalQAR}
                    onChange={(e) => setEditingBooking({ ...editingBooking, totalQAR: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={editingBooking.paymentMethod}
                    onChange={(e) => setEditingBooking({ ...editingBooking, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="POS Card">POS Card</option>
                    <option value="Cash">Cash Drawer</option>
                    <option value="Payment Link">Payment Link</option>
                    <option value="Prepaid OTA">Prepaid OTA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={editingBooking.notes || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Booking Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

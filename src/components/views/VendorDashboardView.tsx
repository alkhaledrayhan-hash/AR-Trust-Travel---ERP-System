import React, { useState, useMemo } from 'react';
import {
  Building2,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Search,
  Scan,
  Camera,
  Calendar,
  Users,
  BedDouble,
  DollarSign,
  Clock,
  Sparkles,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Printer,
  ChevronRight,
  Filter,
  Check,
  X,
  CreditCard,
  Utensils,
  Eye,
  RefreshCw,
  Sliders,
  BadgeCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HotelBooking, HotelVendor } from '../../types';

export const VendorDashboardView: React.FC = () => {
  const {
    hotelVendors,
    hotelBookings,
    updateHotelBookingStatus,
    currentUser,
    currentRole,
    language,
    convertAmount,
    openModal,
    addAuditLog,
    t,
  } = useApp();

  const isRtl = language === 'ar';

  // Determine active hotel: if user is vendor-partner with vendorId, lock to that hotel.
  // Otherwise default to first hotel, but allow switching for Admins/Managers.
  const [selectedHotelId, setSelectedHotelId] = useState<string>(() => {
    if (currentUser?.vendorId) return currentUser.vendorId;
    return hotelVendors[0]?.id || 'h-ritz';
  });

  const activeHotel: HotelVendor | undefined = useMemo(() => {
    return (
      hotelVendors.find((h) => h.id === selectedHotelId) ||
      hotelVendors.find((h) => h.id === currentUser?.vendorId) ||
      hotelVendors[0]
    );
  }, [hotelVendors, selectedHotelId, currentUser]);

  // Sub-tab: 'verify' | 'bookings' | 'rooms' | 'desks'
  const [activeSubTab, setActiveSubTab] = useState<'verify' | 'bookings' | 'rooms' | 'desks'>('verify');

  // Bookings list search & filter
  const [bookingSearch, setBookingSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // QR & Voucher Verification State
  const [verifyInput, setVerifyInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<HotelBooking | null>(null);
  const [verificationFeedback, setVerificationFeedback] = useState<{
    type: 'success' | 'error' | 'already-checked-in';
    message: string;
  } | null>(null);

  // Filter hotel bookings for active hotel
  const hotelBookingsList = useMemo(() => {
    if (!activeHotel) return [];
    return hotelBookings.filter(
      (b) =>
        b.hotelId === activeHotel.id ||
        b.hotelName.toLowerCase().includes(activeHotel.name.toLowerCase().split(',')[0])
    );
  }, [hotelBookings, activeHotel]);

  // KPI Calculations
  const metrics = useMemo(() => {
    const total = hotelBookingsList.length;
    const checkedIn = hotelBookingsList.filter((b) => b.bookingStatus === 'Checked In').length;
    const confirmed = hotelBookingsList.filter((b) => b.bookingStatus === 'Confirmed').length;
    const completed = hotelBookingsList.filter((b) => b.bookingStatus === 'Completed').length;
    const revenue = hotelBookingsList.reduce((sum, b) => sum + (b.totalQAR || 0), 0);
    const commission = hotelBookingsList.reduce((sum, b) => sum + (b.commissionEarnedQAR || 0), 0);
    const netPayout = revenue - commission;

    return { total, checkedIn, confirmed, completed, revenue, commission, netPayout };
  }, [hotelBookingsList]);

  // Filtered Bookings Table
  const filteredBookings = useMemo(() => {
    return hotelBookingsList.filter((b) => {
      const matchSearch =
        b.guestName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.confirmationCode.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.roomType.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.guestNationality.toLowerCase().includes(bookingSearch.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [hotelBookingsList, bookingSearch, statusFilter]);

  // Voucher Verification by Code / Input
  const handleVerifyCode = (codeToTest?: string) => {
    const query = (codeToTest || verifyInput).trim().toLowerCase();
    if (!query) return;

    setVerificationFeedback(null);
    setScannedResult(null);

    // Search in current hotel's bookings first, then across all hotel bookings
    const match =
      hotelBookingsList.find(
        (b) =>
          b.confirmationCode.toLowerCase() === query ||
          b.id.toLowerCase() === query ||
          b.guestName.toLowerCase().includes(query) ||
          b.guestPhone.includes(query)
      ) ||
      hotelBookings.find(
        (b) =>
          b.confirmationCode.toLowerCase() === query ||
          b.id.toLowerCase() === query ||
          b.guestName.toLowerCase().includes(query)
      );

    if (!match) {
      setVerificationFeedback({
        type: 'error',
        message: isRtl
          ? `لم يتم العثور على حجز أو قسيمة برقم "${query}". يرجى التحقق من الرمز.`
          : `No booking or voucher found matching code "${query}". Please verify code with guest.`,
      });
      return;
    }

    setScannedResult(match);

    if (match.bookingStatus === 'Checked In') {
      setVerificationFeedback({
        type: 'already-checked-in',
        message: isRtl
          ? `النزيل مسجل وصوله بالفعل (Checked In) لهذا الحجز.`
          : `Guest has already been checked-in for this voucher reservation.`,
      });
    } else {
      setVerificationFeedback({
        type: 'success',
        message: isRtl
          ? `تم التحقق بنجاح! القسيمة معتمدة وصالحة لتسجيل الوصول.`
          : `Voucher successfully verified! Reservation is confirmed and ready for guest check-in.`,
      });
    }
  };

  // Simulate Live Camera QR Scanner
  const handleTriggerSimulatedQRScan = () => {
    setIsScanning(true);
    setVerificationFeedback(null);
    setScannedResult(null);

    // Pick a sample booking to simulate scanned QR code
    const sample =
      hotelBookingsList.find((b) => b.bookingStatus === 'Confirmed') ||
      hotelBookingsList[0] ||
      hotelBookings[0];

    setTimeout(() => {
      setIsScanning(false);
      if (sample) {
        setVerifyInput(sample.confirmationCode);
        handleVerifyCode(sample.confirmationCode);
      }
    }, 1200);
  };

  // Check In Guest & Redeem Voucher Action
  const handleCheckInGuest = (bookingId: string) => {
    const res = updateHotelBookingStatus(bookingId, 'Checked In');
    if (res.success) {
      if (scannedResult && scannedResult.id === bookingId) {
        setScannedResult({ ...scannedResult, bookingStatus: 'Checked In' });
      }
      setVerificationFeedback({
        type: 'already-checked-in',
        message: isRtl
          ? `تم تسجيل وصول النزيل وتفعيل القسيمة بنجاح في نظام الفندق!`
          : `Guest check-in confirmed and voucher redeemed successfully in hotel records!`,
      });
      addAuditLog(
        'Vendor Check-In',
        'POS',
        `Vendor (${activeHotel?.name}) checked in guest for booking #${bookingId}.`
      );
    }
  };

  if (!activeHotel) {
    return (
      <div className="p-8 text-center text-slate-500">
        No hotel vendor associated with this account.
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8 select-none">
      {/* 1. Header Card with Active Hotel Info & Property Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-amber-500/20 shrink-0">
              <Building2 className="w-7 h-7" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isRtl && activeHotel.nameAr ? activeHotel.nameAr : activeHotel.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[10px] flex items-center gap-1">
                  <span>★ {activeHotel.starRating} Stars Luxury</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                  {activeHotel.contractStatus}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeHotel.locationZone}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{activeHotel.contactPhone}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{activeHotel.contactEmail}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Hotel Property Switcher (For Admins or Multi-hotel Partners) */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                {isRtl ? 'الفندق المعتمد:' : 'Active Property:'}
              </span>
              <select
                value={selectedHotelId}
                onChange={(e) => {
                  setSelectedHotelId(e.target.value);
                  setScannedResult(null);
                  setVerificationFeedback(null);
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
              >
                {hotelVendors.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-400 text-[10px] font-mono uppercase block">
              {isRtl ? 'إجمالي الحجوزات' : 'Total Hotel Stays'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                {metrics.total}
              </span>
              <span className="text-[11px] text-slate-500">Reservations</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
            <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-mono uppercase block">
              {isRtl ? 'النزلاء المقيمون حالياً' : 'In-House Checked In'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {metrics.checkedIn}
              </span>
              <span className="text-[11px] text-emerald-600/70">Occupied Rooms</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40">
            <span className="text-blue-600 dark:text-blue-400 text-[10px] font-mono uppercase block">
              {isRtl ? 'حجوزات قادمة مؤكدة' : 'Confirmed Arrivals'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {metrics.confirmed}
              </span>
              <span className="text-[11px] text-blue-600/70">Awaiting Check-In</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40">
            <span className="text-purple-600 dark:text-purple-400 text-[10px] font-mono uppercase block">
              {isRtl ? 'إجمالي دخل الفندق' : 'Gross Hotel Revenue'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">
                {metrics.revenue.toLocaleString()}
              </span>
              <span className="text-[11px] text-purple-600/70 font-mono">QAR</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tab Switcher Banner */}
      <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-fit shadow-2xs text-xs overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('verify')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeSubTab === 'verify'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? 'التحقق من القسائم ومسح QR' : 'Voucher Verification & QR Scanner'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeSubTab === 'bookings'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>
            {isRtl ? 'سجل حجوزات الفندق' : 'Hotel Bookings & Guests'} ({hotelBookingsList.length})
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('rooms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeSubTab === 'rooms'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BedDouble className="w-4 h-4 text-amber-400" />
          <span>{isRtl ? 'فئات الغرف والأسعار' : 'Room Categories & Rates'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('desks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeSubTab === 'desks'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4 text-sky-400" />
          <span>{isRtl ? 'كاونترات الاستقبال بالفندق' : 'Lobby Desks & Staff'}</span>
        </button>
      </div>

      {/* ======================= TAB 1: VOUCHER & QR CODE VERIFICATION ======================= */}
      {activeSubTab === 'verify' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Input + Simulated QR Scanner (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>QTA Verified Hospitality Gateway</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  {isRtl ? 'التحقق من قسيمة النزيل (QR Code / Voucher Code)' : 'Guest Voucher Verification Engine'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRtl
                    ? 'امسح رمز الاستجابة السريعة (QR) أو أدخل رقم الحجز للتأكد من صحة الدفع والحجز قبل تسليم الغرفة.'
                    : 'Scan customer digital QR voucher or enter confirmation code to verify booking & payment before room check-in.'}
                </p>
              </div>

              {/* Input Form */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {isRtl ? 'رقم القسيمة أو رمز التأكيد (Confirmation Code / PNR)' : 'Voucher Code / Confirmation Ref'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={verifyInput}
                      onChange={(e) => setVerifyInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
                      placeholder="e.g. HTL-QA-9042 or guest name"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 pl-9 rtl:pl-3 rtl:pr-9 text-slate-900 dark:text-white font-mono text-xs outline-none focus:border-blue-500 uppercase transition"
                    />
                  </div>

                  <button
                    onClick={() => handleVerifyCode()}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer active:scale-95 shrink-0"
                  >
                    {isRtl ? 'تحقق الآن' : 'Verify Code'}
                  </button>
                </div>
              </div>

              {/* Simulated QR Camera Viewfinder */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center relative overflow-hidden">
                <div className="relative max-w-xs mx-auto aspect-square rounded-2xl border-2 border-dashed border-emerald-500/40 bg-slate-900/60 flex flex-col items-center justify-center p-4">
                  {/* Viewfinder Target Corners */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                  {/* Laser Scan Animation Line */}
                  <div className="absolute inset-x-2 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce opacity-80" />

                  {/* Center Icon & Instruction */}
                  <Camera className="w-10 h-10 text-emerald-400/80 mb-2 animate-pulse" />
                  <span className="text-xs font-bold text-white">
                    {isScanning
                      ? isRtl
                        ? 'جارٍ مسح الرمز ضوئياً...'
                        : 'Scanning customer QR code...'
                      : isRtl
                      ? 'كاميرا مسح رمز QR المباشر'
                      : 'Live Camera QR Viewfinder'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">
                    Point guest digital screen to camera
                  </span>

                  <button
                    onClick={handleTriggerSimulatedQRScan}
                    disabled={isScanning}
                    className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Scan className="w-4 h-4" />
                    <span>{isScanning ? 'Decoding...' : 'Simulate Scan Customer QR'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Sample Test Chips */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1.5">
                  {isRtl ? 'نماذج جاهزة للاختبار الفوري:' : 'Click to Test Real Vouchers for this Hotel:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {hotelBookingsList.slice(0, 4).map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setVerifyInput(b.confirmationCode);
                        handleVerifyCode(b.confirmationCode);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 text-[11px] font-mono transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="font-bold text-blue-600 dark:text-blue-400">{b.confirmationCode}</span>
                      <span className="text-slate-400">({b.guestName.split(' ')[0]})</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-700">
                        {b.bookingStatus}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Verification Result Card (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-4">
            {verificationFeedback && (
              <div
                className={`p-4 rounded-2xl text-xs flex items-center gap-3 animate-in fade-in ${
                  verificationFeedback.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : verificationFeedback.type === 'already-checked-in'
                    ? 'bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300'
                }`}
              >
                {verificationFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                ) : verificationFeedback.type === 'already-checked-in' ? (
                  <BadgeCheck className="w-5 h-5 shrink-0 text-blue-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                )}
                <div className="font-medium">{verificationFeedback.message}</div>
              </div>
            )}

            {scannedResult ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden animate-in fade-in zoom-in-95">
                {/* Security Verification Watermark */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block">
                        Official Verified Qatar Voucher
                      </span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white font-mono">
                        {scannedResult.confirmationCode}
                      </h4>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      scannedResult.bookingStatus === 'Checked In'
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        : scannedResult.bookingStatus === 'Confirmed'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {scannedResult.bookingStatus === 'Checked In'
                      ? '✓ Checked-In (In House)'
                      : '✓ Verified & Confirmed'}
                  </span>
                </div>

                {/* Guest Profile Grid */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Primary Guest</span>
                    <span className="font-extrabold text-slate-900 dark:text-white block mt-0.5">
                      {scannedResult.guestName}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {scannedResult.guestNationality} · {scannedResult.paxAdults} Adults
                      {scannedResult.paxChildren > 0 ? `, ${scannedResult.paxChildren} Kids` : ''}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Contact Phone</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 block mt-0.5">
                      {scannedResult.guestPhone}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono truncate block">
                      {scannedResult.guestEmail}
                    </span>
                  </div>
                </div>

                {/* Stay Details */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-start justify-between p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                    <div>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase font-mono block">
                        Reserved Room Type
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                        {scannedResult.roomType}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Utensils className="w-3 h-3 text-amber-500" />
                        <span>Meal Plan: {scannedResult.mealPlan}</span>
                      </span>
                    </div>

                    <div className="text-right rtl:text-left">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Nights</span>
                      <span className="font-black text-slate-900 dark:text-white text-base font-mono">
                        {scannedResult.nights} Nights
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Check-In</span>
                      <span className="font-bold text-slate-900 dark:text-white">{scannedResult.checkInDate}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Check-Out</span>
                      <span className="font-bold text-slate-900 dark:text-white">{scannedResult.checkOutDate}</span>
                    </div>
                  </div>
                </div>

                {/* Payment & Voucher Status Card */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-300 font-bold block">
                      Billing & Settlement
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-base font-mono">
                      {scannedResult.totalQAR.toLocaleString()} QAR
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      ✓ {scannedResult.paymentStatus} ({scannedResult.paymentMethod})
                    </span>
                  </div>

                  <div className="text-right rtl:text-left">
                    <span className="text-[10px] text-slate-500 block">Booked Via:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                      {scannedResult.bookingSource}
                    </span>
                  </div>
                </div>

                {/* Special Requests */}
                {scannedResult.specialRequests && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Guest Notes:</span>
                    <span>{scannedResult.specialRequests}</span>
                  </div>
                )}

                {/* Main Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  {scannedResult.bookingStatus !== 'Checked In' ? (
                    <button
                      onClick={() => handleCheckInGuest(scannedResult.id)}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isRtl ? 'تأكيد وصول النزيل واستلام الغرفة' : 'Check In Guest & Redeem Voucher'}</span>
                    </button>
                  ) : (
                    <div className="flex-1 py-2.5 px-4 rounded-xl bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-blue-500" />
                      <span>{isRtl ? 'النزيل مقيم حالياً بالفندق' : 'Guest Currently In-House'}</span>
                    </div>
                  )}

                  <button
                    onClick={() => openModal('qr-voucher', { booking: scannedResult })}
                    className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer shrink-0"
                    title="View & Print Full Customer Voucher"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Empty state before scanning */
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 shadow-xs text-center flex flex-col items-center justify-center h-full min-h-[360px]">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 mb-4 border border-slate-200 dark:border-slate-700">
                  <QrCode className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isRtl ? 'في انتظار مسح أو إدخال القسيمة' : 'Waiting for Voucher QR Scan or Code'}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                  {isRtl
                    ? 'وجه كاميرا الماسح نحو رمز الـ QR الخاص بالنزيل، أو اختر أحد الحجوزات النموذجية للتحقق الفوري.'
                    : 'Use the QR scanner on the left or enter a confirmation reference to instantly load verified guest details.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB 2: HOTEL BOOKINGS TABLE ======================= */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder={isRtl ? 'بحث باسم النزيل، رقم الحجز، نوع الغرفة...' : 'Search guest name, voucher code, room...'}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 pl-9 rtl:pl-3 rtl:pr-9 text-slate-900 dark:text-white text-xs outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="ALL">{isRtl ? 'جميع الحالات' : 'All Status'}</option>
                <option value="Confirmed">{isRtl ? 'مؤكد (قادم)' : 'Confirmed (Upcoming)'}</option>
                <option value="Checked In">{isRtl ? 'مسجل وصوله (In-House)' : 'Checked In'}</option>
                <option value="Completed">{isRtl ? 'مكتمل' : 'Completed'}</option>
                <option value="Cancelled">{isRtl ? 'ملغى' : 'Cancelled'}</option>
              </select>

              <span className="text-[11px] text-slate-400 font-mono shrink-0 px-1">
                {filteredBookings.length} / {hotelBookingsList.length}
              </span>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">{isRtl ? 'رمز القسيمة' : 'Voucher Code'}</th>
                    <th className="py-3 px-4">{isRtl ? 'اسم النزيل' : 'Guest Details'}</th>
                    <th className="py-3 px-4">{isRtl ? 'فئة الغرفة' : 'Room Type'}</th>
                    <th className="py-3 px-4">{isRtl ? 'تواريخ الإقامة' : 'Stay Dates'}</th>
                    <th className="py-3 px-4">{isRtl ? 'المبلغ الإجمالي' : 'Total (QAR)'}</th>
                    <th className="py-3 px-4">{isRtl ? 'حالة الحجز' : 'Status'}</th>
                    <th className="py-3 px-4 text-center">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        No hotel bookings found matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {b.confirmationCode}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {b.guestName}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            {b.guestNationality} · {b.guestPhone}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {b.roomType}
                          </span>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 block">
                            {b.mealPlan}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <div>
                            <span className="font-semibold">{b.checkInDate}</span>
                            <span className="text-slate-400"> → </span>
                            <span className="font-semibold">{b.checkOutDate}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-sans block">
                            {b.nights} Nights
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          <div>{b.totalQAR.toLocaleString()} QAR</div>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-medium block">
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              b.bookingStatus === 'Checked In'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                : b.bookingStatus === 'Confirmed'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Verify Button */}
                            <button
                              onClick={() => {
                                setVerifyInput(b.confirmationCode);
                                setActiveSubTab('verify');
                                handleVerifyCode(b.confirmationCode);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-[11px] border border-blue-200 dark:border-blue-800 transition cursor-pointer"
                              title="Verify Voucher in QR Engine"
                            >
                              Verify
                            </button>

                            {/* View Voucher Modal */}
                            <button
                              onClick={() => openModal('qr-voucher', { booking: b })}
                              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                              title="Print / View Voucher"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 3: ROOM CATEGORIES ======================= */}
      {activeSubTab === 'rooms' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeHotel.roomOptions.map((room, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <BedDouble className="w-4 h-4" />
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                  {room.ratePerNightQAR} QAR <span className="text-xs text-slate-400 font-normal">/ night</span>
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {room.roomType}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {room.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Capacity: Max {room.maxPax} Guests</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {hotelBookingsList.filter((b) => b.roomType === room.roomType).length} Booked
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================= TAB 4: LOBBY DESKS ======================= */}
      {activeSubTab === 'desks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeHotel.desks.map((desk) => (
            <div
              key={desk.deskCode}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800">
                  {desk.deskCode}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                  {desk.status}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {desk.deskName}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{desk.locationInHotel}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Staff: {desk.assignedStaff}</span>
                <span className="font-mono">{desk.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

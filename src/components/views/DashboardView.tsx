import React from 'react';
import { TopMetricCards } from '../widgets/TopMetricCards';
import { FlightTransitMapWidget } from '../widgets/FlightTransitMapWidget';
import { BookingTrendsWidget } from '../widgets/BookingTrendsWidget';
import { LiveAirportBookingsWidget } from '../widgets/LiveAirportBookingsWidget';
import { DailyEODShiftWidget } from '../widgets/DailyEODShiftWidget';
import { DateFilterBar } from '../common/DateFilterBar';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const { dateFilter, setDateFilter, bookings, language } = useApp();

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Top Metric Cards (4 KPIs) */}
      <TopMetricCards />

      {/* Date & Year Filter Engine */}
      <DateFilterBar
        filter={dateFilter}
        onChange={setDateFilter}
        totalCount={bookings.length}
        label={language === 'ar' ? 'تصفية مؤشرات المنظومة حسب التاريخ والسنة' : 'System Operations Date & Year Filter'}
      />

      {/* 2. Middle Main Analytics & Maps Widget */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <FlightTransitMapWidget />
        <BookingTrendsWidget />
      </div>

      {/* 3. Bottom Section: Live Airport Desk Bookings (Left) & EOD Shift Reconciliation (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8">
          <LiveAirportBookingsWidget />
        </div>
        <div className="xl:col-span-4">
          <DailyEODShiftWidget />
        </div>
      </div>
    </div>
  );
};

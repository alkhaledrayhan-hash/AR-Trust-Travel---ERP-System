import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BookingTrendsWidget: React.FC = () => {
  const { language, convertAmount } = useApp();
  const [timeline, setTimeline] = useState<'today' | '7d' | '30d'>('today');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Hourly dataset for Today
  const hourlyData = [
    { time: '06:00', desk: 4, online: 3, deskVal: 1600, onlineVal: 1200 },
    { time: '08:00', desk: 8, online: 6, deskVal: 3200, onlineVal: 2400 },
    { time: '10:00', desk: 14, online: 9, deskVal: 5800, onlineVal: 3600 },
    { time: '12:00', desk: 22, online: 15, deskVal: 9100, onlineVal: 6200 },
    { time: '14:00', desk: 18, online: 12, deskVal: 7600, onlineVal: 4900 },
    { time: '16:00', desk: 26, online: 16, deskVal: 11200, onlineVal: 6800 },
    { time: '18:00', desk: 29, online: 21, deskVal: 13400, onlineVal: 9100 },
    { time: '20:00', desk: 20, online: 17, deskVal: 8800, onlineVal: 7400 },
  ];

  // SVG Chart Dimensions
  const width = 500;
  const height = 160;
  const paddingX = 30;
  const paddingY = 20;

  const maxVal = 32;

  const getX = (index: number) =>
    paddingX + (index * (width - 2 * paddingX)) / (hourlyData.length - 1);
  const getY = (val: number) =>
    height - paddingY - (val * (height - 2 * paddingY)) / maxVal;

  // Generate SVG path strings
  const deskPoints = hourlyData.map((d, i) => `${getX(i)},${getY(d.desk)}`).join(' ');
  const onlinePoints = hourlyData.map((d, i) => `${getX(i)},${getY(d.online)}`).join(' ');

  const deskArea = `${deskPoints} ${getX(hourlyData.length - 1)},${height - paddingY} ${getX(0)},${height - paddingY}`;
  const onlineArea = `${onlinePoints} ${getX(hourlyData.length - 1)},${height - paddingY} ${getX(0)},${height - paddingY}`;

  const currentHover = hoveredPoint !== null ? hourlyData[hoveredPoint] : hourlyData[hourlyData.length - 1];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'ar' ? 'مؤشر مبيعات القنوات (أونلاين مقابل كاونتر المطار)' : 'Booking Channel Trends (Online vs. Airport Desk)'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'ar'
              ? 'مقارنة حجم الحجوزات اللحظية والإيراد عبر منافذ البيع'
              : 'Real-time sales velocity & channel distribution'}
          </p>
        </div>

        {/* Time period switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setTimeline('today')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              timeline === 'today'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {language === 'ar' ? 'اليوم' : 'Today'}
          </button>
          <button
            onClick={() => setTimeline('7d')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              timeline === '7d'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {language === 'ar' ? '7 أيام' : '7 Days'}
          </button>
          <button
            onClick={() => setTimeline('30d')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              timeline === '30d'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {language === 'ar' ? '30 يوماً' : '30 Days'}
          </button>
        </div>
      </div>

      {/* Metric Breakdown Row */}
      <div className="grid grid-cols-2 gap-3 my-3">
        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className="font-medium text-emerald-800 dark:text-emerald-300">
                {language === 'ar' ? 'كاونتر المطار (HIA Desk)' : 'HIA Airport Desk'}
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              +24% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              68
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({convertAmount(58650).formatted})
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
              <span className="font-medium text-blue-800 dark:text-blue-300">
                {language === 'ar' ? 'أونلاين ووكالات السفر (Web/OTA)' : 'Online Web & OTA'}
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              +12% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              52
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({convertAmount(44300).formatted})
            </span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-40 overflow-visible"
        >
          <defs>
            <linearGradient id="deskFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="onlineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 10, 20, 30].map((v) => (
            <line
              key={v}
              x1={paddingX}
              y1={getY(v)}
              x2={width - paddingX}
              y2={getY(v)}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
              strokeDasharray="3 3"
              strokeWidth="0.8"
            />
          ))}

          {/* Shaded Areas */}
          <polygon points={deskArea} fill="url(#deskFill)" />
          <polygon points={onlineArea} fill="url(#onlineFill)" />

          {/* Polyline strokes */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={deskPoints}
          />
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={onlinePoints}
          />

          {/* Data Points */}
          {hourlyData.map((d, i) => {
            const x = getX(i);
            const yDesk = getY(d.desk);
            const yOnline = getY(d.online);
            const isHovered = hoveredPoint === i;

            return (
              <g key={d.time} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(i)}>
                {/* Vertical cursor guide when hovered */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={height - paddingY}
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}
                {/* Desk dot */}
                <circle
                  cx={x}
                  cy={yDesk}
                  r={isHovered ? 5 : 3.5}
                  className="fill-emerald-500 stroke-white dark:stroke-slate-900 transition-all"
                  strokeWidth="2"
                />
                {/* Online dot */}
                <circle
                  cx={x}
                  cy={yOnline}
                  r={isHovered ? 5 : 3.5}
                  className="fill-blue-500 stroke-white dark:stroke-slate-900 transition-all"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>

        {/* X-Axis Labels */}
        <div className="flex justify-between px-6 text-[10px] font-mono text-slate-400 mt-1">
          {hourlyData.map((d, i) => (
            <span
              key={d.time}
              onMouseEnter={() => setHoveredPoint(i)}
              className={`cursor-pointer transition-colors ${
                hoveredPoint === i ? 'text-slate-900 dark:text-white font-bold' : ''
              }`}
            >
              {d.time}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Tooltip Footer */}
      <div className="mt-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
            {currentHover.time}:
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
            Desk: {currentHover.desk} bookings ({convertAmount(currentHover.deskVal).formatted})
          </span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold font-mono">
            Web: {currentHover.online} bookings
          </span>
        </div>
        <span className="text-[10px] text-slate-400">Peak hour: 18:00 (Qatar Eve Arrivals)</span>
      </div>
    </div>
  );
};

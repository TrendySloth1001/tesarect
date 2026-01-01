'use client';

import { useState, useEffect } from 'react';

interface DayData {
  date: string;
  count: number;
  commits: Array<{
    sha: string;
    message: string;
    author: string;
  }>;
  level: number;
}

interface HeatmapProps {
  days: DayData[];
}

export default function GitHeatmap({ days }: HeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthsToShow, setMonthsToShow] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setMonthsToShow(window.innerWidth < 1024 ? 1 : 2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate all days for the selected month(s)
  const generateMonthDays = () => {
    const result: DayData[] = [];
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthsToShow, 0);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const existingDay = days.find(day => day.date === dateStr);
      result.push(existingDay || { date: dateStr, count: 0, commits: [], level: 0 });
    }
    return result;
  };

  const filteredDays = generateMonthDays();

  // Group days by week
  const weeks: DayData[][] = [];
  let currentWeek: DayData[] = [];
  
  // Start from the first day and pad to start on Sunday
  const firstDay = new Date(filteredDays[0]?.date || new Date());
  const firstDayOfWeek = firstDay.getDay();
  
  // Add empty days to align to Sunday
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: '', count: 0, commits: [], level: 0 });
  }
  
  filteredDays.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', count: 0, commits: [], level: 0 });
    }
    weeks.push(currentWeek);
  }

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - monthsToShow, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + monthsToShow, 1));
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return currentDate.getMonth() === now.getMonth() && currentDate.getFullYear() === now.getFullYear();
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-900';
      case 1: return 'bg-green-900';
      case 2: return 'bg-green-700';
      case 3: return 'bg-green-500';
      case 4: return 'bg-green-400';
      default: return 'bg-gray-900';
    }
  };

  const handleMouseEnter = (day: DayData) => {
    if (day.date) {
      setHoveredDay(day);
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Heatmap grid */}
      <div className="flex-1 overflow-x-auto">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-sm font-medium">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            {monthsToShow === 2 && ' - ' + new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <button
            onClick={goToNextMonth}
            disabled={isCurrentMonth()}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex gap-1 min-w-max">
          {/* Day labels */}
          <div className="flex flex-col gap-1 text-xs text-gray-500 justify-around">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.map((day, dayIdx) => (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    className={`w-7 h-7 rounded-sm flex items-center justify-center text-[10px] font-medium ${
                      day.date ? getLevelColor(day.level) : 'bg-transparent'
                    } ${day.date ? 'cursor-pointer hover:ring-2 hover:ring-white' : ''}`}
                    onMouseEnter={() => handleMouseEnter(day)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {day.date && new Date(day.date).getDate()}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-900 rounded-sm" />
            <div className="w-3 h-3 bg-green-900 rounded-sm" />
            <div className="w-3 h-3 bg-green-700 rounded-sm" />
            <div className="w-3 h-3 bg-green-500 rounded-sm" />
            <div className="w-3 h-3 bg-green-400 rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Info Panel */}
      <div className="w-full lg:w-80 rounded-lg p-4" style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        minHeight: '200px'
      }}>
        {hoveredDay ? (
          <>
            <div className="text-white font-semibold mb-1">
              {new Date(hoveredDay.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-gray-300 text-sm mb-3">
              {hoveredDay.count} {hoveredDay.count === 1 ? 'commit' : 'commits'}
            </div>
            {hoveredDay.commits.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {hoveredDay.commits.slice(0, 10).map((commit) => (
                  <div key={commit.sha} className="text-xs text-gray-400 border-l-2 border-gray-700 pl-2">
                    <span className="text-gray-500 font-mono block">{commit.sha}</span>
                    <span className="text-gray-300">{commit.message.split('\n')[0]}</span>
                  </div>
                ))}
                {hoveredDay.commits.length > 10 && (
                  <div className="text-xs text-gray-500">
                    +{hoveredDay.commits.length - 10} more
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500 text-sm">
            Hover over a day to see commit details
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { getTodayDateString } from '../utils/transitEngine';

interface CustomDatePickerModalProps {
  isOpen: boolean;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onClose: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const CustomDatePickerModal: React.FC<CustomDatePickerModalProps> = ({
  isOpen,
  selectedDate,
  onSelectDate,
  onClose
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const todayStr = getTodayDateString();
  const todayDate = new Date();
  const currentYear = todayDate.getFullYear();
  const currentMonth = todayDate.getMonth();

  // Parse initial view from selectedDate or today
  const [viewYear, setViewYear] = useState<number>(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) return parseInt(parts[0], 10);
    }
    return currentYear;
  });

  const [viewMonth, setViewMonth] = useState<number>(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) return parseInt(parts[1], 10) - 1;
    }
    return currentMonth;
  });

  // Sync view when selectedDate changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (selectedDate) {
        const parts = selectedDate.split('-');
        if (parts.length === 3) {
          setViewYear(parseInt(parts[0], 10));
          setViewMonth(parseInt(parts[1], 10) - 1);
        }
      } else {
        setViewYear(currentYear);
        setViewMonth(currentMonth);
      }
    }
  }, [isOpen, selectedDate, currentYear, currentMonth]);

  // Handle escape key and click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Month calculations
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Check if previous month is entirely in the past
  const isPrevDisabled =
    viewYear < currentYear || (viewYear === currentYear && viewMonth <= currentMonth);

  const handlePrevMonth = () => {
    if (isPrevDisabled) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    // Cap at 1 year ahead
    if (viewYear > currentYear + 1) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Build grid
  const prevDays = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    prevDays.push(daysInPrevMonth - i);
  }

  const currentDays = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    const dateStr = `${viewYear}-${mStr}-${dStr}`;
    const isPast = dateStr < todayStr;
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedDate;
    currentDays.push({ d, dateStr, isPast, isToday, isSelected });
  }

  const totalOccupied = prevDays.length + currentDays.length;
  const totalCells = totalOccupied > 35 ? 42 : 35;
  const nextDays = [];
  for (let n = 1; n <= totalCells - totalOccupied; n++) {
    nextDays.push(n);
  }

  // Quick action shortcuts
  const selectToday = () => {
    onSelectDate(todayStr);
    onClose();
  };

  const selectTomorrow = () => {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    const y = tom.getFullYear();
    const m = String(tom.getMonth() + 1).padStart(2, '0');
    const d = String(tom.getDate()).padStart(2, '0');
    onSelectDate(`${y}-${m}-${d}`);
    onClose();
  };

  return (
    <div
      className="custom-calendar-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Choose travel date"
    >
      <div className="custom-calendar-card" ref={modalRef}>
        {/* Header Bar */}
        <div className="custom-calendar-header">
          <div className="flex items-center gap-2">
            <div className="custom-calendar-icon-badge">
              <Calendar className="w-4 h-4 text-[var(--coral)]" />
            </div>
            <div>
              <div className="custom-calendar-title">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </div>
              <div className="custom-calendar-subtitle">
                Select your Punjab journey date
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="custom-calendar-nav-btn"
              onClick={handlePrevMonth}
              disabled={isPrevDisabled}
              title="Previous month"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="custom-calendar-nav-btn"
              onClick={handleNextMonth}
              title="Next month"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="custom-calendar-close-btn"
              onClick={onClose}
              title="Close calendar"
              aria-label="Close calendar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="custom-calendar-weekdays" aria-hidden="true">
          {WEEKDAY_NAMES.map((name, idx) => (
            <div
              key={name}
              className={`custom-calendar-weekday ${idx === 0 ? 'sun' : ''}`}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Month Days Grid */}
        <div className="custom-calendar-grid" role="grid">
          {/* Previous Month Padding */}
          {prevDays.map((pd) => (
            <div key={`prev-${pd}`} className="custom-calendar-cell disabled-pad" aria-hidden="true">
              <span>{pd}</span>
            </div>
          ))}

          {/* Current Month Active Days */}
          {currentDays.map(({ d, dateStr, isPast, isToday, isSelected }) => {
            if (isPast) {
              return (
                <div
                  key={dateStr}
                  className="custom-calendar-cell disabled-past"
                  title="Past date not selectable"
                >
                  <span>{d}</span>
                </div>
              );
            }

            return (
              <button
                key={dateStr}
                type="button"
                className={`custom-calendar-cell day-btn ${isSelected ? 'selected' : ''} ${
                  isToday ? 'today' : ''
                }`}
                onClick={() => {
                  onSelectDate(dateStr);
                  onClose();
                }}
                title={isToday ? `Today (${d} ${MONTH_NAMES[viewMonth]})` : `${d} ${MONTH_NAMES[viewMonth]} ${viewYear}`}
                aria-pressed={isSelected}
              >
                <span className="day-num">{d}</span>
                {isToday && !isSelected && <span className="today-dot" title="Today" />}
              </button>
            );
          })}

          {/* Next Month Padding */}
          {nextDays.map((nd) => (
            <div key={`next-${nd}`} className="custom-calendar-cell disabled-pad" aria-hidden="true">
              <span>{nd}</span>
            </div>
          ))}
        </div>

        {/* Quick action footer */}
        <div className="custom-calendar-footer">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              className={`custom-calendar-quick-btn ${selectedDate === todayStr ? 'active' : ''}`}
              onClick={selectToday}
            >
              Today
            </button>
            <button
              type="button"
              className="custom-calendar-quick-btn"
              onClick={selectTomorrow}
            >
              Tomorrow
            </button>
          </div>

          <button
            type="button"
            className="custom-calendar-done-btn"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

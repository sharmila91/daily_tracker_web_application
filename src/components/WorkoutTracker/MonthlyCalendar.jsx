import { useState } from 'react';
import { getCalendarDays, formatDate, getNextMonth, getPreviousMonth } from '../../utils/dateHelpers';
import { useWorkoutData } from '../../hooks/useLocalStorage';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MonthlyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { toggleWorkoutDay, isWorkoutDay } = useWorkoutData();
  
  const calendarDays = getCalendarDays(currentDate);
  const monthYear = formatDate(currentDate, 'MMMM yyyy');

  const handleDayClick = (dayInfo) => {
    if (dayInfo) {
      toggleWorkoutDay(dayInfo.year, dayInfo.month, dayInfo.day);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(getPreviousMonth(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(getNextMonth(currentDate));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePreviousMonth}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          ← Prev
        </button>
        
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-gray-800">{monthYear}</h2>
          <button
            onClick={handleToday}
            className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
          >
            Today
          </button>
        </div>
        
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Next month"
        >
          Next →
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((dayInfo, index) => {
          if (!dayInfo) {
            // Empty cell for padding
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const isMarked = isWorkoutDay(dayInfo.year, dayInfo.month, dayInfo.day);
          const isTodayDate = dayInfo.isToday;

          return (
            <button
              key={index}
              onClick={() => handleDayClick(dayInfo)}
              className={`
                aspect-square rounded-lg flex items-center justify-center
                text-lg font-medium transition-all duration-200
                hover:scale-105 active:scale-95
                ${isMarked 
                  ? 'bg-green-500 text-white hover:bg-green-600 shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                ${isTodayDate && !isMarked ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                ${isTodayDate && isMarked ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
              `}
              aria-label={`${dayInfo.day} ${isMarked ? 'marked' : 'unmarked'}`}
            >
              <span className={isMarked ? 'relative' : ''}>
                {dayInfo.day}
                {isMarked && (
                  <span className="absolute -top-1 -right-1 text-xs">✓</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded"></div>
          <span className="text-gray-600">Workout Done</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 rounded"></div>
          <span className="text-gray-600">No Workout</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 rounded ring-2 ring-blue-500"></div>
          <span className="text-gray-600">Today</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Click on any day to mark/unmark your workout attendance
      </div>
    </div>
  );
}

// Made with Bob

import { useState } from 'react';
import { useMedicineData } from '../../hooks/useLocalStorage';
import { getCurrentDateInfo, getDateKey, formatDate } from '../../utils/dateHelpers';

export default function DailyChecklist() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getMedicineForDate, toggleMedicine, isMedicineTaken, getDayCompletionRate } = useMedicineData();
  
  const dateKey = getDateKey(selectedDate);
  const formattedDate = formatDate(selectedDate, 'EEEE, MMMM d, yyyy');
  const completionRate = getDayCompletionRate(dateKey);
  const currentDateInfo = getCurrentDateInfo();
  const isToday = dateKey === currentDateInfo.dateKey;
  
  // Get the medicine for this specific day
  const todaysMedicine = getMedicineForDate(dateKey);

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleToggle = () => {
    toggleMedicine(dateKey, todaysMedicine.id);
  };

  const isTaken = isMedicineTaken(dateKey, todaysMedicine.id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header with date navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePreviousDay}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Previous day"
        >
          ← Prev
        </button>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center">
            {formattedDate}
          </h2>
          {!isToday && (
            <button
              onClick={handleToday}
              className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
            >
              Go to Today
            </button>
          )}
          {isToday && (
            <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md">
              Today
            </span>
          )}
        </div>
        
        <button
          onClick={handleNextDay}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Next day"
        >
          Next →
        </button>
      </div>

      {/* Completion progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Daily Progress</span>
          <span className="text-sm font-semibold text-gray-800">{Math.round(completionRate)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Medicine rotation info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 text-center">
          <span className="font-semibold">Rotating Schedule:</span> Each day shows one medicine. 
          Navigate through days to see the rotation pattern.
        </p>
      </div>

      {/* Today's Medicine Card */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          Today's Medicine
        </h3>
        
        <div
          className={`
            flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-200
            ${isTaken 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-lg' 
              : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300 shadow-md'
            }
          `}
        >
          <div className="flex items-center gap-4">
            {/* Medicine Icon */}
            <div className={`
              text-5xl p-3 rounded-full
              ${isTaken ? 'bg-green-100' : 'bg-gray-100'}
            `}>
              {todaysMedicine.icon}
            </div>
            
            <div>
              <h3 className={`text-2xl font-bold ${isTaken ? 'text-green-800' : 'text-gray-800'}`}>
                {todaysMedicine.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {isTaken ? '✓ Taken today' : 'Not taken yet'}
              </p>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={handleToggle}
            className={`
              w-20 h-20 rounded-full flex items-center justify-center
              transition-all duration-200 transform hover:scale-110 active:scale-95
              ${isTaken
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                : 'bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-green-400'
              }
            `}
            aria-label={`Mark ${todaysMedicine.name} as ${isTaken ? 'not taken' : 'taken'}`}
          >
            {isTaken ? (
              <svg
                className="w-10 h-10"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-3xl text-gray-400">○</span>
            )}
          </button>
        </div>
      </div>

      {/* Completion message */}
      {isTaken && (
        <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg text-center border border-green-300">
          <p className="text-green-800 font-semibold text-lg">
            🎉 Great job! Medicine taken for today!
          </p>
        </div>
      )}

      {/* Weekly Preview */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">
          7-Day Medicine Schedule
        </h4>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date(selectedDate);
            date.setDate(date.getDate() - 3 + i);
            const key = getDateKey(date);
            const medicine = getMedicineForDate(key);
            const taken = isMedicineTaken(key, medicine.id);
            const isCurrentDay = key === dateKey;
            
            return (
              <div
                key={i}
                className={`
                  p-2 rounded-lg text-center transition-all
                  ${isCurrentDay 
                    ? 'bg-blue-100 border-2 border-blue-500 shadow-md' 
                    : 'bg-white border border-gray-200'
                  }
                `}
              >
                <div className="text-xs text-gray-600 mb-1">
                  {formatDate(date, 'EEE')}
                </div>
                <div className="text-2xl mb-1">{medicine.icon}</div>
                <div className="text-xs font-medium text-gray-700 truncate">
                  {medicine.name.split(' ')[0]}
                </div>
                {taken && (
                  <div className="text-green-600 text-xs mt-1">✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Click the circle button to mark medicine as taken/not taken
      </div>
    </div>
  );
}

// Made with Bob

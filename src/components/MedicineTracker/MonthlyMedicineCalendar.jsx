import { useState } from 'react';
import { getCalendarDays, formatDate, getNextMonth, getPreviousMonth, getDateKey } from '../../utils/dateHelpers';
import { useMedicineData } from '../../hooks/useLocalStorage';
import MedicineSelectionModal from './MedicineSelectionModal';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MonthlyMedicineCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    getMedicineForDate,
    getRecommendedMedicine,
    saveMedicineSelection,
    getDayMedicineData,
    medicineList
  } = useMedicineData();
  
  const calendarDays = getCalendarDays(currentDate);
  const monthYear = formatDate(currentDate, 'MMMM yyyy');

  const handleDayClick = (dayInfo) => {
    if (dayInfo) {
      setSelectedDate(dayInfo);
      setIsModalOpen(true);
    }
  };

  const handleModalSave = (data) => {
    if (selectedDate) {
      const dateKey = getDateKey(selectedDate.date);
      saveMedicineSelection(dateKey, data);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
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

      {/* Medicine selection info */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 text-center">
          <span className="font-semibold">Smart Selection:</span> Click any day to select your medicine. Recommendations based on your recent choices.
        </p>
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

          const dateKey = getDateKey(dayInfo.date);
          const dayData = getDayMedicineData(dateKey);
          const medicine = getMedicineForDate(dateKey);
          const recommendedMedicine = getRecommendedMedicine(dateKey);
          const isTaken = dayData?.taken || false;
          const isRecommended = medicine.id === recommendedMedicine?.id;
          const isTodayDate = dayInfo.isToday;

          return (
            <button
              key={index}
              onClick={() => handleDayClick(dayInfo)}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center
                text-lg font-medium transition-all duration-200
                hover:scale-105 active:scale-95 relative
                ${isTaken 
                  ? 'bg-green-500 text-white hover:bg-green-600 shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                ${isTodayDate && !isTaken ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                ${isTodayDate && isTaken ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
              `}
              aria-label={`${dayInfo.day} - ${medicine.name} ${isTaken ? 'taken' : 'not taken'}`}
            >
              {/* Day number */}
              <span className="text-sm font-semibold mb-1">{dayInfo.day}</span>
              
              {/* Medicine icon - only show if taken */}
              {isTaken && (
                <span className="text-2xl">{medicine.icon}</span>
              )}
              
              {/* Checkmark if taken */}
              {isTaken && (
                <span className="absolute top-1 right-1 text-xs">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white text-xs">✓</div>
            <span className="text-gray-600">Medicine Taken</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-100 rounded"></div>
            <span className="text-gray-600">Not Taken</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-100 rounded ring-2 ring-blue-500"></div>
            <span className="text-gray-600">Today</span>
          </div>
        </div>

        {/* Medicine icons legend */}
        <div className="flex flex-wrap gap-4 justify-center text-sm pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐟</span>
            <span className="text-gray-600">Fish Oil</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💊</span>
            <span className="text-gray-600">Multivitamin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔶</span>
            <span className="text-gray-600">Vitamin B Complex</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Click on any day to select and track your medicine. ★ indicates recommended medicine based on your routine.
      </div>

      {/* Medicine Selection Modal */}
      {selectedDate && (
        <MedicineSelectionModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          date={selectedDate.date}
          dateString={getDateKey(selectedDate.date)}
          currentSelection={getDayMedicineData(getDateKey(selectedDate.date))}
          recommendedMedicine={getRecommendedMedicine(getDateKey(selectedDate.date))}
          medicineList={medicineList}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

// Made with Bob

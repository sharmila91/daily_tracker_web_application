import { useWorkoutData, useMedicineData } from '../../hooks/useLocalStorage';
import { getCurrentDateInfo, getDateKey } from '../../utils/dateHelpers';
import {
  calculateWorkoutStreak,
  calculateLongestWorkoutStreak,
  calculateMedicineStreak,
  calculateLongestMedicineStreak,
  getMonthProgress,
  getWeekSummary,
  getTotalStats,
  getMedicineComplianceRate
} from '../../utils/statsHelpers';

export default function Overview() {
  const { workouts, toggleWorkoutDay, isWorkoutDay } = useWorkoutData();
  const {
    medicines,
    getMedicineForDate,
    getRecommendedMedicine,
    toggleMedicine,
    getDayMedicineData
  } = useMedicineData();
  
  const currentDateInfo = getCurrentDateInfo();
  const todayKey = currentDateInfo.dateKey;
  const todaysMedicine = getMedicineForDate(todayKey);
  const recommendedMedicine = getRecommendedMedicine(todayKey);
  const todayMedicineData = getDayMedicineData(todayKey);
  
  // Calculate statistics
  const workoutStreak = calculateWorkoutStreak(workouts);
  const longestWorkoutStreak = calculateLongestWorkoutStreak(workouts);
  const medicineStreak = calculateMedicineStreak(medicines, getMedicineForDate);
  const longestMedicineStreak = calculateLongestMedicineStreak(medicines, getMedicineForDate);
  const bestStreak = Math.max(longestWorkoutStreak, longestMedicineStreak);
  const bestStreakType = longestWorkoutStreak >= longestMedicineStreak ? 'Workout' : 'Medicine';
  const monthProgress = getMonthProgress(workouts);
  const weekSummary = getWeekSummary(workouts, medicines, getMedicineForDate);
  const totalStats = getTotalStats(workouts, medicines);
  const medicineCompliance = getMedicineComplianceRate(medicines, getMedicineForDate);
  
  // Today's status
  const todayWorkoutDone = isWorkoutDay(currentDateInfo.year, currentDateInfo.month, currentDateInfo.day);
  const todayMedicineTaken = todayMedicineData?.taken || false;
  
  const handleQuickWorkout = () => {
    toggleWorkoutDay(currentDateInfo.year, currentDateInfo.month, currentDateInfo.day);
  };
  
  const handleQuickMedicine = () => {
    toggleMedicine(todayKey, todaysMedicine.id);
  };

  return (
    <div className="space-y-6">
      {/* Today's Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Today's Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Workout Quick Action */}
          <button
            onClick={handleQuickWorkout}
            className={`p-4 rounded-lg transition-all transform hover:scale-105 ${
              todayWorkoutDone
                ? 'bg-green-500 bg-opacity-30 border-2 border-green-300'
                : 'bg-white bg-opacity-20 border-2 border-white border-opacity-30 hover:bg-opacity-30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`text-left ${todayWorkoutDone ? 'text-white' : 'text-gray-800'}`}>
                <div className="text-sm opacity-90">Workout</div>
                <div className="text-xl font-bold">
                  {todayWorkoutDone ? '✓ Completed' : 'Mark as Done'}
                </div>
              </div>
              <div className="text-4xl">🏋️</div>
            </div>
          </button>

          {/* Medicine Quick Action */}
          <button
            onClick={handleQuickMedicine}
            className={`p-4 rounded-lg transition-all transform hover:scale-105 ${
              todayMedicineTaken
                ? 'bg-green-500 bg-opacity-30 border-2 border-green-300'
                : 'bg-white bg-opacity-20 border-2 border-white border-opacity-30 hover:bg-opacity-30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`text-left ${todayMedicineTaken ? 'text-white' : 'text-gray-800'}`}>
                <div className="text-sm opacity-90 flex items-center gap-2">
                  {todaysMedicine.name}
                  {recommendedMedicine.id === todaysMedicine.id && !todayMedicineTaken && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="text-xl font-bold">
                  {todayMedicineTaken ? '✓ Taken' : 'Mark as Taken'}
                </div>
              </div>
              <div className="text-4xl">{todaysMedicine.icon}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Streaks Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-orange-800">Workout Streak</h3>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="text-4xl font-bold text-orange-600">{workoutStreak}</div>
          <div className="text-sm text-orange-700 mt-1">days in a row</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-purple-800">Medicine Streak</h3>
            <span className="text-2xl">💊</span>
          </div>
          <div className="text-4xl font-bold text-purple-600">{medicineStreak}</div>
          <div className="text-sm text-purple-700 mt-1">days in a row</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-yellow-800">Best Streak</h3>
            <span className="text-2xl">🏆</span>
          </div>
          <div className="text-4xl font-bold text-yellow-600">{bestStreak}</div>
          <div className="text-sm text-yellow-700 mt-1">{bestStreakType} days</div>
        </div>
      </div>

      {/* This Month's Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">This Month's Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{monthProgress.workoutDays}</div>
            <div className="text-sm text-gray-600">Workouts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{monthProgress.percentage}%</div>
            <div className="text-sm text-gray-600">Completion</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{medicineCompliance}%</div>
            <div className="text-sm text-gray-600">Medicine</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">{monthProgress.currentDay}/{monthProgress.totalDays}</div>
            <div className="text-sm text-gray-600">Days</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Workout Progress</span>
              <span className="font-semibold text-gray-800">{monthProgress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${monthProgress.percentage}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Medicine Compliance</span>
              <span className="font-semibold text-gray-800">{medicineCompliance}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${medicineCompliance}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* This Week's Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">This Week's Summary</h3>
        <div className="grid grid-cols-7 gap-2">
          {weekSummary.map((day, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-center transition-all ${
                day.isToday
                  ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="text-xs font-semibold text-gray-600 mb-2">{day.dayName}</div>
              <div className="text-lg font-bold text-gray-800 mb-2">{day.day}</div>
              
              {/* Workout indicator */}
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${
                day.hasWorkout ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {day.hasWorkout ? '✓' : '○'}
              </div>
              
              {/* Medicine indicator with circular background */}
              <div className={`
                w-10 h-10 mx-auto rounded-full flex items-center justify-center text-xl transition-all
                ${day.hasMedicine
                  ? 'bg-green-500 shadow-md'
                  : 'bg-gray-200'
                }
              `}>
                {day.medicine.icon}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <span>Pending</span>
          </div>
        </div>
      </div>

      {/* Total Statistics */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">All-Time Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-3xl mb-2">🏋️</div>
            <div className="text-2xl font-bold text-gray-800">{totalStats.totalWorkouts}</div>
            <div className="text-sm text-gray-600">Total Workouts</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-3xl mb-2">💊</div>
            <div className="text-2xl font-bold text-gray-800">{totalStats.totalMedicines}</div>
            <div className="text-sm text-gray-600">Medicines Taken</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg col-span-2 md:col-span-1">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold text-gray-800">{totalStats.totalDays}</div>
            <div className="text-sm text-gray-600">Days Tracked</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob

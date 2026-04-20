/**
 * Calculate current streak for workouts
 * @param {Object} workouts - Workout data from localStorage
 * @returns {number} Current streak count
 */
export function calculateWorkoutStreak(workouts) {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  while (true) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const key = `${year}-${String(month).padStart(2, '0')}`;
    
    const monthData = workouts[key] || [];
    if (monthData.includes(day)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Calculate longest workout streak
 * @param {Object} workouts - Workout data from localStorage
 * @returns {number} Longest streak count
 */
export function calculateLongestWorkoutStreak(workouts) {
  let longestStreak = 0;
  let currentStreak = 0;
  
  // Get all dates and sort them
  const allDates = [];
  Object.keys(workouts).forEach(monthKey => {
    const [year, month] = monthKey.split('-');
    workouts[monthKey].forEach(day => {
      allDates.push(new Date(year, parseInt(month) - 1, day));
    });
  });
  
  allDates.sort((a, b) => a - b);
  
  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const diffDays = Math.floor((allDates[i] - allDates[i - 1]) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
  }
  
  return Math.max(longestStreak, currentStreak);
}

/**
 * Calculate medicine streak
 * @param {Object} medicines - Medicine data from localStorage
 * @param {Function} getMedicineForDate - Function to get medicine for a date
 * @returns {number} Current medicine streak
 */
export function calculateMedicineStreak(medicines, getMedicineForDate) {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  while (true) {
    const dateKey = formatDateKey(currentDate);
    const dayData = medicines[dateKey];
    
    // Check if medicine was taken (new data structure)
    if (dayData?.taken) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Calculate longest medicine streak
 * @param {Object} medicines - Medicine data from localStorage
 * @param {Function} getMedicineForDate - Function to get medicine for a date
 * @returns {number} Longest medicine streak
 */
export function calculateLongestMedicineStreak(medicines, getMedicineForDate) {
  let longestStreak = 0;
  let currentStreak = 0;
  
  // Get all dates where medicine was taken and sort them
  const allDates = [];
  Object.keys(medicines).forEach(dateKey => {
    const dayData = medicines[dateKey];
    if (dayData?.taken) {
      const [year, month, day] = dateKey.split('-');
      allDates.push(new Date(year, parseInt(month) - 1, parseInt(day)));
    }
  });
  
  allDates.sort((a, b) => a - b);
  
  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const diffDays = Math.floor((allDates[i] - allDates[i - 1]) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
  }
  
  return Math.max(longestStreak, currentStreak);
}

/**
 * Get this month's workout progress
 * @param {Object} workouts - Workout data from localStorage
 * @returns {Object} Progress data
 */
export function getMonthProgress(workouts) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const key = `${year}-${String(month).padStart(2, '0')}`;
  
  const daysInMonth = new Date(year, month, 0).getDate();
  const currentDay = now.getDate();
  const workoutDays = (workouts[key] || []).length;
  
  return {
    workoutDays,
    totalDays: daysInMonth,
    currentDay,
    percentage: Math.round((workoutDays / currentDay) * 100)
  };
}

/**
 * Get this week's summary
 * @param {Object} workouts - Workout data
 * @param {Object} medicines - Medicine data
 * @param {Function} getMedicineForDate - Function to get medicine for a date
 * @returns {Array} Week data
 */
export function getWeekSummary(workouts, medicines, getMedicineForDate) {
  const today = new Date();
  const weekData = [];
  
  // Find the most recent Sunday (or today if it's Sunday)
  const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDayOfWeek);
  
  // Generate 7 days starting from Sunday
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    const dateKey = formatDateKey(date);
    
    const hasWorkout = (workouts[monthKey] || []).includes(day);
    const medicine = getMedicineForDate(dateKey);
    const dayData = medicines[dateKey];
    const hasMedicine = dayData?.taken || false;
    
    // Check if this date is today
    const isToday = date.toDateString() === today.toDateString();
    
    weekData.push({
      date,
      dateKey,
      day: date.getDate(),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      hasWorkout,
      hasMedicine,
      medicine,
      isToday
    });
  }
  
  return weekData;
}

/**
 * Get total statistics
 * @param {Object} workouts - Workout data
 * @param {Object} medicines - Medicine data
 * @returns {Object} Total stats
 */
export function getTotalStats(workouts, medicines) {
  const totalWorkouts = Object.values(workouts).reduce((sum, days) => sum + days.length, 0);
  const totalMedicines = Object.values(medicines).filter(dayData =>
    dayData?.taken === true
  ).length;
  
  return {
    totalWorkouts,
    totalMedicines,
    totalDays: Math.max(
      Object.keys(workouts).length * 30,
      Object.keys(medicines).length
    )
  };
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get medicine compliance rate for current month
 */
export function getMedicineComplianceRate(medicines, getMedicineForDate) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const currentDay = now.getDate();
  
  let takenCount = 0;
  
  for (let day = 1; day <= currentDay; day++) {
    const date = new Date(year, month - 1, day);
    const dateKey = formatDateKey(date);
    const dayData = medicines[dateKey];
    
    if (dayData?.taken) {
      takenCount++;
    }
  }
  
  return Math.round((takenCount / currentDay) * 100);
}

// Made with Bob

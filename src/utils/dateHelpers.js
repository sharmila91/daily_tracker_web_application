import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday, getYear, getMonth } from 'date-fns';

/**
 * Get calendar days for a given month including padding days
 * @param {Date} date - Any date in the target month
 * @returns {Array} Array of day objects with date info
 */
export function getCalendarDays(date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = eachDayOfInterval({ start, end });
  
  // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = getDay(start);
  
  // Add empty slots for days before the month starts
  const paddingDays = Array(firstDayOfWeek).fill(null);
  
  return [
    ...paddingDays,
    ...days.map(day => ({
      date: day,
      day: day.getDate(),
      isToday: isToday(day),
      year: getYear(day),
      month: getMonth(day) + 1 // getMonth returns 0-11, we want 1-12
    }))
  ];
}

/**
 * Format date for display
 * @param {Date} date
 * @param {string} formatStr - Format string (default: 'MMMM yyyy')
 * @returns {string}
 */
export function formatDate(date, formatStr = 'MMMM yyyy') {
  return format(date, formatStr);
}

/**
 * Get date string in YYYY-MM-DD format for localStorage keys
 * @param {Date} date
 * @returns {string}
 */
export function getDateKey(date) {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Navigate to next month
 * @param {Date} currentDate
 * @returns {Date}
 */
export function getNextMonth(currentDate) {
  return addMonths(currentDate, 1);
}

/**
 * Navigate to previous month
 * @param {Date} currentDate
 * @returns {Date}
 */
export function getPreviousMonth(currentDate) {
  return subMonths(currentDate, 1);
}

/**
 * Get month names for yearly chart
 * @returns {Array<string>}
 */
export function getMonthNames() {
  return [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
}

/**
 * Get current date info
 * @returns {Object}
 */
export function getCurrentDateInfo() {
  const now = new Date();
  return {
    date: now,
    year: getYear(now),
    month: getMonth(now) + 1,
    day: now.getDate(),
    dateKey: getDateKey(now)
  };
}

/**
 * Check if a date is in the current month
 * @param {Date} date
 * @param {Date} referenceDate
 * @returns {boolean}
 */
export function isSameMonth(date, referenceDate) {
  return getYear(date) === getYear(referenceDate) && 
         getMonth(date) === getMonth(referenceDate);
}

// Made with Bob

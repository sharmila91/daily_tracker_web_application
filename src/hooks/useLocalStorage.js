import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage with React state synchronization
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The initial value if key doesn't exist
 * @returns {[value, setValue]} - Current value and setter function
 */
export function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

/**
 * Hook for managing workout data in localStorage
 * Data structure: { "2026-04": [1, 5, 10, 15], "2026-03": [2, 4, 6] }
 */
export function useWorkoutData() {
  const [workouts, setWorkouts] = useLocalStorage('daily-tracker-workouts', {});

  const toggleWorkoutDay = (year, month, day) => {
    const key = `${year}-${String(month).padStart(2, '0')}`;
    setWorkouts(prev => {
      const monthData = prev[key] || [];
      const dayIndex = monthData.indexOf(day);
      
      if (dayIndex > -1) {
        // Remove day if already marked
        return {
          ...prev,
          [key]: monthData.filter(d => d !== day)
        };
      } else {
        // Add day if not marked
        return {
          ...prev,
          [key]: [...monthData, day].sort((a, b) => a - b)
        };
      }
    });
  };

  const isWorkoutDay = (year, month, day) => {
    const key = `${year}-${String(month).padStart(2, '0')}`;
    return (workouts[key] || []).includes(day);
  };

  const getMonthWorkouts = (year, month) => {
    const key = `${year}-${String(month).padStart(2, '0')}`;
    return workouts[key] || [];
  };

  const getYearlyStats = (year) => {
    const stats = [];
    for (let month = 1; month <= 12; month++) {
      const key = `${year}-${String(month).padStart(2, '0')}`;
      stats.push({
        month,
        count: (workouts[key] || []).length
      });
    }
    return stats;
  };

  return {
    workouts,
    toggleWorkoutDay,
    isWorkoutDay,
    getMonthWorkouts,
    getYearlyStats
  };
}

/**
 * Hook for managing medicine data in localStorage
 * New data structure: { "2026-04-13": { selectedMedicine: "fish-oil", taken: true } }
 * Supports user selection with smart recommendations
 */
export function useMedicineData() {
  const [medicines, setMedicines] = useLocalStorage('daily-tracker-medicines', {});

  const medicineList = [
    { id: 'fish-oil', name: 'Fish Oil', icon: '🐟' },
    { id: 'multivitamin', name: 'Multivitamin', icon: '💊' },
    { id: 'vitamin-b-complex', name: 'Vitamin B Complex', icon: '🔶' }
  ];

  /**
   * Get the default medicine for a specific date based on rotation
   * Uses day of year to determine which medicine (cycles through 3 medicines)
   */
  const getDefaultMedicineForDate = (dateString) => {
    const date = new Date(dateString);
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Rotate through medicines based on day of year
    const medicineIndex = dayOfYear % medicineList.length;
    return medicineList[medicineIndex];
  };

  /**
   * Get the medicine that hasn't been taken in the last 2 days
   * Returns the medicine to recommend based on what's missing from recent selections
   */
  const getMissingMedicine = (currentDateString) => {
    const currentDate = new Date(currentDateString);
    const recentSelections = new Set();
    
    // Look at last 2 days
    for (let i = 1; i <= 2; i++) {
      const pastDate = new Date(currentDate);
      pastDate.setDate(currentDate.getDate() - i);
      const dateKey = pastDate.toISOString().split('T')[0];
      
      const dayData = medicines[dateKey];
      if (dayData?.selectedMedicine) {
        recentSelections.add(dayData.selectedMedicine);
      }
    }
    
    // If we have 2 selections in last 2 days, find the missing one
    if (recentSelections.size === 2) {
      const missingMedicine = medicineList.find(m => !recentSelections.has(m.id));
      return missingMedicine;
    }
    
    return null;
  };

  /**
   * Get recommended medicine for a date
   * Smart algorithm:
   * 1. Check last 2 days - if 2 different medicines taken, recommend the 3rd one
   * 2. Otherwise, continue rotation based on last user selection
   * 3. Fall back to default rotation if no history
   */
  const getRecommendedMedicine = (dateString) => {
    // Check if there's a missing medicine from last 2 days
    const missingMedicine = getMissingMedicine(dateString);
    
    if (missingMedicine) {
      // Recommend the medicine not taken in last 2 days
      return missingMedicine;
    }
    
    // Find the last day with a selection
    const currentDate = new Date(dateString);
    let lastSelection = null;
    
    for (let i = 1; i <= 7; i++) {
      const pastDate = new Date(currentDate);
      pastDate.setDate(currentDate.getDate() - i);
      const dateKey = pastDate.toISOString().split('T')[0];
      
      const dayData = medicines[dateKey];
      if (dayData?.selectedMedicine) {
        lastSelection = dayData.selectedMedicine;
        break;
      }
    }
    
    if (lastSelection) {
      // Continue rotation from last selection
      const lastIndex = medicineList.findIndex(m => m.id === lastSelection);
      const nextIndex = (lastIndex + 1) % medicineList.length;
      return medicineList[nextIndex];
    }
    
    // No history, use default rotation
    return getDefaultMedicineForDate(dateString);
  };

  /**
   * Get the actual medicine for a date (what user selected or default)
   */
  const getMedicineForDate = (dateString) => {
    const dayData = medicines[dateString];
    
    if (dayData?.selectedMedicine) {
      // User has selected a medicine
      return medicineList.find(m => m.id === dayData.selectedMedicine);
    }
    
    // No selection yet, return recommended
    return getRecommendedMedicine(dateString);
  };

  /**
   * Save medicine selection for a date
   */
  const saveMedicineSelection = (date, data) => {
    setMedicines(prev => ({
      ...prev,
      [date]: {
        selectedMedicine: data.selectedMedicine,
        taken: data.taken
      }
    }));
  };

  /**
   * Legacy toggle function - now opens modal instead
   * Kept for backward compatibility
   */
  const toggleMedicine = (date, medicineId) => {
    setMedicines(prev => {
      const current = prev[date];
      if (current?.selectedMedicine === medicineId && current?.taken) {
        // If already taken, untake it
        return {
          ...prev,
          [date]: {
            selectedMedicine: medicineId,
            taken: false
          }
        };
      } else {
        // Mark as taken
        return {
          ...prev,
          [date]: {
            selectedMedicine: medicineId,
            taken: true
          }
        };
      }
    });
  };

  /**
   * Check if medicine is taken for a date
   */
  const isMedicineTaken = (date, medicineId) => {
    const dayData = medicines[date];
    return dayData?.selectedMedicine === medicineId && dayData?.taken === true;
  };

  /**
   * Get day's medicine data
   */
  const getDayMedicineData = (date) => {
    return medicines[date] || null;
  };

  /**
   * Get day completion rate
   */
  const getDayCompletionRate = (date) => {
    const dayData = medicines[date];
    return dayData?.taken ? 100 : 0;
  };

  return {
    medicines,
    medicineList,
    getMedicineForDate,
    getRecommendedMedicine,
    getDefaultMedicineForDate,
    saveMedicineSelection,
    toggleMedicine,
    isMedicineTaken,
    getDayMedicineData,
    getDayCompletionRate
  };
}

/**
 * Export all data for backup
 */
export function exportAllData() {
  const workouts = JSON.parse(localStorage.getItem('daily-tracker-workouts') || '{}');
  const medicines = JSON.parse(localStorage.getItem('daily-tracker-medicines') || '{}');
  
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    workouts,
    medicines
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `daily-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Import data from backup
 */
export function importData(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.workouts) {
        localStorage.setItem('daily-tracker-workouts', JSON.stringify(data.workouts));
      }
      if (data.medicines) {
        localStorage.setItem('daily-tracker-medicines', JSON.stringify(data.medicines));
      }
      callback(true, 'Data imported successfully!');
      window.location.reload(); // Reload to update state
    } catch (error) {
      callback(false, 'Error importing data: ' + error.message);
    }
  };
  reader.readAsText(file);
}

// Made with Bob

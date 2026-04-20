import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useWorkoutData } from '../../hooks/useLocalStorage';
import { getMonthNames } from '../../utils/dateHelpers';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function YearlyChart() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { getYearlyStats } = useWorkoutData();
  
  const yearlyStats = getYearlyStats(selectedYear);
  const monthNames = getMonthNames();

  // Calculate statistics
  const totalWorkouts = yearlyStats.reduce((sum, month) => sum + month.count, 0);
  const averagePerMonth = (totalWorkouts / 12).toFixed(1);
  const bestMonth = yearlyStats.reduce((max, month) => 
    month.count > max.count ? month : max, yearlyStats[0]
  );

  // Chart data
  const chartData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Workout Days',
        data: yearlyStats.map(stat => stat.count),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(34, 197, 94, 1)',
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Workout Attendance - ${selectedYear}`,
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.parsed.y} workout${context.parsed.y !== 1 ? 's' : ''}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        },
        title: {
          display: true,
          text: 'Number of Workouts',
          font: {
            size: 12
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month',
          font: {
            size: 12
          }
        }
      }
    }
  };

  const handleYearChange = (direction) => {
    setSelectedYear(prev => prev + direction);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Year selector */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => handleYearChange(-1)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Previous year"
        >
          ← {selectedYear - 1}
        </button>
        
        <h2 className="text-2xl font-semibold text-gray-800 min-w-[120px] text-center">
          {selectedYear}
        </h2>
        
        <button
          onClick={() => handleYearChange(1)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Next year"
        >
          {selectedYear + 1} →
        </button>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{totalWorkouts}</div>
          <div className="text-sm text-green-600 mt-1">Total Workouts</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-700">{averagePerMonth}</div>
          <div className="text-sm text-blue-600 mt-1">Average per Month</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-700">{bestMonth.count}</div>
          <div className="text-sm text-purple-600 mt-1">
            Best Month ({monthNames[bestMonth.month - 1]})
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 md:h-96">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Additional info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Track your workout consistency throughout the year
      </div>
    </div>
  );
}

// Made with Bob

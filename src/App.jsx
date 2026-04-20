import { useState } from 'react';
import Overview from './components/Dashboard/Overview';
import MonthlyCalendar from './components/WorkoutTracker/MonthlyCalendar';
import YearlyChart from './components/WorkoutTracker/YearlyChart';
import MonthlyMedicineCalendar from './components/MedicineTracker/MonthlyMedicineCalendar';
import { exportAllData, importData } from './hooks/useLocalStorage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [importMessage, setImportMessage] = useState(null);

  const handleExport = () => {
    exportAllData();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importData(file, (success, message) => {
        setImportMessage({ success, message });
        setTimeout(() => setImportMessage(null), 5000);
      });
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'workout-calendar', label: 'Workout Calendar', icon: '📅' },
    { id: 'workout-stats', label: 'Workout Stats', icon: '📈' },
    { id: 'medicine', label: 'Medicine Tracker', icon: '💊' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Daily Tracker
              </h1>
              <p className="text-gray-600 mt-1">Track your workouts and medicine intake</p>
            </div>
            
            {/* Data management buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                title="Export all data as JSON backup"
              >
                <span>📥</span>
                Export Data
              </button>
              
              <label className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium cursor-pointer">
                <span>📤</span>
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Import message */}
          {importMessage && (
            <div className={`mt-4 p-3 rounded-lg ${
              importMessage.success 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {importMessage.message}
            </div>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200
                  border-b-2 flex items-center gap-2
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fadeIn">
          {activeTab === 'dashboard' && (
            <div>
              <div className="mb-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
                <p className="text-gray-600">Your daily health tracking overview</p>
              </div>
              <Overview />
            </div>
          )}

          {activeTab === 'workout-calendar' && (
            <div>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Monthly Workout Calendar</h2>
                <p className="text-gray-600">Click on days to mark your workout attendance</p>
              </div>
              <MonthlyCalendar />
            </div>
          )}

          {activeTab === 'workout-stats' && (
            <div>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Yearly Workout Statistics</h2>
                <p className="text-gray-600">View your workout consistency throughout the year</p>
              </div>
              <YearlyChart />
            </div>
          )}

          {activeTab === 'medicine' && (
            <div>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Monthly Medicine Calendar</h2>
                <p className="text-gray-600">Click on days to mark medicine intake. Each day shows its assigned medicine.</p>
              </div>
              <MonthlyMedicineCalendar />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Daily Tracker - Your personal health and fitness companion</p>
            <p className="mt-2">
              Data is stored locally in your browser. 
              <button 
                onClick={handleExport}
                className="text-blue-600 hover:text-blue-700 underline ml-1"
              >
                Export your data
              </button> 
              {' '}for backup.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

// Made with Bob

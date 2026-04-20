import { useState, useEffect } from 'react';

/**
 * Modal for selecting medicine for a specific day
 * Shows all medicines with toggle buttons - click to select and save immediately
 */
export default function MedicineSelectionModal({
  isOpen,
  onClose,
  date,
  dateString,
  currentSelection,
  recommendedMedicine,
  medicineList,
  onSave
}) {
  const [selectedMedicine, setSelectedMedicine] = useState(currentSelection?.selectedMedicine || null);
  const [isTaken, setIsTaken] = useState(currentSelection?.taken || false);

  // Update state when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setSelectedMedicine(currentSelection?.selectedMedicine || null);
      setIsTaken(currentSelection?.taken || false);
    }
  }, [isOpen, currentSelection]);

  if (!isOpen) return null;

  const handleCancel = () => {
    onClose();
  };

  const handleMedicineToggle = (medicineId) => {
    const isCurrentlySelected = medicineId === selectedMedicine;
    
    if (isCurrentlySelected) {
      // If clicking the same medicine, toggle the taken status
      const newTakenStatus = !isTaken;
      onSave({
        selectedMedicine: medicineId,
        taken: newTakenStatus
      });
    } else {
      // If clicking a different medicine, select it and mark as taken
      onSave({
        selectedMedicine: medicineId,
        taken: true
      });
    }
    onClose();
  };

  const formatDateDisplay = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold mb-2">Select Medicine</h2>
          <p className="text-sm opacity-90">{formatDateDisplay(date)}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Medicine Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Click to select and save:
            </label>
            
            {medicineList.map((medicine) => {
              const isRecommended = medicine.id === recommendedMedicine?.id;
              const isSelected = medicine.id === selectedMedicine;
              
              return (
                <button
                  key={medicine.id}
                  onClick={() => handleMedicineToggle(medicine.id)}
                  className={`
                    w-full p-4 rounded-lg border-2 transition-all duration-200
                    flex items-center justify-between
                    ${isSelected && isTaken
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : isSelected && !isTaken
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Status indicator */}
                    <div className={`
                      w-6 h-6 rounded-lg border-2 flex items-center justify-center
                      ${isSelected && isTaken
                        ? 'border-green-500 bg-green-500'
                        : isSelected && !isTaken
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                      }
                    `}>
                      {isSelected && isTaken && (
                        <span className="text-white text-sm">✓</span>
                      )}
                      {isSelected && !isTaken && (
                        <span className="text-white text-xs">○</span>
                      )}
                    </div>
                    
                    {/* Medicine icon and name */}
                    <span className="text-3xl">{medicine.icon}</span>
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-medium text-gray-800">
                        {medicine.name}
                      </span>
                      {isSelected && (
                        <span className="text-xs text-gray-500">
                          {isTaken ? 'Taken' : 'Selected (not taken)'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recommended badge */}
                  {isRecommended && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Recommended
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Info message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">💡 How it works:</span>
            </p>
            <ul className="text-xs text-blue-700 mt-2 ml-4 space-y-1">
              <li>• Click a medicine to select and mark as taken</li>
              <li>• Click again to toggle taken status</li>
              <li>• Click a different medicine to switch selection</li>
            </ul>
          </div>

          {recommendedMedicine && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <span className="font-semibold">⭐ Recommended:</span> {recommendedMedicine.icon} {recommendedMedicine.name} based on your recent selections.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Made with Bob

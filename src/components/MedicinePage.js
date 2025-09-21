import React, { useState } from "react";
import { Pill, Plus, Check, Clock } from "lucide-react";

export default function MedicinePage({
  medicines,
  toggleMedicine,
  addMedicine,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    times: [""],
  });

  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (newMedicine.name && newMedicine.dosage && newMedicine.times[0]) {
      addMedicine({
        ...newMedicine,
        times: newMedicine.times.filter((time) => time),
      });
      setNewMedicine({ name: "", dosage: "", times: [""] });
      setShowAddForm(false);
    }
  };

  const addTimeSlot = () => {
    setNewMedicine({
      ...newMedicine,
      times: [...newMedicine.times, ""],
    });
  };

  const updateTimeSlot = (index, value) => {
    const newTimes = [...newMedicine.times];
    newTimes[index] = value;
    setNewMedicine({ ...newMedicine, times: newTimes });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Medicine Tracker</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-500 border-b-4 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
          style={{ borderBottomColor: " #16A34A" }}
        >
          <Plus className="w-4 h-4" />
          Add Medicine
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Add New Medicine</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Medicine Name
                </label>
                <input
                  type="text"
                  value={newMedicine.name}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, name: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter medicine name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dosage</label>
                <input
                  type="text"
                  value={newMedicine.dosage}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, dosage: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 10mg, 2 tablets"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Times</label>
              {newMedicine.times.map((time, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateTimeSlot(index, e.target.value)}
                    className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addTimeSlot}
                className="bg-green-500 border-b-4 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
                style={{ borderBottomColor: " #16A34A" }}
              >
                + Add another time
              </button>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={handleAddMedicine}
                className="bg-green-500 border-b-4 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
                style={{ borderBottomColor: " #16A34A" }}
              >
                Add Medicine
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-400 border-b-4 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-500 transition-colors"
                style={{ borderBottomColor: " #6B7280" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {medicines.map((medicine) => (
          <div key={medicine.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{medicine.name}</h3>
                <p className="text-gray-600">{medicine.dosage}</p>
              </div>
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-500">
                  {Object.values(medicine.taken).filter(Boolean).length} /{" "}
                  {medicine.times.length} taken
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {medicine.times.map((time) => (
                <button
                  key={time}
                  onClick={() => toggleMedicine(medicine.id, time)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    medicine.taken[time]
                      ? "border-green-500 bg-green-50 text-green-800"
                      : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">{time}</span>
                    {medicine.taken[time] && <Check className="w-4 h-4" />}
                  </div>
                  <div className="text-xs mt-1">
                    {medicine.taken[time] ? "Taken" : "Pending"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {medicines.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No medicines added yet
          </h3>
          <p className="text-gray-500">
            Click "Add Medicine" to start tracking your medications
          </p>
        </div>
      )}
    </div>
  );
}

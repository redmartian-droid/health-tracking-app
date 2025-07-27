import React, { useState } from "react";
import { Heart, Activity, Pill, Check } from "lucide-react";
import MetricCard from "./MetricCard";
import HeartRatePage from "./HeartRatePage";
import StepsPage from "./StepsPage";
import MedicinePage from "./MedicinePage";
import MilestonesPage from "./MilestonesPage";

export default function Dashboard({ heartRate, steps, medicines, milestones }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTabContent = () => {
    switch (activeTab) {
      case "heart-rate":
        return <HeartRatePage heartRate={heartRate} />;
      case "steps":
        return <StepsPage steps={steps} />;
      case "medicines":
        return <MedicinePage medicines={medicines} />;
      case "milestones":
        return <MilestonesPage milestones={milestones} />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          onClick={() => setActiveTab("heart-rate")}
          className="cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <MetricCard
            title="Heart Rate"
            value={heartRate}
            unit="BPM"
            icon={Heart}
            trend={2}
          />
        </div>

        <div
          onClick={() => setActiveTab("steps")}
          className="cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <MetricCard
            title="Steps Today"
            value={steps.toLocaleString()}
            unit="steps"
            icon={Activity}
            trend={15}
          />
        </div>

        <div
          onClick={() => setActiveTab("medicines")}
          className="cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <MetricCard
            title="Medicines Today"
            value={medicines.reduce(
              (acc, m) => acc + Object.values(m.taken).filter(Boolean).length,
              0
            )}
            unit={`/ ${medicines.reduce((acc, m) => acc + m.times.length, 0)}`}
            icon={Pill}
            trend={-5}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          onClick={() => setActiveTab("milestones")}
          className="bg-white rounded-lg border p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-bold mb-4">Recent Milestones</h3>
          {milestones
            .filter((m) => m.completed)
            .slice(0, 3)
            .map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3"
              >
                <Check className="w-5 h-5" />
                <div>
                  <p className="font-semibold">{milestone.title}</p>
                  <p className="text-sm text-gray-600">
                    +{milestone.reward} points earned
                  </p>
                </div>
              </div>
            ))}
        </div>

        <div
          onClick={() => setActiveTab("medicines")}
          className="bg-white rounded-lg border p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-bold mb-4">Quick Medicine Check</h3>
          {medicines.slice(0, 3).map((medicine) => (
            <div
              key={medicine.id}
              className="flex items-center justify-between p-3 border-b last:border-b-0"
            >
              <div>
                <p className="font-semibold">{medicine.name}</p>
                <p className="text-sm text-gray-600">{medicine.dosage}</p>
              </div>
              <div className="flex gap-2">
                {medicine.times.map((time) => (
                  <span
                    key={time}
                    className={`px-2 py-1 rounded text-xs ${
                      medicine.taken[time] ? "bg-gray-200" : "bg-gray-100"
                    }`}
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Health Dashboard</h2>
        <p className="text-gray-600">
          Track your daily health metrics and achieve your goals
        </p>
      </div>

      {activeTab !== "dashboard" && (
        <button
          onClick={() => setActiveTab("dashboard")}
          className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to dashboard
        </button>
      )}

      {renderTabContent()}
    </div>
  );
}

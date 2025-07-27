import React from "react";
import { Activity, Target } from "lucide-react";
import MetricCard from "./MetricCard";

export default function StepsPage({ steps }) {
  const progressPercentage = Math.round((steps / 10000) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Step Tracking</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Steps Today"
          value={steps.toLocaleString()}
          unit="steps"
          icon={Activity}
        />
        <MetricCard
          title="Goal Progress"
          value={progressPercentage}
          unit="%"
          icon={Target}
        />
        <MetricCard
          title="Calories Burned"
          value={Math.round(steps * 0.04)}
          unit="cal"
          icon={Activity}
        />
      </div>

      <div className="bg-white rounded-lg border p-4 mb-4">
        <h3 className="text-lg font-bold mb-3">Daily Goal Progress</h3>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {10000 - steps > 0
            ? `${(
                10000 - steps
              ).toLocaleString()} steps to reach your daily goal`
            : "Goal achieved! Great work!"}
        </p>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-bold mb-3">Step Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { milestone: "5,000 steps", achieved: steps >= 5000, reward: 50 },
            { milestone: "7,500 steps", achieved: steps >= 7500, reward: 75 },
            {
              milestone: "10,000 steps",
              achieved: steps >= 10000,
              reward: 100,
            },
            {
              milestone: "12,500 steps",
              achieved: steps >= 12500,
              reward: 125,
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded border ${
                item.achieved ? "border-gray-400 bg-gray-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.milestone}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      item.achieved ? "font-bold" : "text-gray-500"
                    }`}
                  >
                    {item.achieved ? "✓" : "○"} +{item.reward} pts
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

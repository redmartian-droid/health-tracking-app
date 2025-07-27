import React from "react";
import { Heart } from "lucide-react";
import MetricCard from "./MetricCard";

export default function HeartRatePage({ heartRate }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Heart Rate Monitoring</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <MetricCard
          title="Current Heart Rate"
          value={heartRate}
          unit="BPM"
          icon={Heart}
        />
        <MetricCard title="Resting HR" value="68" unit="BPM" icon={Heart} />
        <MetricCard title="Max HR Today" value="95" unit="BPM" icon={Heart} />
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-bold mb-4">Heart Rate Zones</h3>
        <div className="space-y-3">
          {[
            {
              zone: "Resting",
              min: 50,
              max: 70,
              current: heartRate >= 50 && heartRate <= 70,
            },
            {
              zone: "Fat Burn",
              min: 71,
              max: 85,
              current: heartRate >= 71 && heartRate <= 85,
            },
            {
              zone: "Cardio",
              min: 86,
              max: 100,
              current: heartRate >= 86 && heartRate <= 100,
            },
            {
              zone: "Peak",
              min: 101,
              max: 120,
              current: heartRate >= 101 && heartRate <= 120,
            },
          ].map((zone) => (
            <div
              key={zone.zone}
              className={`flex items-center justify-between p-3 rounded border ${
                zone.current ? "border-gray-400 bg-gray-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="font-medium">{zone.zone}</span>
                <span className="text-gray-600 text-sm">
                  {zone.min}-{zone.max} BPM
                </span>
              </div>
              {zone.current && (
                <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs font-medium">
                  Current Zone
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

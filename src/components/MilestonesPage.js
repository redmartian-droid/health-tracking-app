import React from "react";
import { Target, TrendingUp, CheckCircle } from "lucide-react";

export default function MilestonesPage({ milestones, totalPoints }) {
  const completedCount = milestones.filter((m) => m.completed).length;
  const inProgressCount = milestones.filter((m) => !m.completed).length;
  const nearCompletionCount = milestones.filter(
    (m) => !m.completed && m.current / m.target > 0.8
  ).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Milestones & Progress</h2>

      {/* Progress Overview */}
      <div className="bg-gray-100 rounded-lg p-6 mb-8">
        <div className="text-center">
          <div className="flex justify-center mb-4"></div>
          <h3 className="text-xl font-bold mb-4">Milestone Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-200 rounded-lg p-4">
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-sm">Completed</p>
            </div>
            <div className="bg-gray-200 rounded-lg p-4">
              <p className="text-2xl font-bold">{inProgressCount}</p>
              <p className="text-sm">In Progress</p>
            </div>
            <div className="bg-gray-200 rounded-lg p-4">
              <p className="text-2xl font-bold">{nearCompletionCount}</p>
              <p className="text-sm">Almost There</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completed Milestones */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6" />
            <h3 className="text-xl font-bold">Completed Milestones</h3>
          </div>

          {milestones.filter((m) => m.completed).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg">No milestones completed yet</p>
              <p className="text-sm">
                Keep working to achieve your first milestone!
              </p>
            </div>
          ) : (
            milestones
              .filter((m) => m.completed)
              .map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-3 border"
                >
                  <div className="p-2 bg-gray-200 rounded-full">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <p className="text-sm text-gray-600">
                      Target: {milestone.target.toLocaleString()}{" "}
                      {milestone.type}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ✓ Milestone achieved!
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* In Progress Milestones */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <h3 className="text-xl font-bold">In Progress</h3>
          </div>

          {milestones.filter((m) => !m.completed).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg">All milestones completed!</p>
              <p className="text-sm">
                Amazing work! You've achieved everything!
              </p>
            </div>
          ) : (
            milestones
              .filter((m) => !m.completed)
              .map((milestone) => {
                const progress = (milestone.current / milestone.target) * 100;
                const isNearCompletion = progress > 80;

                return (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-lg mb-3 border ${
                      isNearCompletion ? "bg-gray-100" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{milestone.title}</h4>
                      {isNearCompletion && (
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full font-medium">
                          Almost there!
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Target: {milestone.target.toLocaleString()}{" "}
                      {milestone.type}
                    </p>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>
                          Current: {milestone.current.toLocaleString()}
                        </span>
                        <span>Goal: {milestone.target.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500 bg-gray-600"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">
                        {Math.round(progress)}% complete
                      </p>
                      <p className="text-xs text-gray-500">
                        {(
                          milestone.target - milestone.current
                        ).toLocaleString()}{" "}
                        remaining
                      </p>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}

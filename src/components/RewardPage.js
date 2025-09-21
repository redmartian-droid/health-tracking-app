import React from "react";
import { Trophy, Gift, Star } from "lucide-react";

export default function RewardsPage({ milestones, totalPoints }) {
  const completedMilestones = milestones.filter((m) => m.completed);
  const totalRewardsEarned = completedMilestones.reduce(
    (sum, m) => sum + m.reward,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Rewards & Points</h2>

      {/* Points Summary */}
      <div className="bg-gray-100 rounded-lg p-6 mb-8">
        <div className="text-center">
          <div className="flex justify-center mb-4"></div>
          <h3 className="text-xl font-bold mb-2">Total Points Earned</h3>
          <p className="text-4xl font-bold mb-4">{totalPoints}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-gray-200 rounded-lg p-4">
              <p className="text-2xl font-bold">{completedMilestones.length}</p>
              <p className="text-sm">Rewards Unlocked</p>
            </div>
            <div className="bg-gray-200 rounded-lg p-4">
              <p className="text-2xl font-bold">{totalRewardsEarned}</p>
              <p className="text-sm">Bonus Points Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earned Rewards */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Gift className="w-6 h-6" />
          <h3 className="text-xl font-bold">Earned Rewards</h3>
        </div>

        {completedMilestones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Gift className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg">No rewards earned yet!</p>
            <p className="text-sm">Complete milestones to unlock rewards</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border"
              >
                <div className="p-3 bg-gray-200 rounded-full">🏆</div>
                <div className="flex-1">
                  <h4 className="font-bold">{milestone.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    Completed: {milestone.target.toLocaleString()}{" "}
                    {milestone.type}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-gray-200 rounded-full text-sm font-bold">
                      +{milestone.reward} Points
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Rewards to Unlock */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-6 h-6" />
          <h3 className="text-xl font-bold">Available Rewards</h3>
        </div>

        {milestones.filter((m) => !m.completed).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg">All rewards unlocked!</p>
            <p className="text-sm">
              Congratulations on completing all milestones!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {milestones
              .filter((m) => !m.completed)
              .map((milestone) => {
                const progress = (milestone.current / milestone.target) * 100;
                return (
                  <div
                    key={milestone.id}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <div className="px-3 py-1 bg-gray-200 rounded-full text-sm font-bold">
                        +{milestone.reward} pts
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Complete {milestone.target.toLocaleString()}{" "}
                      {milestone.type} to unlock
                    </p>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{milestone.current.toLocaleString()}</span>
                        <span>{milestone.target.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {Math.round(progress)}% complete
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

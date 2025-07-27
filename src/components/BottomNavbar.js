import { Home, Goal, Award, Pill, Settings } from "lucide-react";

// Import filled versions (assuming they exist in lucide-react)
import {
  Home as HomeFilled,
  Goal as GoalFilled,
  Award as AwardFilled,
  Pill as PillFilled,
  Settings as SettingsFilled,
} from "lucide-react";

export default function BottomNavigation({ currentPage, setCurrentPage }) {
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, activeIcon: HomeFilled },
    {
      id: "milestones", // This will show MilestonesPage
      label: "Goals",
      icon: Goal,
      activeIcon: GoalFilled,
    },
    {
      id: "rewards", // This will show RewardPage
      label: "Rewards",
      icon: Award,
      activeIcon: AwardFilled,
    },
    { id: "medicine", label: "Meds", icon: Pill, activeIcon: PillFilled },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      activeIcon: SettingsFilled,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center">
        {navigationItems.map(
          ({ id, label, icon: Icon, activeIcon: ActiveIcon }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`relative flex flex-col items-center py-3 px-2 w-full text-xs font-medium ${
                currentPage === id ? "text-black" : "text-gray-500"
              }`}
            >
              {currentPage === id ? (
                <ActiveIcon className="w-6 h-6 mb-1" />
              ) : (
                <Icon className="w-6 h-6 mb-1" />
              )}
              <span>{label}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}

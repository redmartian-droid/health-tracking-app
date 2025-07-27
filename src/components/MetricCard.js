export default function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  trend,
}) {
  return (
    <div
      className="bg-white rounded-xl shadow-lg p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {value} <span className="text-lg text-gray-500">{unit}</span>
          </p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend > 0 ? "↗" : "↘"} {Math.abs(trend)}% from yesterday
            </p>
          )}
        </div>
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: color + "20" }}
        >
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

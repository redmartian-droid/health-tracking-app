export default function HeartRateMetricCard({
  title,
  value,
  unit,
  icon: Icon,
  color = "#5BBE45",
  trend,
}) {
  return (
    <div className="p-3 rounded-full">
      <Icon className="w-64 h-64" style={{ color }} />
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
        </div>{" "}
      </div>
    </div>
  );
}

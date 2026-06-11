import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function ProgressChart({ workouts }) {
  return (
    <div
      className="
        mt-6
        mx-2
        p-6
        rounded-2xl
        bg-slate-900/70
        backdrop-blur-sm
        border border-slate-800
        shadow-lg
      "
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        Workout Progress
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={workouts}>
          <CartesianGrid
            stroke="#334155"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="exercise"
            stroke="#94a3b8"
            tick={{ fill: "#cbd5e1" }}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#cbd5e1" }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#fff",
            }}
          />

          <Line
            type="monotone"
            dataKey="reps"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProgressChart;
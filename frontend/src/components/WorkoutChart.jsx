import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function WorkoutChart({ workouts }) {
  return (
    <div
      className="
        my-4
        mx-2
        p-6
        rounded-3xl
        bg-slate-900/70
        backdrop-blur-sm
        border border-slate-800
        shadow-[0_10px_30px_rgba(0,0,0,0.25)]
      "
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        Workout Analytics
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={workouts}>
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

          <Bar
            dataKey="reps"
            fill="#38bdf8"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WorkoutChart;
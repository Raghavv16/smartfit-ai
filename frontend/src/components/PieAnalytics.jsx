import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function PieAnalytics({ workouts }) {
  const COLORS = [
    "#38bdf8",
    "#22c55e",
    "#f97316",
    "#a855f7",
    "#ef4444",
  ];

  const exerciseCounts = {};

  workouts.forEach((workout) => {
    if (exerciseCounts[workout.exercise]) {
      exerciseCounts[workout.exercise] += workout.reps;
    } else {
      exerciseCounts[workout.exercise] = workout.reps;
    }
  });

  const pieData = Object.keys(exerciseCounts).map((key) => ({
    name: key,
    value: exerciseCounts[key],
  }));

  return (
   <div
  className="
    mt-6
    mx-2
    p-6
    rounded-3xl
    bg-slate-900/70
    border border-slate-800
    shadow-[0_10px_30px_rgba(0,0,0,0.25)]
    backdrop-blur-sm
  "
>
  <h2 className="text-2xl font-bold text-white mb-6">
    Exercise Distribution
  </h2>

  <ResponsiveContainer width="100%" height={320}>
    <PieChart>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        innerRadius={50}
        paddingAngle={3}
        label={({ name, percent }) =>
          `${name} ${(percent * 100).toFixed(0)}%`
        }
      >
        {pieData.map((entry, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip
        contentStyle={{
          backgroundColor: "#0f172a",
          border: "1px solid #334155",
          borderRadius: "12px",
          color: "#fff",
        }}
      />
    </PieChart>
  </ResponsiveContainer>
</div>
  );
}

export default PieAnalytics;
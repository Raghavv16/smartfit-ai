import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function WorkoutChart({ workouts }) {

  return (

    <div className="chart-box">

      <h2>Workout Analytics</h2>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={workouts}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="exercise" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="reps" fill="#38bdf8" />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default WorkoutChart;
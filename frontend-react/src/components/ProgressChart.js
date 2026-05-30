import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function ProgressChart({ workouts }) {

  return (

    <div className="progress-box">

      <h2>Workout Progress</h2>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={workouts}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="exercise" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="reps"
            stroke="#22c55e"
            strokeWidth={3}
          />


        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default ProgressChart;
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function PieAnalytics({ workouts }) {

  const COLORS = [
    "#38bdf8",
    "#22c55e",
    "#f97316"
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
    value: exerciseCounts[key]
  }));

  return (

    <div className="chart-box">

      <h2>Exercise Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>

        <PieChart>

          <Pie
            data={pieData}
            dataKey="value"
            outerRadius={100}
            label
          >

            {
              pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))
            }

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

       </div>
  );
}

export default PieAnalytics;
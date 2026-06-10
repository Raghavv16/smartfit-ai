import { Card, CardContent } from "./ui/card";

function StatsCards({ workouts }) {

  const totalReps = workouts.reduce(
    (sum, workout) => sum + workout.reps,
    0
  );

  const totalDuration = workouts.reduce(
    (sum, workout) => sum + workout.duration,
    0
  );

  const calories = totalReps * 0.5;

  const uniqueDates = [
    ...new Set(
      workouts.map(workout => 
        workout.date?.split("T")[0]
      )
    )
  ].sort().reverse();
  
  let streak = 0;

  for (let i = 0; i < uniqueDates.length; i++) {
    const expectedDate = new Date();
    
    expectedDate.setDate(expectedDate.getDate() - i);

    const expectedDateString = expectedDate.toLocaleDateString("en-CA");

    if (uniqueDates[i] === expectedDateString) {
      streak++;
    } else {
      break;
    }
  }

  return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 my-8">

    <Card className="bg-slate-900/70 backdrop-blur-xl border-slate-700 rounded-3xl">
      <CardContent className="p-6 text-center">
        <p className="text-slate-400 text-sm">Total Workouts</p>
        <h1 className="text-4xl font-bold text-white mt-2">
          {workouts.length}
        </h1>
      </CardContent>
    </Card>

    <Card className="bg-slate-900/70 backdrop-blur-xl border-slate-700 rounded-3xl">
      <CardContent className="p-6 text-center">
        <p className="text-slate-400 text-sm">Total Reps</p>
        <h1 className="text-4xl font-bold text-white mt-2">
          {totalReps}
        </h1>
      </CardContent>
    </Card>

    <Card className="bg-slate-900/70 backdrop-blur-xl border-slate-700 rounded-3xl">
      <CardContent className="p-6 text-center">
        <p className="text-slate-400 text-sm">
          Current Streak 🔥
        </p>
        <h1 className="text-4xl font-bold text-white mt-2">
          {streak}
        </h1>
      </CardContent>
    </Card>

    <Card className="bg-slate-900/70 backdrop-blur-xl border-slate-700 rounded-3xl">
      <CardContent className="p-6 text-center">
        <p className="text-slate-400 text-sm">
          Total Duration
        </p>
        <h1 className="text-4xl font-bold text-white mt-2">
          {totalDuration}s
        </h1>
      </CardContent>
    </Card>

    <Card className="bg-slate-900/70 backdrop-blur-xl border-slate-700 rounded-3xl">
      <CardContent className="p-6 text-center">
        <p className="text-slate-400 text-sm">
          Calories Burned
        </p>
        <h1 className="text-4xl font-bold text-white mt-2">
          {calories}
        </h1>
      </CardContent>
    </Card>

  </div>
);
}

export default StatsCards;
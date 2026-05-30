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

  return (

    <div className="cards">

      <div className="card">
        <h3>Total Workouts</h3>
        <h1>{workouts.length}</h1>
      </div>

      <div className="card">
        <h3>Total Reps</h3>
        <h1>{totalReps}</h1>
      </div>

      <div className="card">
        <h3>Total Duration</h3>
        <h1>{totalDuration}s</h1>
      </div>

      <div className="card">
        <h3>Calories</h3>
        <h1>{calories}</h1>
      </div>

    </div>
  );
}

export default StatsCards;
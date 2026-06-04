function WorkoutHistory({ workouts }) {

  return (

    <div className="history">

      <h2>Workout History</h2>

      {
        [...workouts].reverse().map((workout) => (

          <div
            key={workout._id}
            className="history-card"
          >

            <div>
              <h3>{workout.exercise}</h3>
              <p>{workout.duration} sec</p>
              {workout.date && (
                <p>
                  {new Date(workout.date).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                  })}
                </p>
              )}
            </div>

            <h2>{workout.reps} reps</h2>

          </div>
        ))
      }

    </div>
  );
}

export default WorkoutHistory;
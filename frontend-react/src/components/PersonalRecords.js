function PersonalRecords({ workouts }) {

    const records = {};

    workouts.forEach((workout) => {
        if (
            !records[workout.exercise] ||
            workout.reps > records[workout.exercise]
        ) {
            records[workout.exercise] = workout.reps;
        }
    });

    return (
        <div className="card">
            
            <h3>Personal Records</h3>

            {
                Object.entries(records).map(
                    ([exercise, reps]) => (
                        <p key={exercise}>
                            {exercise}: {reps}
                        </p>
                    )
                )
            }

        </div>
    );

}

export default PersonalRecords;
function PersonalRecords({ workouts }) {

    const records = {};

    workouts.forEach((workout) => {
        if (
            !records[workout.exercise] ||
            workout.reps > records[workout.exercise].reps
        ) {
            records[workout.exercise] = {
                reps: workout.reps,
                date: workout.date
            };
        }
    });

    return (
        <div className="chart-box">
            
            <h2>Personal Records</h2>

            <div className="records-grid">

            {
                Object.entries(records).sort((a, b) => b[1].reps - a[1].reps).map(
                ([exercise, record]) => (

                    <div
                        key={exercise}
                        className="record-card"
                    >

                        <h4>{exercise}</h4>

                        <h2>{record.reps} reps</h2>

                        <p>
                            {new Date(record.date)
                            .toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            })
                            }
                        </p>

                    </div>

                )
                )
            }

            </div>

        </div>
    );

}

export default PersonalRecords;
function PersonalRecords({ workouts }) {
	const records = {};

	workouts.forEach((workout) => {
		if (
			!records[workout.exercise] ||
			workout.reps > records[workout.exercise].reps
		) {
			records[workout.exercise] = {
				reps: workout.reps,
				date: workout.date,
			};
		}
	});

	return (
		<div className="mx-2 my-8">
			<h2 className="text-2xl font-bold text-white mb-4">
				Personal Records 🏆
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
				{Object.entries(records)
					.sort((a, b) => b[1].reps - a[1].reps)
					.map(([exercise, record]) => (
						<div
							key={exercise}
							className="bg-slate-900/70 backdrop-blur-sm 
							border border-slate-800
                			rounded-3xl p-6 shadow-lg
                			hover:border-emerald-500
                			hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]
                			hover:-translate-y-1
                			transition-all duration-300"
						>
							<div className="flex items-center justify-between">
								<h4 className="text-slate-300 font-medium capitalize">
									{exercise}
								</h4>

								<span className="text-2xl">🏆</span>
							</div>

							<h2 className="text-4xl font-bold text-white mt-4">
								{record.reps}
							</h2>

							<p className="text-emerald-400 text-sm mt-1">
								reps
							</p>

							<p className="text-slate-400 text-sm mt-4">
								{new Date(record.date).toLocaleDateString("en-IN", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</p>
						</div>
					))}
			</div>
		</div>
	);
}

export default PersonalRecords;
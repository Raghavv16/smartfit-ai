import { CalendarDays, Clock3, Dumbbell } from "lucide-react";

function WorkoutHistory({ workouts }) {
	return (
		<div className="mt-8">
			<h2 className="text-2xl font-bold text-white mb-6">
				Workout History
			</h2>

			<div className="space-y-4">
				{[...workouts].reverse().map((workout) => (
					<div
						key={workout._id}
						className="
              bg-slate-900/70
              backdrop-blur-sm
              border border-slate-800
              rounded-3xl
              p-5
              shadow-lg
              hover:border-emerald-500
              hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]
              hover:-translate-y-1
              transition-all duration-300
            "
					>
						<div className="flex justify-between items-start">
							<div>
								<div className="flex items-center gap-2">
									<Dumbbell
										size={18}
										className="text-emerald-400"
									/>

									<h3 className="text-lg font-semibold capitalize text-white">
										{workout.exercise}
									</h3>
								</div>

								<div className="flex items-center gap-2 mt-2 text-slate-400 text-sm">
									<Clock3 size={14} />
									<span>{workout.duration} sec</span>
								</div>
							</div>

							<div className="text-right">
								<p className="text-2xl font-bold text-emerald-400">
									{workout.reps}
								</p>

								{
									workout.exercise == "Plank" ? (
										<p className="text-xs text-slate-400"> secs </p>
									) : (
										<p className="text-xs text-slate-400"> reps </p>
									)
								}
							</div>
						</div>

						{workout.date && (
							<div className="flex items-center gap-2 mt-4 text-xs text-slate-500 border-t border-slate-800 pt-3">
								<CalendarDays size={14} />

								<span>
									{new Date(workout.date).toLocaleString("en-IN", {
										day: "numeric",
										month: "short",
										year: "numeric",
										hour: "numeric",
										minute: "2-digit",
									})}
								</span>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default WorkoutHistory;
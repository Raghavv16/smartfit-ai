import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";

function GoalProgress() {
	const [goal, setGoal] = useState(100);
	const [progress, setProgress] = useState(0);

	const userId = localStorage.getItem("userId");

	useEffect(() => {
		axios
			.get(`${API_URL}/goal/${userId}`)
			.then((res) => {
				setGoal(res.data.workoutGoal);
				setProgress(res.data.currentProgress);
			});
	}, [userId]);

	const percentage = Math.min(
		(progress / goal) * 100,
		100
	);

	return (
		<div className="bg-slate-900/70 border border-slate-700 rounded-3xl p-6 my-4 mx-2">
			<h2 className="text-xl font-bold text-white">
				Goal Progress
			</h2>

			<p className="text-slate-400 mt-2">
				{progress} / {goal} reps
			</p>

			<div className="h-4 bg-slate-800 rounded-full mt-3 overflow-hidden">
				<div
					className="h-full bg-emerald-500"
					style={{
						width: `${percentage}%`,
					}}
				/>
			</div>

			<p className="text-emerald-400 mt-3">
				{percentage.toFixed(0)}% Complete
			</p>
		</div>
	);
}

export default GoalProgress;
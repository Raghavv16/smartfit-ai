import { useEffect, useState } from "react";
import axios from "axios";
import WorkoutHistory from "./WorkoutHistory"; // ✅ ADD THIS
import Navbar from "./ui/shared/Navbar";
import { toast } from "sonner";
import { API_URL } from "@/config";

function History() {
	const [workouts, setWorkouts] = useState([]);

	const userId = localStorage.getItem("userId");

	useEffect(() => {
		if (!userId) return;

		axios
			.get(`${API_URL}/workouts/${userId}`)
			.then((res) => setWorkouts(res.data))
			.catch((err) => {
				console.log(err);
				toast.error("Failed to load workout history")
			});
	}, [userId]);

	return (
		<div>
			<Navbar />
			<div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 p-6">
				<WorkoutHistory workouts={workouts} />
			</div>
		</div>
	);
}

export default History;
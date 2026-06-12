import Navbar from "./components/ui/shared/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import Hero from "./components/Hero.jsx";
import WorkoutControls from "./components/WorkoutControls.jsx";
import StatsCards from "./components/StatsCards.jsx";
import WorkoutChart from "./components/WorkoutChart.jsx";
import PieAnalytics from "./components/PieAnalytics.jsx";
import ProgressChart from "./components/ProgressChart.jsx";
import PersonalRecords from "./components/PersonalRecords.jsx";
import Footer from "./components/ui/shared/Footer";
import GoalProgress from "./components/GoalProgress";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function Dashboard() {
	const [workouts, setWorkouts] = useState([]);
	const [loading, setLoading] = useState(true);

	const userId = localStorage.getItem("userId");

	// ✅ SINGLE CLEAN API CALL
	useEffect(() => {
		if (!userId) return;

		const fetchWorkouts = async () => {
			try {
				const response = await axios.get(
					`http://127.0.0.1:8000/workouts/${userId}`
				);

				setWorkouts(response.data);

			} catch (error) {
				console.log(error);

				toast.error(
					"Failed to load workouts"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchWorkouts();
	}, [userId]);

	// ❌ If not logged in
	if (!userId) {
		return <Navigate to="/" />;
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col items-center justify-center gap-4">

				<Loader2
					size={50}
					className="animate-spin text-emerald-400"
				/>

				<p className="text-slate-300 text-lg">
					Loading Workouts...
				</p>

			</div>
		);
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
			<Navbar />

			<Hero />
			<GoalProgress />

			<WorkoutControls
				refreshWorkouts={() => {
					// optional manual refresh
					const fetchWorkouts = async () => {
						try {
							const response = await axios.get(
								`http://127.0.0.1:8000/workouts/${userId}`
							);
							setWorkouts(response.data);

						} catch (error) {
							console.log(error);

							toast.error(
								"Failed to load workouts"
							);
						}
					};

					fetchWorkouts();
				}}
			/>

			<StatsCards workouts={workouts} />

			<div className="chart-grid">
				<WorkoutChart workouts={workouts} />
				<PieAnalytics workouts={workouts} />
			</div>

			<ProgressChart workouts={workouts} />

			<PersonalRecords workouts={workouts} />

			<Footer />
		</div>
	);
}

export default Dashboard;
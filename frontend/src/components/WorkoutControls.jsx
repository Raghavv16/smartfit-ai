import axios from "axios";
import { Button } from "./ui/button";
import { Dumbbell, Activity, Armchair, Timer, Zap } from "lucide-react";
import { toast } from "sonner";

function WorkoutControls({ refreshWorkouts }) {
	const startWorkout = async (exercise) => {
		const exerciseNames = {
			pushup: "Pushup",
			squat: "Squat",
			bicep: "Bicep Curl",
			plank: "Plank",
			"jumping-jacks": "Jumping Jacks",
		};

		try {
			const userId = localStorage.getItem("userId");

			const toastId = toast.loading(
				`${exerciseNames[exercise]} In Progress...`
			);

			const response = await axios.get(
				`http://127.0.0.1:8000/${exercise}/${userId}`
			);

			toast.dismiss(toastId);

			toast.success(response.data.message);

			refreshWorkouts();

		} catch (error) {
			console.log(error);

			toast.error(
				error.response?.data?.message ||
				"Failed to start workout"
			);
		}
	};

	const buttonStyle = "flex items-center gap-2 min-w-[180px] justify-center bg-slate-900/70 backdrop-blur-sm border border-slate-700 \
	text-white rounded-2xl px-6 py-6 hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all duration-300";

	return (
		<div className="flex flex-wrap justify-center gap-5 my-8 mx-2">
			<Button
				onClick={() => startWorkout("pushup")}
				className={buttonStyle}
			>
				<Dumbbell size={18} />
				Pushup
			</Button>

			<Button
				onClick={() => startWorkout("squat")}
				className={buttonStyle}
			>
				<Activity size={18} />
				Squat
			</Button>

			<Button
				onClick={() => startWorkout("bicep")}
				className={buttonStyle}
			>
				<Armchair size={18} />
				Bicep Curl
			</Button>

			<Button
				onClick={() => startWorkout("plank")}
				className={buttonStyle}
			>
				<Timer size={18} />
				Plank
			</Button>

			<Button
				onClick={() => startWorkout("jumping-jacks")}
				className={buttonStyle}
			>
				<Zap size={18} />
				Jumping Jacks
			</Button>
		</div>
	);
}

export default WorkoutControls;
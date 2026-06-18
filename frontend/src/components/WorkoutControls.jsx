import axios from "axios";
import { Button } from "./ui/button";
import { Dumbbell, Activity, Armchair, Timer, Zap, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import QRCode from "react-qr-code";

function WorkoutControls({ refreshWorkouts }) {
	const [showQR, setShowQR] = useState(false);
	const navigate = useNavigate();

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
		<>
			<div className="flex justify-center gap-3 mt-8">
				<Button
					onClick={() => setShowQR(true)}
					className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 cursor-pointer"
				>
					<Smartphone className="mr-2 h-4 w-4" />
					Use Mobile Camera
				</Button>

				<Button
					onClick={() => navigate("/video-receiver")}
					className="bg-slate-900/70 border border-slate-700 text-white hover:bg-emerald-500/10 hover:border-emerald-500 cursor-pointer"
				>
					📹 Open Receiver
				</Button>
			</div>
			{
				showQR && (
					<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
						<div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 text-center">

							<h2 className="text-2xl font-bold text-white mb-4">
								Scan With Phone
							</h2>

							<div className="flex justify-center">
								<QRCode
									value="http://192.168.29.213:5173/mobile-camera"
									size={220}
									bgColor="#ffffff"
								/>
							</div>

							<div className="mt-5 text-slate-300 text-sm space-y-2">
								<p>1. Scan QR using your phone</p>
								<p>2. Open SmartFit Mobile Camera</p>
								<p>3. Click Connect Camera</p>
								<p>4. Return to laptop</p>
							</div>

							<p className="text-slate-400 mt-4">
								Open SmartFit Camera on your phone
							</p>

							<Button
								className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 mt-5 cursor-pointer"
								onClick={() => setShowQR(false)}
							>
								Close
							</Button>

						</div>
					</div>
				)
			}
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
		</>
	);
}

export default WorkoutControls;
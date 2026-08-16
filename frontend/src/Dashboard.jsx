import Navbar from "./components/ui/shared/Navbar";
import { useEffect, useRef, useState } from "react";
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
import socket from "./socket";
import { API_URL } from "./config";

function Dashboard() {
	const [workouts, setWorkouts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [cameraStatus, setCameraStatus] = useState("disconnected");
	const [showWorkoutPanel, setShowWorkoutPanel] = useState(false);

	const userId = localStorage.getItem("userId");

	const processedVideoRef = useRef(null);
	const viewerPeerRef = useRef(null);
	const viewerStreamRef = useRef(null);

	// ✅ SINGLE CLEAN API CALL
	useEffect(() => {
		if (!userId) return;

		const fetchWorkouts = async () => {
			try {
				const response = await axios.get(
					`${API_URL}/workouts/${userId}`
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

	useEffect(() => {

		socket.on(
			"camera_status",
			(data) => {
				setCameraStatus(
					data.status
				);
			}
		);

		return () => {
			socket.off("camera_status");
		};

	}, []);

	useEffect(() => {
		const fetchCameraStatus = async () => {
			try {
				const response = await axios.get(
					`${API_URL}/camera-status`
				);
				setCameraStatus(
					response.data.status
				);
			} catch (error) {
				console.log(error);
			}
		};

		fetchCameraStatus();
	}, []);

	useEffect(() => {

		if (cameraStatus !== "connected") {
			return;
		}

		const startViewer = async () => {

			const peer = new RTCPeerConnection({
				iceServers: [
					{
						urls: "stun:stun.l.google.com:19302"
					},
					{
						urls: import.meta.env.VITE_TURN_URL,
						username: import.meta.env.VITE_TURN_USERNAME,
						credential: import.meta.env.VITE_TURN_CREDENTIAL
					}
				]
			});

			peer.onconnectionstatechange = () => {
				console.log(
					"VIEWER CONNECTION:",
					peer.connectionState
				);
			};

			peer.oniceconnectionstatechange = () => {
				console.log(
					"VIEWER ICE:",
					peer.iceConnectionState
				);
			};

			viewerPeerRef.current = peer;

			peer.addTransceiver(
				"video",
				{
					direction: "recvonly"
				}
			);

			peer.ontrack = (event) => {

				const [stream] = event.streams;

				if (!stream) {
					return;
				}

				viewerStreamRef.current = stream;

				if (processedVideoRef.current) {
					processedVideoRef.current.srcObject = stream;
				}
			};

			peer.onicecandidate = (event) => {

				if (event.candidate) {

					socket.emit(
						"viewer_candidate",
						event.candidate
					);
				}
			};

			const offer =
				await peer.createOffer();

			await peer.setLocalDescription(
				offer
			);

			socket.emit(
				"viewer_offer",
				offer
			);
		};

		const handleAnswer = async (answer) => {

			if (!viewerPeerRef.current) {
				return;
			}

			await viewerPeerRef.current.setRemoteDescription(
				answer
			);
		};

		socket.on(
			"viewer_answer",
			handleAnswer
		);

		startViewer();

		return () => {

			socket.off(
				"viewer_answer",
				handleAnswer
			);

			viewerPeerRef.current?.close();

			viewerPeerRef.current = null;
		};

	}, [cameraStatus]);

	useEffect(() => {

		if (
			showWorkoutPanel &&
			processedVideoRef.current &&
			viewerStreamRef.current
		) {
			processedVideoRef.current.srcObject =
				viewerStreamRef.current;
		}

	}, [showWorkoutPanel]);

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
				cameraStatus={cameraStatus}
				onWorkoutStart={() => setShowWorkoutPanel(true)}
				onWorkoutStop={() => setShowWorkoutPanel(false)}

				refreshWorkouts={() => {
					// optional manual refresh
					const fetchWorkouts = async () => {
						try {
							const response = await axios.get(
								`${API_URL}/workouts/${userId}`
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

			{showWorkoutPanel && (
				<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">

					<div className="w-full max-w-5xl bg-slate-900/95 border border-slate-700 rounded-3xl p-5 shadow-2xl">

						{/* Header */}
						<div className="flex items-center justify-between mb-4">

							<div>
								<h2 className="text-xl font-bold text-white">
									SmartFit — Live Workout
								</h2>

								<p className="text-sm text-slate-400">
									Real-time analysis
								</p>
							</div>

							<div className="flex items-center gap-2">
								<div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
								<span className="text-sm text-emerald-400">
									Live
								</span>
							</div>

						</div>

						{/* VIDEO */}
						<video
							ref={processedVideoRef}
							autoPlay
							playsInline
							muted
							className="w-full max-h-[70vh] object-contain rounded-2xl border border-emerald-500/40 bg-black"
						/>

						{/* STOP */}
						<div className="flex justify-center mt-5">

							<button
								onClick={async () => {

									try {

										await axios.post(
											`${API_URL}/stop-workout`
										);

										setShowWorkoutPanel(false);

										toast.success(
											"Workout Completed!"
										);

										const response = await axios.get(
											`${API_URL}/workouts/${userId}`
										);

										setWorkouts(response.data);

									} catch (error) {

										console.log(error);

										toast.error(
											"Failed to stop workout"
										);

									}

								}}
								className="px-10 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
							>
								Stop Workout
							</button>

						</div>

					</div>

				</div>
			)}

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
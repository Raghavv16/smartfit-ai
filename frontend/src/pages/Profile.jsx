import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Ruler, Weight, Target, Pencil, Activity } from "lucide-react";
import Navbar from "@/components/ui/shared/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { API_URL } from "@/config";

function Profile() {
	const [user, setUser] = useState({});
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editData, setEditData] = useState({});

	const userId = localStorage.getItem("userId");

	const bmi = user.height && user.weight ? (
		user.weight / Math.pow(user.height / 100, 2)
	).toFixed(1) : 0;

	const bmiStatus = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";

	useEffect(() => {
		if (!userId) return;

		axios
			.get(`${API_URL}/profile/${userId}`)
			.then((res) => {
				if (!res.data.message) {
					setUser(res.data);
				}
			})
			.catch((err) => {
				console.log(err);
				toast.error("Failed to load profile");
			});
	}, [userId]);

	const openEdit = () => {
		setEditData(user);
		setIsEditOpen(true);
	};

	const handleUpdate = async () => {
		try {
			const response = await axios.put(
				`${API_URL}/profile/${userId}`,
				editData
			);

			setUser({
				...user,
				...editData
			});

			setIsEditOpen(false);

			toast.success(
				response.data.message ||
				"Profile Updated Successfully"
			);

		} catch (err) {
			console.log(err);
			toast.error(
				err.response?.data?.message ||
				"Failed to update profile"
			);
		}
	};

	const uploadAvatar = async (file) => {
		if (!file) return;

		try {
			const formData = new FormData();
			formData.append("file", file);

			const res = await axios.post(
				`${API_URL}/upload-avatar/${userId}`,
				formData
			);

			setUser({
				...user,
				avatar: res.data.avatar_url,
			});

			toast.success(
				res.data.message ||
				"Avatar Updated Successfully"
			);

		} catch (err) {
			console.log(err);

			toast.error(
				err.response?.data?.message ||
				"Failed to upload avatar"
			);
		}
	};

	return (
		<div>
			<Navbar />
			<div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 p-6">
				<div className="max-w-5xl mx-auto">
					<Card className="bg-slate-900/70 border-slate-800 backdrop-blur-xl rounded-3xl">
						<CardContent className="p-8">
							{/* Header */}
							<div className="flex flex-col md:flex-row items-center gap-6">
								<div className="relative w-fit">

									<Avatar className="h-24 w-24 text-4xl ring-2 ring-emerald-500/40">
										{user?.avatar ? (
											<AvatarImage src={user.avatar} alt={user.name} />
										) : (
											<AvatarFallback className="bg-emerald-500 text-white text-4xl font-bold">
												{user?.name?.charAt(0)?.toUpperCase()}
											</AvatarFallback>
										)}
									</Avatar>

									<label
										htmlFor="avatar-upload"
										className="absolute bottom-0 right-0 bg-emerald-500 border border-blue-50 p-2 rounded-full cursor-pointer shadow-md hover:bg-emerald-600 transition"
									>
										<Pencil size={14} className="text-white" />
									</label>

									<input
										id="avatar-upload"
										type="file"
										accept="image/*"
										className="hidden"
										onChange={(e) => {
											uploadAvatar(e.target.files[0]);
										}}
									/>

								</div >

								<div className="flex-1">
									<h1 className="text-3xl font-bold text-white">
										{user.name}
									</h1>

									<p className="text-slate-400 mt-1">
										{user.email}
									</p>
								</div>

								<Button
									onClick={openEdit}
									className="bg-emerald-500 hover:bg-emerald-600"
								>
									<Pencil className="mr-2 h-4 w-4" />
									Edit Profile
								</Button>
							</div>

							{/* Stats */}
							<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
								<Card className="bg-slate-800/50 border-slate-700">
									<CardContent className="p-5">
										<div className="flex items-center gap-3">
											<Calendar className="text-emerald-400" />
											<div>
												<p className="text-slate-400 text-sm">
													Age
												</p>
												<h3 className="text-xl font-bold text-white">
													{user.age}
												</h3>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className="bg-slate-800/50 border-slate-700">
									<CardContent className="p-5">
										<div className="flex items-center gap-3">
											<Ruler className="text-emerald-400" />
											<div>
												<p className="text-slate-400 text-sm">
													Height
												</p>
												<h3 className="text-xl font-bold text-white">
													{user.height} cm
												</h3>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className="bg-slate-800/50 border-slate-700">
									<CardContent className="p-5">
										<div className="flex items-center gap-3">
											<Weight className="text-emerald-400" />
											<div>
												<p className="text-slate-400 text-sm">
													Weight
												</p>
												<h3 className="text-xl font-bold text-white">
													{user.weight} kg
												</h3>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className="bg-slate-800/50 border-slate-700">
									<CardContent className="p-5">
										<div className="flex items-center gap-3">
											<Activity className="text-emerald-400" />
											<div>
												<p className="text-slate-400 text-sm">
													BMI
												</p>

												<h3 className="text-xl font-bold text-white">
													{bmi}
												</h3>

												<p
													className={`text-sm ${bmiStatus === "Normal"
														? "text-emerald-400"
														: bmiStatus === "Underweight"
															? "text-yellow-400"
															: "text-red-400"
														}`}
												>
													{bmiStatus}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</div >

							{/* Goal */}
							< Card className="mt-6 bg-slate-800/50 border-slate-700" >
								<CardContent className="p-6">
									<div className="flex items-center gap-3">
										<Target className="text-emerald-400" />
										<div>
											<p className="text-slate-400 text-sm">
												Fitness Goal
											</p>
											<h3 className="text-xl font-bold text-white">
												{user.goal}
											</h3>
										</div>
									</div>
								</CardContent>
							</Card >
							
						</CardContent >
					</Card >

					{/* Modal */}
					{
						isEditOpen && (
							<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
								<div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6">
									<h2 className="text-2xl font-bold text-white mb-5">
										Edit Profile
									</h2>

									<div className="space-y-4">
										<input
											disabled
											value={editData.name || ""}
											className="w-full rounded-lg bg-slate-800 p-3 text-white"
										/>

										<input
											disabled
											value={editData.email || ""}
											className="w-full rounded-lg bg-slate-800 p-3 text-white"
										/>

										<input
											type="number"
											placeholder="Age"
											value={editData.age || ""}
											onChange={(e) =>
												setEditData({
													...editData,
													age: e.target.value,
												})
											}
											className="w-full rounded-lg bg-slate-800 p-3 text-white"
										/>

										<input
											type="number"
											placeholder="Height"
											value={editData.height || ""}
											onChange={(e) =>
												setEditData({
													...editData,
													height: e.target.value,
												})
											}
											className="w-full rounded-lg bg-slate-800 p-3 text-white"
										/>

										<input
											type="number"
											placeholder="Weight"
											value={editData.weight || ""}
											onChange={(e) =>
												setEditData({
													...editData,
													weight: e.target.value,
												})
											}
											className="w-full rounded-lg bg-slate-800 p-3 text-white"
										/>

										<select
											value={editData.goal || ""}
											onChange={(e) =>
												setEditData({
													...editData,
													goal: e.target.value,
												})
											}
											className="w-full rounded-lg bg-slate-800 p-3 text-white"
										>
											<option>Weight Loss</option>
											<option>Weight Gain</option>
											<option>Muscle Gain</option>
											<option>Fitness</option>
										</select>

										<div className="flex gap-3 pt-2">
											<Button
												onClick={handleUpdate}
												className="flex-1 bg-emerald-500 hover:bg-emerald-600"
											>
												Save
											</Button>

											<Button
												variant="outline"
												onClick={() => setIsEditOpen(false)}
												className="flex-1"
											>
												Cancel
											</Button>
										</div>
									</div>
								</div>
							</div>
						)
					}
				</div >
			</div >
		</div >
	);
}

export default Profile;
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Cake, User, Mail, Lock, Ruler, Weight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

function Signup() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [age, setAge] = useState("");
	const [height, setHeight] = useState("");
	const [weight, setWeight] = useState("");
	const [goal, setGoal] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();

	const handleSignup = async () => {
		const emailRegex =
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

		if (!emailRegex.test(email)) {
			toast.error("Enter a valid email address");
			return;
		}

		if (!passwordRegex.test(password)) {
			toast.error(
				"Password must contain uppercase, lowercase, number, special character and be at least 8 characters long."
			);
			return;
		}

		if (name.length < 3) {
			toast.error("Name must be at least 3 characters");
			return;
		}

		try {
			const response = await axios.post(
				"http://127.0.0.1:8000/signup",
				{
					name,
					email,
					password,
					age: Number(age),
					height: Number(height),
					weight: Number(weight),
					goal,
				}
			);

			if (!response.data.userId) {
				toast.error(response.data.message);
				return;
			}

			toast.success(response.data.message);

			setTimeout(() => {
				navigate("/");
			}, 500)

		} catch (error) {
			toast.error(
				error.response?.data?.message ||
				"Signup Failed"
			);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950">
			<Card className="w-full max-w-md bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-2xl">
				<CardContent className="p-8">
					<div className="text-center mb-8">
						<div className="text-5xl mb-4">🏋️</div>

						<h1 className="text-3xl font-bold text-white">
							Create Account
						</h1>

						<p className="text-slate-400 mt-2">
							Join SmartFit AI and start tracking workouts
						</p>
					</div>

					<div className="space-y-4">
						<div className="relative">
							<User className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
							<Input
								placeholder="Full Name"
								className="pl-10 bg-slate-800 border-slate-700 text-white"
								onChange={(e) => setName(e.target.value)}
							/>
						</div>

						<div className="relative">
							<Mail className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
							<Input
								type="email"
								placeholder="Email Address"
								className="pl-10 bg-slate-800 border-slate-700 text-white"
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className="relative">
							<Lock className="absolute left-3 top-2 h-4 w-4 text-slate-400" />

							<Input
								type={showPassword ? "text" : "password"}
								placeholder="Create Password"
								className="pl-10 pr-10 bg-slate-800 border-slate-700 text-white"
								onChange={(e) => setPassword(e.target.value)}
							/>

							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-2 text-slate-400 hover:text-white"
							>
								{showPassword ? (
									<EyeOff size={18} />
								) : (
									<Eye size={18} />
								)}
							</button>
						</div>

						<div className="relative">
							<Cake className="absolute left-3 top-2 h-4 w-4 text-slate-400" />

							<Input
								type="number"
								placeholder="Age"
								className="pl-10 bg-slate-800 border-slate-700 text-white"
								onChange={(e) => setAge(e.target.value)}
							/>
						</div>

						<div className="relative">
							<Ruler className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
							<Input
								placeholder="Height (cm)"
								className="pl-10 bg-slate-800 border-slate-700 text-white"
								onChange={(e) => setHeight(e.target.value)}
							/>
						</div>

						<div className="relative">
							<Weight className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
							<Input
								placeholder="Weight (kg)"
								className="pl-10 bg-slate-800 border-slate-700 text-white"
								onChange={(e) => setWeight(e.target.value)}
							/>
						</div>

						<div className="relative">
							<Target className="absolute left-3 top-2 h-4 w-4 text-slate-400 z-10" />
							<select
								className="w-full h-10 rounded-md border border-slate-700 bg-slate-800 text-white pl-10"
								onChange={(e) => setGoal(e.target.value)}
							>
								<option value="">Select Goal</option>
								<option value="Weight Loss">Weight Loss</option>
								<option value="Weight Gain">Weight Gain</option>
								<option value="Muscle Gain">Muscle Gain</option>
								<option value="Fitness">Fitness</option>
							</select>
						</div>

						<Button
							onClick={handleSignup}
							className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
						>
							Create Account
						</Button>
					</div>

					<p className="text-center text-slate-400 mt-6">
						Already have an account?{" "}
						<Link
							to="/"
							className="text-emerald-400 hover:text-emerald-300"
						>
							Login
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

export default Signup;
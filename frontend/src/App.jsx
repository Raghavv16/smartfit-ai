import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./Dashboard";
import Profile from "./pages/Profile";
import History from "./components/History";
import Goal from "./pages/Goal";
import MobileCamera from "./pages/MobileCamera";
import VideoReceiver from "./pages/VideoReceiver";

function App() {
	return (
		<BrowserRouter>
			<Toaster
				position="bottom-right"
				richColors
				theme="dark"
			/>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/history" element={<History />} />
				<Route path="/goal" element={<Goal />} />
				<Route path="/mobile-camera" element={<MobileCamera />} />
				<Route path="/video-receiver" element={<VideoReceiver />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;





import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./Dashboard";
import Profile from "./pages/Profile";
import History from "./components/History";

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
			</Routes>
		</BrowserRouter>
	);
}

export default App;





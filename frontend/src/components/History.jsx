import { useEffect, useState } from "react";
import axios from "axios";
import WorkoutHistory from "./WorkoutHistory"; // ✅ ADD THIS
import Navbar from "./ui/shared/Navbar";

function History() {
  const [workouts, setWorkouts] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://127.0.0.1:8000/workouts/${userId}`)
      .then((res) => setWorkouts(res.data))
      .catch((err) => console.log(err));
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
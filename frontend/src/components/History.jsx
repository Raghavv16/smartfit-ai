import { useEffect, useState } from "react";
import axios from "axios";
import WorkoutHistory from "./WorkoutHistory"; // ✅ ADD THIS

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
    <div className="p-5">
      <WorkoutHistory workouts={workouts} />
    </div>
  );
}

export default History;
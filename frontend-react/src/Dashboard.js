import { useEffect, useState } from "react";
import axios from "axios";

import Header from "./components/Header";
import Hero from "./components/Hero";
import WorkoutControls from "./components/WorkoutControls";
import StatsCards from "./components/StatsCards";
import WorkoutChart from "./components/WorkoutChart";
import PieAnalytics from "./components/PieAnalytics";
import ProgressChart from "./components/ProgressChart";
import WorkoutHistory from "./components/WorkoutHistory";
import PersonalRecords from "./components/PersonalRecords";

import "./styles/dashboard.css";

function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

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
      }
    };

    fetchWorkouts();
  }, [userId]);

  // ❌ If not logged in
  if (!userId) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Please Login First</h2>
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark app" : "light app"}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <Hero />

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

      <WorkoutHistory workouts={workouts} />
    </div>
  );
}

export default Dashboard;
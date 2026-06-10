import Navbar from "./components/ui/shared/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import Hero from "./components/Hero.jsx";
import WorkoutControls from "./components/WorkoutControls.jsx";
import StatsCards from "./components/StatsCards.jsx";
import WorkoutChart from "./components/WorkoutChart.jsx";
import PieAnalytics from "./components/PieAnalytics.jsx";
import ProgressChart from "./components/ProgressChart.jsx";
import WorkoutHistory from "./components/WorkoutHistory.jsx";
import PersonalRecords from "./components/PersonalRecords.jsx";

import "./styles/dashboard.css";
import Footer from "./components/ui/shared/Footer";

function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-green-950 text-white">
      <Navbar />
      {/* <Header darkMode={darkMode} setDarkMode={setDarkMode} /> */}

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

      <Footer />
    </div>
  );
}

export default Dashboard;
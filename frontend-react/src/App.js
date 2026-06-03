import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import WorkoutChart from "./components/WorkoutChart";
import PieAnalytics from "./components/PieAnalytics";
import ProgressChart from "./components/ProgressChart";
import WorkoutHistory from "./components/WorkoutHistory";
import WorkoutControls from "./components/WorkoutControls";
import Hero from "./components/Hero";

import "./styles/dashboard.css";

function App() {

  const [workouts, setWorkouts] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  const getWorkouts = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/workouts"
      );
      setWorkouts(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    getWorkouts();

  }, []);

  console.log(workouts);

  return (

    <div className={darkMode ? "dark app" : "light app"}>

      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <Hero />

      <WorkoutControls />

      <StatsCards workouts={workouts} />
      <div className="chart-grid">
        <WorkoutChart workouts={workouts} />
        <PieAnalytics workouts={workouts} />
      </div>

      <ProgressChart workouts={workouts} />

      <WorkoutHistory workouts={workouts} />

    </div>
  );
}

export default App;
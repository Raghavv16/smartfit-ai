import axios from "axios";
import { Button } from "./ui/button";

function WorkoutControls({ refreshWorkouts }) {

  const startWorkout = async (exercise) => {
    try {

      const userId = localStorage.getItem("userId");

      console.log("User ID:", userId);

      await axios.get(
        `http://127.0.0.1:8000/${exercise}/${userId}`
      );

      refreshWorkouts();

    } catch (error) {
      console.log(error);
    }
  };

  return (
  <div className="flex flex-wrap justify-center gap-4 my-8">

    <Button
      onClick={() => startWorkout("pushup")}
      className="bg-slate-900/70 backdrop-blur-xl border border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/20 text-white rounded-2xl px-6 py-6 transition-all duration-300"
    >
      Start Pushup
    </Button>

    <Button
      onClick={() => startWorkout("squat")}
      className="bg-slate-900/70 backdrop-blur-xl border border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/20 text-white rounded-2xl px-6 py-6 transition-all duration-300"
    >
      Start Squat
    </Button>

    <Button
      onClick={() => startWorkout("bicep")}
      className="bg-slate-900/70 backdrop-blur-xl border border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/20 text-white rounded-2xl px-6 py-6 transition-all duration-300"
    >
      Start Bicep Curl
    </Button>

    <Button
      onClick={() => startWorkout("plank")}
      className="bg-slate-900/70 backdrop-blur-xl border border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/20 text-white rounded-2xl px-6 py-6 transition-all duration-300"
    >
      Start Plank
    </Button>

    <Button
      onClick={() => startWorkout("jumping-jacks")}
      className="bg-slate-900/70 backdrop-blur-xl border border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/20 text-white rounded-2xl px-6 py-6 transition-all duration-300"
    >
      Start Jumping Jacks
    </Button>

  </div>
);
}

export default WorkoutControls;
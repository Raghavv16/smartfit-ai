import axios from "axios";

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
    <div className="controls">

      <button
        onClick={() => startWorkout("pushup")}
      >
        Start Pushup
      </button>

      <button
        onClick={() => startWorkout("squat")}
      >
        Start Squat
      </button>

      <button
        onClick={() => startWorkout("bicep")}
      >
        Start Bicep Curl
      </button>

      <button
        onClick={() => startWorkout("plank")}
      >
        Start Plank
      </button>

    </div>
  );
}

export default WorkoutControls;
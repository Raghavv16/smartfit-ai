import axios from "axios";

function WorkoutControls() {

  const startWorkout = async (exercise) => {

    try {

      await axios.get(
        `http://127.0.0.1:8000/${exercise}`
      );

    } catch (error) {

      console.log(error);

      alert("Backend not running");
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
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/ui/shared/Navbar";
function Goal() {
  const [goal, setGoal] = useState(100);
  const [progress, setProgress] = useState(0);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/goal/${userId}`)
      .then((res) => {
        setGoal(res.data.workoutGoal);
        setProgress(res.data.currentProgress);
      });
  }, [userId]);

  const saveGoal = async () => {
    await axios.put(
      `http://127.0.0.1:8000/goal/${userId}`,
      {
        workoutGoal: Number(goal),
      }
    );

    alert("Goal Updated");
  };

  const percentage = Math.min(
    (progress / goal) * 100,
    100
  );

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-green-950  ">
             <Navbar/>
      <Card className="max-w-xl mx-auto bg-slate-900/70 border-slate-700 mt-50">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-white mb-6">
            Workout Goal
          </h1>

          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
          />

          <Button
            onClick={saveGoal}
            className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600"
          >
            Save Goal
          </Button>

          <div className="mt-6">
            <p className="text-slate-300 mb-2">
              {progress} / {goal} reps
            </p>

            <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>

            <p className="text-emerald-400 mt-2">
              {percentage.toFixed(0)}% Complete
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Goal;
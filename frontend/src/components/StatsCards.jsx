import { Card, CardContent } from "./ui/card";
import {
  Activity,
  Dumbbell,
  Flame,
  Clock,
  HeartPulse,
} from "lucide-react";

function StatsCards({ workouts }) {
  const totalReps = workouts.reduce(
    (sum, workout) => sum + workout.reps,
    0
  );

  const totalDuration = workouts.reduce(
    (sum, workout) => sum + workout.duration,
    0
  );

  const calories = Math.round(totalReps * 0.5);

  const uniqueDates = [
    ...new Set(
      workouts.map(
        (workout) => workout.date?.split("T")[0]
      )
    ),
  ].sort().reverse();

  let streak = 0;

  for (let i = 0; i < uniqueDates.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);

    const expectedDateString =
      expectedDate.toLocaleDateString("en-CA");

    if (uniqueDates[i] === expectedDateString) {
      streak++;
    } else {
      break;
    }
  }

  const stats = [
    {
      title: "Total Workouts",
      value: workouts.length,
      icon: <Activity size={24} />,
    },
    {
      title: "Total Reps",
      value: totalReps,
      icon: <Dumbbell size={24} />,
    },
    {
      title: "Current Streak",
      value: `${streak} 🔥`,
      icon: <Flame size={24} />,
    },
    {
      title: "Total Duration",
      value: `${totalDuration}s`,
      icon: <Clock size={24} />,
    },
    {
      title: "Calories Burned",
      value: calories,
      icon: <HeartPulse size={24} />,
    },
  ];

  return (
    <div className="mx-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 my-8">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="
            bg-slate-900/70
            backdrop-blur-sm
            border border-slate-800
            rounded-3xl
            shadow-lg
            hover:border-emerald-500
            hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]
            transition-all duration-300
          "
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">
                {stat.title}
              </p>

              <div className="text-emerald-400">
                {stat.icon}
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mt-4">
              {stat.value}
            </h1>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default StatsCards;
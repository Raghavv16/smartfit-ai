import { Dumbbell, TrendingUp } from "lucide-react";

function Hero() {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-3xl
        border border-emerald-500/20
        bg-linear-to-br
        from-emerald-500/20
        via-green-500/10
        to-slate-900/80
        backdrop-blur-xl
        shadow-2xl
        shadow-emerald-500/10
        p-8 md:p-10
        my-4
        mx-2
      "
    >
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Dumbbell className="text-emerald-400" size={34} />

            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              AI Fitness Tracker
            </h1>
          </div>

          <p className="text-slate-300 text-lg max-w-2xl">
            Track workouts, monitor progress, analyze performance,
            and achieve your fitness goals with AI-powered insights.
          </p>
        </div>

        <div
          className="
            flex items-center gap-3
            bg-slate-900/50
            border border-slate-700
            px-5 py-4
            rounded-2xl
          "
        >
          <TrendingUp className="text-emerald-400" />

          <div>
            <p className="text-slate-400 text-sm">
              Progress Tracking
            </p>
            <p className="text-white font-semibold">
              Real-Time Analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
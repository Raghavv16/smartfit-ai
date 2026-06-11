import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Dumbbell,
  Mail,
  Lock,
} from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          email,
          password,
        }
      );

      if (!response.data.userId) {
        alert(response.data.message);
        return;
      }

      localStorage.setItem(
        "userId",
        response.data.userId
      );

      window.location.href = "/dashboard";
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-6">
      <Card
        className="
          w-full
          max-w-lg
          border
          border-slate-700
          bg-slate-900/70
          backdrop-blur-xl
          shadow-2xl
          rounded-3xl
          transition-all
          duration-300
          hover:border-emerald-500/40
        "
      >
        <CardContent className="p-10">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="
                h-24
                w-24
                rounded-3xl
                bg-linear-to-br
                from-emerald-400
                to-emerald-600
                flex
                items-center
                justify-center
                shadow-xl
                shadow-emerald-500/30
              "
            >
              <Dumbbell
                size={40}
                className="text-white"
              />
            </div>

            <h1 className="text-4xl font-extrabold text-white mt-6 tracking-tight">
              SmartFit{" "}
              <span className="text-emerald-400">
                AI
              </span>
            </h1>

            <p className="text-slate-400 mt-3 text-center max-w-sm">
              Track workouts, monitor progress,
              and achieve your fitness goals.
            </p>
          </div>

          {/* Email */}
          <div className="relative mb-4">
            <Mail
              size={18}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <Input
              type="email"
              placeholder="Enter Email"
              className="
                pl-16
                h-14
                bg-slate-800
                border-slate-700
                text-white
                placeholder:text-slate-400
                focus:border-emerald-500
              "
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <Lock
              size={18}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <Input
              type="password"
              placeholder="Enter Password"
              className="
                pl-16
                h-14
                bg-slate-800
                border-slate-700
                text-white
                placeholder:text-slate-400
                focus:border-emerald-500
              "
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="
              w-full
              h-14
              text-lg
              font-semibold
              bg-emerald-500
              hover:bg-emerald-600
              transition-all
            "
          >
            Login
          </Button>

          {/* Footer */}
          <p className="text-center text-slate-400 mt-8">
            Don't have an account?

            <Link
              to="/signup"
              className="
                text-emerald-400
                ml-2
                hover:text-emerald-300
                font-medium
              "
            >
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
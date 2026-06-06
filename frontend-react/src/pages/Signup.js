import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Login.css";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");



  const handleSignup = async () => {

    try {

      await axios.post(
        "http://127.0.0.1:8000/signup",
        {
          name,
          email,
          password,
          age: Number(age),
          height: Number(height),
          weight: Number(weight),
          goal
        }
      );

      alert("Signup Successful");

      window.location.href = "/";

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <div className="auth-logo">
          🚀
        </div>

        <h1>Create Account</h1>

        <p>
          Join SmartFit AI and start tracking workouts
        </p>

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Create Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          placeholder="Age"
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          placeholder="Height (cm)"
          onChange={(e) => setHeight(e.target.value)}
        />

        <input
          placeholder="Weight (kg)"
          onChange={(e) => setWeight(e.target.value)}
        />

        <select
          onChange={(e) => setGoal(e.target.value)}
        >
          <option value="">Select Goal</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Weight Gain">Weight Gain</option>
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="Fitness">Fitness</option>
        </select>

        <button
          className="auth-btn"
          onClick={handleSignup}
        >
          Sign Up
        </button>

        <div className="auth-footer">
          Already have an account?
          <Link to="/">
            {" "}Login
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Signup;
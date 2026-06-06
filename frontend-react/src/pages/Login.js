import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "userId",
        response.data.userId
      );

      window.location.href = "/dashboard";

    } catch (error) {

      alert("Invalid Credentials");
    }
  };

  return (
   <div className="auth-container">

  <div className="auth-card">

    <div className="auth-logo">
      🏋️
    </div>

    <h1>SmartFit AI</h1>

    <p>
      Login to continue your fitness journey
    </p>

    <input
      type="email"
      placeholder="Enter Email"
      onChange={(e)=>setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Enter Password"
      onChange={(e)=>setPassword(e.target.value)}
    />

    <button
      className="auth-btn"
      onClick={handleLogin}
    >
      Login
    </button>

    <div className="auth-footer">
      Don't have an account?
      <Link to="/signup">
        {" "}Sign Up
      </Link>
    </div>

  </div>

</div>
  );
}

export default Login;
import { LogOut, Moon, Sun } from "lucide-react";
import { useState } from "react";

function Header({ darkMode, setDarkMode }) {
  return (
    <div className="header">
      <div>

        <h1>AI Fitness Dashboard</h1>
        <p>Track your workout analytics</p>
      </div>

      <div className="header-actions">
        <button
          className="icon-btn"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        
        <button
          onClick={() =>
            window.location.href = "/profile"
          }
        >
          Profile
        </button>

        <button
          className="icon-btn logout-btn"
          title="Logout"
          onClick={() => {
            localStorage.removeItem("userId");
            window.location.href = "/";
          }}
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}

export default Header;
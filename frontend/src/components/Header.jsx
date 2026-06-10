import { LogOut, Moon, Sun, User } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

function Header({ darkMode, setDarkMode }) {
  const [user, setUser] = useState({});
  const [showMenu, setShowMenu] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://127.0.0.1:8000/profile/${userId}`)
      .then(res => setUser(res.data))
      .catch(err => console.log(err));

  }, [userId]);

  return (
    <div className="header">

      <div>
        <h1>AI Fitness Dashboard</h1>
        <p>Track your workout analytics</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="header-actions">

        {/* AVATAR BUTTON */}
        <div className="profile-wrapper">

          <button
            className="avatar-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            {user.name?.charAt(0).toUpperCase() || "U"}
          </button>

          {/* DROPDOWN MENU */}
          {showMenu && (
            <div className="profile-menu">

              <h4>{user.name}</h4>

              <button
                onClick={() =>
                  window.location.href = "/profile"
                }
              >
                <User size={16} />
                View Profile
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? (
                  <>
                    <Sun size={16} />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon size={16} />
                    Dark Mode
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("userId");
                  window.location.href = "/";
                }}
              >
                <LogOut size={16} />
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Header;
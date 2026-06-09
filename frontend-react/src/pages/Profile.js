import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const userId = localStorage.getItem("userId");

  // ---------------- FETCH PROFILE ----------------
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://127.0.0.1:8000/profile/${userId}`)
      .then((res) => {
        console.log(res.data);

        if (res.data.message) {
          console.log("Profile error:", res.data.message);
          return;
        }

        setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  // ---------------- OPEN EDIT ----------------
  const openEdit = () => {
    setEditData(user);
    setIsEditOpen(true);
  };

  // ---------------- HANDLE UPDATE ----------------
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/profile/${userId}`,
        editData
      );

      console.log(res.data);

      setUser(editData);
      setIsEditOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profile-container">

      <div className="profile-card">

        {/* HEADER */}
        <div className="profile-header">

          <div className="profile-avatar">
            {user.name?.charAt(0)}
          </div>

          <div className="profile-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>

        </div>

        {/* EDIT BUTTON */}
        <button className="edit-btn" onClick={openEdit}>
          Edit Profile
        </button>

        {/* GRID */}
        <div className="profile-grid">

          <div className="profile-item">
            <h4>Age</h4>
            <p>{user.age}</p>
          </div>

          <div className="profile-item">
            <h4>Height</h4>
            <p>{user.height} cm</p>
          </div>

          <div className="profile-item">
            <h4>Weight</h4>
            <p>{user.weight} kg</p>
          </div>

        </div>

        {/* GOAL */}
        <div className="goal-card">
          <h3>Fitness Goal</h3>
          <p>{user.goal}</p>
        </div>

      </div>

      {/* ---------------- EDIT MODAL ---------------- */}
   {isEditOpen && (
  <div className="modal-overlay">

    <div className="modal">

      <h2>Edit Profile</h2>

      {/* NAME (NOT EDITABLE) */}
      <label>Name</label>
      <input
        value={editData.name || ""}
        disabled
      />

      {/* EMAIL (NOT EDITABLE) */}
      <label>Email</label>
      <input
        value={editData.email || ""}
        disabled
      />

      {/* AGE */}
      <label>Age</label>
      <input
        type="number"
        value={editData.age || ""}
        onChange={(e) =>
          setEditData({ ...editData, age: e.target.value })
        }
      />

      {/* HEIGHT */}
      <label>Height (cm)</label>
      <input
        type="number"
        value={editData.height || ""}
        onChange={(e) =>
          setEditData({ ...editData, height: e.target.value })
        }
      />

      {/* WEIGHT */}
      <label>Weight (kg)</label>
      <input
        type="number"
        value={editData.weight || ""}
        onChange={(e) =>
          setEditData({ ...editData, weight: e.target.value })
        }
      />

      {/* GOAL */}
      <label>Fitness Goal</label>
      <select
        value={editData.goal || ""}
        onChange={(e) =>
          setEditData({ ...editData, goal: e.target.value })
        }
      >
        <option value="Weight Loss">Weight Loss</option>
        <option value="Weight Gain">Weight Gain</option>
        <option value="Muscle Gain">Muscle Gain</option>
        <option value="Fitness">Fitness</option>
      </select>

      {/* BUTTONS */}
      <div className="modal-buttons">

        <button onClick={handleUpdate}>
          Save
        </button>

        <button onClick={() => setIsEditOpen(false)}>
          Cancel
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}

export default Profile;
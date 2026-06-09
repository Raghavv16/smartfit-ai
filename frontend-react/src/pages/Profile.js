import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";

function Profile() {

  const [user, setUser] = useState({});

  const userId =
    localStorage.getItem("userId");

useEffect(() => {

  if (!userId) return;

  axios
    .get(`http://127.0.0.1:8000/profile/${userId}`)
    .then(res => {
      console.log(res.data);
      setUser(res.data);
    })
    .catch(err => console.log(err));

}, [userId]);


  return (

  <div className="profile-container">

    <div className="profile-card">

      <div className="profile-header">

        <div className="profile-avatar">
          {user.name?.charAt(0)}
        </div>

        <div className="profile-info">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>

      </div>

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

      <div className="goal-card">
        <h3>Fitness Goal</h3>
        <p>{user.goal}</p>
      </div>

    </div>

  </div>

);
}

export default Profile;
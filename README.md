# 🏋️ SmartFit AI

An AI-powered fitness tracking web application that provides real-time exercise analysis using computer vision. SmartFit AI helps users perform workouts with proper form by tracking body posture, counting repetitions, and recording workout history.

---

## ✨ Features

- 🤖 AI-powered pose detection using MediaPipe
- 📱 Mobile phone camera support via WebRTC
- 💻 Laptop webcam support
- 🔢 Real-time repetition counting
- 📐 Live joint angle calculation
- 💬 Instant exercise feedback
- 📊 Workout analytics dashboard
- 🎯 Goal tracking
- 📈 Progress visualization
- 🏆 Personal records
- ☁️ Cloudinary profile image upload
- 🔐 User authentication
- 💾 MongoDB Atlas database

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- shadcn/ui
- Axios
- Socket.IO Client
- Recharts
- Framer Motion

### Backend
- FastAPI
- Python
- Socket.IO
- WebRTC (aiortc)
- MediaPipe
- OpenCV
- MongoDB Atlas
- Cloudinary

---

## 🚀 Core Features

### AI Exercise Detection
- Pushups
- Squats
- Bicep Curls
- Plank
- Jumping Jacks

### Dashboard
- Workout history
- Total workouts
- Total repetitions
- Exercise distribution
- Progress charts
- Goal progress
- Personal records

### Authentication
- User Signup
- User Login
- JWT Authentication
- Profile Management

---

## 📷 AI Workflow

```text
Phone Camera / Webcam
          │
          ▼
       WebRTC Stream
          │
          ▼
      FastAPI Backend
          │
          ▼
   MediaPipe Pose Detection
          │
          ▼
 Angle Calculation & AI Logic
          │
          ▼
 Repetition Counter & Feedback
          │
          ▼
 MongoDB Workout Storage
          │
          ▼
 React Dashboard Analytics
```

---

## 📁 Project Structure

```text
SmartFit-AI
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── routes
│   ├── processors
│   ├── models
│   ├── socket_events.py
│   ├── socket_server.py
│   ├── webrtc_receiver.py
│   └── main.py
│
└── requirements.txt
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/smartfit-ai.git

cd smartfit-ai
```

---

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r ../requirements.txt

uvicorn main:app --reload
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
MONGO_URI=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

BACKEND_URL=
```

### Frontend (.env)

```env
VITE_API_URL=

VITE_SOCKET_URL=
```

---

## 📸 Screenshots

- Login Page
<img width="1918" height="893" alt="Screenshot 2026-07-03 031006" src="https://github.com/user-attachments/assets/5d7d6b01-bcbd-4631-9d64-d5530c717632" />

---

- Dashboard Page 
<img width="1918" height="912" alt="Screenshot 2026-07-03 030939" src="https://github.com/user-attachments/assets/d4aa8ae2-da86-45d2-abb3-ae06aaca0a19" />

---

<img width="1917" height="907" alt="Screenshot 2026-07-03 030830" src="https://github.com/user-attachments/assets/9dc887e4-c9a1-4733-9d9e-dd1a143c3739" />

---

<img width="1918" height="905" alt="Screenshot 2026-07-03 030842" src="https://github.com/user-attachments/assets/d25c8fc7-08d7-44be-8616-3c1f9a3fb574" />

---

<img width="1918" height="888" alt="Screenshot 2026-07-03 030859" src="https://github.com/user-attachments/assets/314a13c2-0639-4de3-9af5-08747e2b1706" />

---

- Profile Page
<img width="1918" height="906" alt="Screenshot 2026-07-03 030954" src="https://github.com/user-attachments/assets/2334dc50-0214-4867-ba40-c3cc28f74573" />

---

- History Page
<img width="1918" height="916" alt="Screenshot 2026-07-03 030908" src="https://github.com/user-attachments/assets/3733f541-3310-4dcb-8e8a-386f7a1baa48" />

---

- Goal Page
<img width="1918" height="906" alt="Screenshot 2026-07-03 030918" src="https://github.com/user-attachments/assets/b284119e-9aa1-4770-a399-29bd2fc478e1" />

---

## 🔮 Future Improvements

- Workout plans
- AI posture correction
- Voice feedback
- Leaderboards
- Exercise recommendation system

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

## 👨‍💻 Author

**Suman Mouriya** 
GitHub: https://github.com/suman2045
LinkedIn: https://linkedin.com/in/suman-mouriya-b26b6527a

**Raghav Chhabra**
GitHub: https://github.com/Raghavv16
LinkedIn: https://linkedin.com/in/raghav-chhabra-2b75bb2b8

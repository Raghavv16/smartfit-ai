# FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Socket
from socket_server import socket_app
# Registers all Socket.IO event handlers do not remove!
import socket_events
# Routes
from routes.ai import router as ai_router
from routes.workout import router as workout_router
from routes.goal import router as goal_router
from routes.profile import router as profile_router
from routes.auth import router as auth_router

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home Route
@app.get("/")
def home():

    return {
        "message": "AI Fitness Tracker Backend Running"
    }
    
# -------------------------------
# ROUTERS
# -------------------------------

app.include_router(auth_router)

app.include_router(ai_router)

app.include_router(workout_router)

app.include_router(goal_router)

app.include_router(profile_router)

# -------------------------------
# SOCKET.IO
# -------------------------------

app.mount("/socket.io", socket_app)

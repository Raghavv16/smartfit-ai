from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import workouts_collection
import subprocess
import sys

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Workout Model
class Workout(BaseModel):

    exercise: str
    reps: int
    duration: int
    date: str


# Home Route
@app.get("/")
def home():

    return {
        "message": "AI Fitness Tracker Backend Running"
    }


# -------------------------------
# AI EXERCISE ROUTES
# -------------------------------

@app.get("/bicep")
def start_bicep():

    subprocess.run([
        sys.executable,
        "../ai-engine/LeftBicepCurl.py"
    ])

    return {
        "exercise": "Bicep Curl",
        "status": "started"
    }


@app.get("/squat")
def start_squat():

    subprocess.run([
        sys.executable,
        "../ai-engine/Squat.py"
    ])

    return {
        "exercise": "Squat",
        "status": "started"
    }


@app.get("/pushup")
def start_pushup():

    subprocess.run([
        sys.executable,
        "../ai-engine/Pushup.py"
    ])

    return {
        "exercise": "Pushup",
        "status": "started"
    }

@app.get("/plank")
def start_plank():

    subprocess.run([
        sys.executable,
        "../ai-engine/Plank.py"
    ])

    return {
        "exercise": "Plank",
        "status": "started"
    }


# -------------------------------
# DATABASE ROUTES
# -------------------------------

@app.post("/save-workout")
def save_workout(workout: Workout):

    workouts_collection.insert_one(
        workout.dict()
    )

    return {
        "message": "Workout Saved Successfully"
    }


@app.get("/workouts")
def get_workouts():

    workouts = []

    for workout in workouts_collection.find():

        workout["_id"] = str(workout["_id"])

        workouts.append(workout)

    return workouts
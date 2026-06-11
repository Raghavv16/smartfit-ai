from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import workouts_collection, users_collection
from bson import ObjectId
from utils.cloudinary import cloudinary
import subprocess
import sys
import re
import cloudinary.uploader

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
    userId: str
    exercise: str
    reps: int
    duration: int
    date: str


#User Model 
class User(BaseModel):
    name: str
    email: str
    password: str
    age: int
    height: float
    weight: float
    goal: str


    
# Backend Validation
def validate_password(password):

    pattern = (
        r"^(?=.*[a-z])"
        r"(?=.*[A-Z])"
        r"(?=.*\d)"
        r"(?=.*[@$!%*?&])"
        r"[A-Za-z\d@$!%*?&]{8,}$"
    )

    return re.match(pattern, password)


# Home Route
@app.get("/")
def home():

    return {
        "message": "AI Fitness Tracker Backend Running"
    }


# -------------------------------
# AI EXERCISE ROUTES
# -------------------------------

@app.get("/bicep/{user_id}")
def start_bicep(user_id: str):

    subprocess.run([
        sys.executable,
        "../ai-engine/LeftBicepCurl.py",
        user_id
    ])

    return {
        "exercise": "Bicep Curl",
        "status": "started"
    }


@app.get("/squat/{user_id}")
def start_squat(user_id:str):

    subprocess.run([
        sys.executable,
        "../ai-engine/Squat.py",
        user_id
    ])

    return {
        "exercise": "Squat",
        "status": "started"
    }


@app.get("/pushup/{user_id}")
def start_pushup(user_id: str):

    subprocess.run([
        sys.executable,
        "../ai-engine/Pushup.py",
        user_id
    ])

    return {"status": "started"}



@app.get("/plank/{user_id}")
def start_plank(user_id:str):

    subprocess.run([
        sys.executable,
        "../ai-engine/Plank.py",
        user_id
    ])

    return {
        "exercise": "Plank",
        "status": "started"
    }



@app.get("/jumping-jacks/{user_id}")
def start_jumping_jacks(user_id:str):

    subprocess.run([
        sys.executable,
        "../ai-engine/JumpingJacks.py",
        user_id
    ])

    return {
        "exercise": "Jumping Jacks",
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


@app.get("/workouts/{user_id}")
def get_workouts(user_id: str):

    workouts = []

    for workout in workouts_collection.find(
        {"userId": user_id}
    ):
        workout["_id"] = str(workout["_id"])
        workouts.append(workout)

    return workouts


# -------------------------------
# SIGN UP ROUTES
# -------------------------------

@app.post("/signup")
def signup(user: User):

    result = users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": user.password,
        "age": user.age,
        "height": user.height,
        "weight": user.weight,
        "goal": user.goal
    })
    if not validate_password(user.password):
        return {
        "message":
        "Weak password"
    }

    email_pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"

    if not re.match(email_pattern,user.email):
        return {
        "message":
        "Invalid email"
    }

    print("Inserted ID:", result.inserted_id)  # DEBUG

    return {
        "message": "Signup Successful",
        "userId": str(result.inserted_id)
    }


# -------------------------------
# LOGIN ROUTES
# -------------------------------

class Login(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(data: Login):

    try:
        user = users_collection.find_one({"email": data.email})

        if not user:
            return {"message": "User not found", "userId": None}

        if user.get("password") != data.password:
            return {"message": "Invalid password", "userId": None}

        return {
            "message": "Login Successful",
            "userId": str(user["_id"])
        }

    except Exception as e:
        print("LOGIN ERROR:", e)
        return {"message": "Server error", "userId": None}


# -------------------------------
# Get User Profile
# -------------------------------


@app.get("/profile/{user_id}")
def get_profile(user_id: str):

    try:
        user = users_collection.find_one(
            {"_id": ObjectId(user_id)}
        )
    except InvalidId:
        return {"message": "Invalid user id"}

    if not user:
        return {"message": "User not found"}

    user["_id"] = str(user["_id"])
    return user

# -------------------------------
# Update Profile
# -------------------------------


@app.put("/profile/{user_id}")
def update_profile(user_id: str, profile: dict):

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "name": profile["name"],
                "age": profile["age"],
                "height": profile["height"],
                "weight": profile["weight"],
                "goal": profile["goal"]
            }
        }
    )

    return {
        "message": "Profile Updated Successfully"
    }

@app.post("/upload-avatar/{user_id}")
async def upload_avatar(user_id: str, file: UploadFile = File(...)):

    result = cloudinary.uploader.upload(file.file)

    avatar_url = result["secure_url"]

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "avatar": avatar_url
            }
        }
    )

    return {
        "avatar_url": result["secure_url"]
    }
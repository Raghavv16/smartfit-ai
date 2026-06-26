from fastapi import FastAPI, UploadFile, File, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import workouts_collection, users_collection
from bson import ObjectId
from bson.errors import InvalidId
from utils.cloudinary import cloudinary
from socket_server import sio, socket_app
from fastapi.responses import Response
from webrtc_receiver import (peer_connection, latest_frame)
from aiortc import (RTCSessionDescription, RTCPeerConnection, RTCIceCandidate)
from aiortc.sdp import candidate_from_sdp
from processors.phone.bicep_curl_processor import display_loop as bicep_loop
from processors.phone.squat_processor import display_loop as squat_loop
from processors.phone.pushup_processor import display_loop as pushup_loop
from processors.phone.plank_processor import display_loop as plank_loop
from processors.phone.jumping_jacks_processor import display_loop as jumping_jacks_loop
import threading
import webrtc_receiver
import re
import cloudinary.uploader
import bcrypt
import cv2
import numpy as np
import base64
import time
from processors.webcam.bicep_curl_processor import display_loop as webcam_bicep_loop
from processors.webcam.squat_processor import display_loop as webcam_squat_loop
from processors.webcam.pushup_processor import display_loop as webcam_pushup_loop
from processors.webcam.plank_processor import display_loop as webcam_plank_loop
from processors.webcam.jumping_jacks_processor import display_loop as webcam_jumping_jacks_loop

latest_frame = None

app = FastAPI()

@sio.event
async def camera_connected(sid):
    webrtc_receiver.phone_connected = True

    await sio.emit(
        "camera_status",
        {"status": "connected"}
    )
    
@sio.event
async def camera_disconnected(sid):
    webrtc_receiver.phone_connected = False

    await sio.emit(
        "camera_status",
        {"status":"disconnected"}
    )
    
@sio.event
async def disconnect(sid):
    webrtc_receiver.phone_connected = False

    await sio.emit(
        "camera_status",
        {"status": "disconnected"}
    )
    
@app.get("/camera-status")
def camera_status():

    return {
        "status": (
            "connected"
            if webrtc_receiver.phone_connected
            else "disconnected"
        )
    }
    
@sio.event
async def offer(sid, data):
    webrtc_receiver.peer_connection = RTCPeerConnection()

    peer_connection = webrtc_receiver.peer_connection
    
    @peer_connection.on("track")
    async def on_track(track):
        print(
            "TRACK RECEIVED:",
            track.kind
        )
        
        if track.kind == "video":
            
            while True:
                frame = await track.recv()

                img = frame.to_ndarray(format="bgr24")
                
                if img.shape != getattr(
                    webrtc_receiver,
                    "last_shape",
                    None
                ):
                    print(
                        time.strftime("%H:%M:%S"),
                        "NEW SHAPE:",
                        img.shape
                    )

                    webrtc_receiver.last_shape = img.shape
                
                with webrtc_receiver.frame_lock:
                    webrtc_receiver.latest_frame = img

    print("New Peer Connection Created")

    print("Offer Received")

    offer = RTCSessionDescription(
        sdp=data["sdp"],
        type=data["type"]
    )

    print("Offer Parsed")

    await peer_connection.setRemoteDescription(
        offer
    )

    print("Remote Description Set")
    
    answer = await peer_connection.createAnswer()

    await peer_connection.setLocalDescription(
        answer
    )

    print("Answer Created")
    
    await sio.emit(
        "answer",
        {
            "sdp": peer_connection.localDescription.sdp,
            "type": peer_connection.localDescription.type
        }
    )

    print("Answer Sent To Phone")
    
@sio.event
async def answer(sid, data):
    print("Answer Received")

    await sio.emit(
        "answer",
        data
    )
    
@sio.event
async def candidate(sid, candidate):

    print("Candidate Received")

    if webrtc_receiver.peer_connection is None:
        return

    rtc_candidate = candidate_from_sdp(
        candidate["candidate"]
        .replace("candidate:", "")
    )

    rtc_candidate.sdpMid = candidate["sdpMid"]
    rtc_candidate.sdpMLineIndex = candidate["sdpMLineIndex"]

    await webrtc_receiver.peer_connection.addIceCandidate(
        rtc_candidate
    )

    print("Candidate Added")

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

    workoutGoal: int = 100
    currentProgress: int = 0


    
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

@app.post("/frame")
async def receive_frame(request: Request):

    global latest_frame
    
    data = await request.json()

    frame_data = data["frame"]

    encoded = frame_data.split(",")[1]

    image_bytes = base64.b64decode(encoded)

    image_array = np.frombuffer(
        image_bytes,
        dtype=np.uint8
    )

    latest_frame = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR
    )

    return {
        "success": True
    }
    
@app.get("/latest-frame-status")
def latest_frame_status():

    global latest_frame

    return {
        "available": latest_frame is not None
    }
    
@app.get("/latest-frame-shape")
def latest_frame_shape():

    global latest_frame

    if latest_frame is None:
        return {
            "message": "No Frame"
        }

    return {
        "shape": latest_frame.shape
    }
    
@app.get("/latest-frame")
def get_latest_frame():

    global latest_frame

    if latest_frame is None:
        return {
            "message": "No Frame"
        }

    _, buffer = cv2.imencode(
        ".jpg",
        latest_frame
    )

    return Response(
        content=buffer.tobytes(),
        media_type="image/jpeg"
    )
    
@app.get("/webrtc-frame-shape")
def webrtc_frame_shape():

    if webrtc_receiver.latest_frame is None:
        return {
            "message": "No Frame"
        }

    return {
        "shape":
        webrtc_receiver.latest_frame.shape
    }
    
@app.get("/webrtc-frame-status")
def webrtc_frame_status():

    return {
        "has_frame":
        webrtc_receiver.latest_frame is not None
    }

# Home Route
@app.get("/")
def home():

    return {
        "message": "AI Fitness Tracker Backend Running"
    }


# -------------------------------
# AI EXERCISE ROUTES
# -------------------------------

@app.get("/bicep/webcam/{user_id}")
def start_bicep(user_id: str):

    webrtc_receiver.workout_active = True
    webrtc_receiver.current_user_id = user_id

    if (
        webrtc_receiver.display_thread is None
        or
        not webrtc_receiver.display_thread.is_alive()
    ):
        webrtc_receiver.display_thread = threading.Thread(
            target=webcam_bicep_loop,
            daemon=True
        )
        webrtc_receiver.display_thread.start()

    return {
        "message": "Bicep Curl Started",
        "exercise": "Bicep Curl"
    }

@app.get("/squat/webcam/{user_id}")
def start_squat(user_id:str):

    webrtc_receiver.workout_active = True
    webrtc_receiver.current_user_id = user_id

    if (
        webrtc_receiver.display_thread is None
        or
        not webrtc_receiver.display_thread.is_alive()
    ):

        webrtc_receiver.display_thread = threading.Thread(
            target=webcam_squat_loop,
            daemon=True
        )

        webrtc_receiver.display_thread.start()

    return {
        "message": "Squat Started",
        "exercise": "Squat"
    }

@app.get("/pushup/webcam/{user_id}")
def start_pushup_webcam(user_id: str):

    webrtc_receiver.workout_active = True
    webrtc_receiver.current_user_id = user_id

    if (
        webrtc_receiver.display_thread is None
        or
        not webrtc_receiver.display_thread.is_alive()
    ):

        webrtc_receiver.display_thread = threading.Thread(
            target=webcam_pushup_loop,
            daemon=True
        )

        webrtc_receiver.display_thread.start()

    return {
        "message": "Pushup Started",
        "exercise": "Pushup"
    }

@app.get("/plank/webcam/{user_id}")
def start_plank_webcam(user_id: str):

    webrtc_receiver.workout_active = True
    webrtc_receiver.current_user_id = user_id

    if (
        webrtc_receiver.display_thread is None
        or
        not webrtc_receiver.display_thread.is_alive()
    ):

        webrtc_receiver.display_thread = threading.Thread(
            target=webcam_plank_loop,
            daemon=True
        )

        webrtc_receiver.display_thread.start()

    return {
        "message": "Plank Started",
        "exercise": "Plank"
    }

@app.get("/jumping-jacks/webcam/{user_id}")
def start_jumping_jacks_webcam(user_id: str):

    webrtc_receiver.workout_active = True
    webrtc_receiver.current_user_id = user_id

    if (
        webrtc_receiver.display_thread is None
        or
        not webrtc_receiver.display_thread.is_alive()
    ):

        webrtc_receiver.display_thread = threading.Thread(
            target=webcam_jumping_jacks_loop,
            daemon=True
        )

        webrtc_receiver.display_thread.start()

    return {
        "message": "Jumping Jacks Started",
        "exercise": "Jumping Jacks"
    }

# -------------------------------
# DATABASE ROUTES
# -------------------------------

@app.post("/save-workout")
def save_workout(workout: Workout):

    workouts_collection.insert_one(
        workout.dict()
    )

    users_collection.update_one(
        {"_id": ObjectId(workout.userId)},
        {
            "$inc": {
                "currentProgress": workout.reps
            }
        }
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

    # Email Validation
    email_pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"

    if not re.match(email_pattern,user.email):
        return {
            "message": "Invalid email"
    }

    # Check Existing User
    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        return {
            "message": "Email already registered"
        }
    
    # Password Validation
    if not validate_password(user.password):
        return {
            "message": "Weak password"
    }


    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")
    
    # Insert User
    result = users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "age": user.age,
        "height": user.height,
        "weight": user.weight,
        "goal": user.goal,
        "workoutGoal":user.workoutGoal,
        "currentProgress":user.currentProgress
    })

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
        user = users_collection.find_one(
            {"email": data.email}
        )

        if not user:
            return {
                "message": "User not found",
                "userId": None
            }

        stored_password = user.get("password")

        if not bcrypt.checkpw(
            data.password.encode("utf-8"),
            stored_password.encode("utf-8")
        ):
            return {
                "message": "Invalid password",
                "userId": None
            }

        return {
            "message": "Login Successful",
            "userId": str(user["_id"])
        }

    except Exception as e:
        print("LOGIN ERROR:", e)

        return {
            "message": "Server error",
            "userId": None
        }

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
    user.pop("password",None)
    return user

# -------------------------------
# Update Profile
# -------------------------------


@app.put("/profile/{user_id}")
def update_profile(user_id: str, profile: dict):

    result = users_collection.update_one(
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

    if result.modified_count:
        return {
            "message": "Profile Updated Successfully"
        }
    
    return {
        "message": "No Changes Made"
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
        "message": "Avatar Updated Successfully",
        "avatar_url": avatar_url
    }



# -------------------------------
# Goal API
# -------------------------------
@app.get("/goal/{user_id}")
def get_goal(user_id:str):

    user = users_collection.find_one(
        {"_id":ObjectId(user_id)}
    )

    if not user:
        return{
            "message":"User not found"
        }
    
    return{
        "workoutGoal":user.get("workoutGoal",100),
        "currentProgress":user.get("currentProgress",0)
    }



class GoalUpdate(BaseModel):
    workoutGoal: int


@app.put("/goal/{user_id}")
def update_goal(
    user_id: str,
    data: GoalUpdate
):

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "workoutGoal": data.workoutGoal
            }
        }
    )

    return {
        "message": "Goal Updated Successfully"
    }


# -------------------------------
# Reset Goal Progress API
# -------------------------------

@app.put("/goal/reset/{user_id}")
def reset_goal(user_id: str):

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "currentProgress": 0
            }
        }
    )

    return {
        "message": "Progress Reset Successfully"
    }
    
@app.get("/bicep/phone/{user_id}")
def start_bicep_curl(user_id: str):
    if not webrtc_receiver.phone_connected:

        raise HTTPException(
            status_code=409,
            detail="Please connect your phone camera first."
        )

    webrtc_receiver.workout_active = True
    webrtc_receiver.current_user_id = user_id

    if (
        webrtc_receiver.display_thread is None
        or
        not webrtc_receiver.display_thread.is_alive()
    ):

        webrtc_receiver.display_thread = threading.Thread(
            target=bicep_loop,
            daemon=True
        )

        webrtc_receiver.display_thread.start()

    return {
        "message": "Bicep Curl Started",
        "exercise": "Bicep Curl"
    }
    
@app.get("/squat/phone/{user_id}")
def start_squat_phone(user_id: str):
    if not webrtc_receiver.phone_connected:

        raise HTTPException(
            status_code=409,
            detail="Please connect your phone camera first."
        )

    webrtc_receiver.workout_active = True
    webrtc_receiver.current_user_id = user_id

    if (
        webrtc_receiver.display_thread is None
        or
        not webrtc_receiver.display_thread.is_alive()
    ):

        webrtc_receiver.display_thread = threading.Thread(
            target=squat_loop,
            daemon=True
        )

        webrtc_receiver.display_thread.start()

    return {
        "message": "Squat Started",
        "exercise": "Squat"
    }
    
@app.get("/pushup/phone/{user_id}")
def start_pushup(user_id: str):
    if not webrtc_receiver.phone_connected:

        raise HTTPException(
            status_code=409,
            detail="Please connect your phone camera first."
        )

    webrtc_receiver.workout_active = True
    webrtc_receiver.current_user_id = user_id

    if (
        webrtc_receiver.display_thread is None
        or
        not webrtc_receiver.display_thread.is_alive()
    ):

        webrtc_receiver.display_thread = threading.Thread(
            target=pushup_loop,
            daemon=True
        )

        webrtc_receiver.display_thread.start()

    return {
        "message": "Pushup Started",
        "exercise": "Pushup"
    }
    
@app.get("/plank/phone/{user_id}")
def start_plank_phone(user_id: str):
    if not webrtc_receiver.phone_connected:

        raise HTTPException(
            status_code=409,
            detail="Please connect your phone camera first."
        )

    webrtc_receiver.workout_active = True
    webrtc_receiver.current_user_id = user_id

    if (
        webrtc_receiver.display_thread is None
        or
        not webrtc_receiver.display_thread.is_alive()
    ):

        webrtc_receiver.display_thread = threading.Thread(
            target=plank_loop,
            daemon=True
        )

        webrtc_receiver.display_thread.start()

    return {
        "message": "Plank Started",
        "exercise": "Plank"
    }
    
@app.get("/jumping-jacks/phone/{user_id}")
def start_jumping_jacks_phone(user_id: str):
    if not webrtc_receiver.phone_connected:

        raise HTTPException(
            status_code=409,
            detail="Please connect your phone camera first."
        )

    webrtc_receiver.workout_active = True
    webrtc_receiver.current_user_id = user_id

    if (
        webrtc_receiver.display_thread is None
        or
        not webrtc_receiver.display_thread.is_alive()
    ):

        webrtc_receiver.display_thread = threading.Thread(
            target=jumping_jacks_loop,
            daemon=True
        )

        webrtc_receiver.display_thread.start()

    return {
        "message": "Jumping Jacks Started",
        "exercise": "Jumping Jacks"
    }

app.mount("/socket.io", socket_app)

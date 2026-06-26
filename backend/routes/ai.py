import threading
import webrtc_receiver
from fastapi import APIRouter, HTTPException
# Processors
from processors.phone.bicep_curl_processor import display_loop as bicep_loop
from processors.phone.squat_processor import display_loop as squat_loop
from processors.phone.pushup_processor import display_loop as pushup_loop
from processors.phone.plank_processor import display_loop as plank_loop
from processors.phone.jumping_jacks_processor import display_loop as jumping_jacks_loop
from processors.webcam.bicep_curl_processor import display_loop as webcam_bicep_loop
from processors.webcam.squat_processor import display_loop as webcam_squat_loop
from processors.webcam.pushup_processor import display_loop as webcam_pushup_loop
from processors.webcam.plank_processor import display_loop as webcam_plank_loop
from processors.webcam.jumping_jacks_processor import display_loop as webcam_jumping_jacks_loop

router = APIRouter()

# -------------------------------
# Exercise Configuration
# -------------------------------

PHONE_PROCESSORS = {
    "pushup": pushup_loop,
    "squat": squat_loop,
    "bicep": bicep_loop,
    "plank": plank_loop,
    "jumping-jacks": jumping_jacks_loop
}

WEBCAM_PROCESSORS = {
    "pushup": webcam_pushup_loop,
    "squat": webcam_squat_loop,
    "bicep": webcam_bicep_loop,
    "plank": webcam_plank_loop,
    "jumping-jacks": webcam_jumping_jacks_loop
}

EXERCISE_NAMES = {
    "pushup": "Pushup",
    "bicep": "Bicep Curl",
    "squat": "Squat",
    "plank": "Plank",
    "jumping-jacks": "Jumping Jacks",
}

# -------------------------------
# Helper Functions
# -------------------------------

def start_workout(user_id: str, processor):

    webrtc_receiver.workout_active = True
    webrtc_receiver.current_user_id = user_id

    if (
        webrtc_receiver.display_thread is None
        or
        not webrtc_receiver.display_thread.is_alive()
    ):

        webrtc_receiver.display_thread = threading.Thread(
            target=processor,
            daemon=True
        )

        webrtc_receiver.display_thread.start()
        
def check_phone_connected():

    if not webrtc_receiver.phone_connected:

        raise HTTPException(
            status_code=409,
            detail="Please connect your phone camera first."
        )
        
# -------------------------------
# Mobile Camera Connection Status
# -------------------------------

@router.get("/camera-status")
def camera_status():

    return {
        "status": (
            "connected"
            if webrtc_receiver.phone_connected
            else "disconnected"
        )
    }
    
# -------------------------------
# AI Exercise Webcam Route
# -------------------------------

@router.get("/{exercise}/webcam/{user_id}")
def start_webcam_workout(exercise: str, user_id: str):

    exercise_name = EXERCISE_NAMES.get(exercise)
    processor = WEBCAM_PROCESSORS.get(exercise)

    if processor is None or exercise_name is None:
        raise HTTPException(
            status_code=404,
            detail="Exercise not found"
        )

    start_workout(user_id, processor)

    return {
        "message": f"{exercise_name} Started",
        "exercise": exercise_name
    }
    
# -------------------------------
# AI Exercise Phone Route
# -------------------------------
    
@router.get("/{exercise}/phone/{user_id}")
def start_phone_workout(exercise: str, user_id: str):

    check_phone_connected()

    exercise_name = EXERCISE_NAMES.get(exercise)
    processor = PHONE_PROCESSORS.get(exercise)

    if processor is None or exercise_name is None:
        raise HTTPException(
            status_code=404,
            detail="Exercise not found"
        )

    start_workout(user_id, processor)

    return {
        "message": f"{exercise_name} Started",
        "exercise": exercise_name
    }
import cv2
import webrtc_receiver
import mediapipe as mp
import numpy as np
import time
import requests
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
BACKEND_URL = os.getenv("BACKEND_URL")

counter = 0
stage = None
feedback = "Show Left Arm"
workout_start_time = None
frame_count = 0
results = None

def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

def display_loop():
    
    global counter
    global stage
    global feedback
    global workout_start_time
    global frame_count
    global results
    
    counter = 0
    stage = None
    feedback = "Show Left Arm"
    workout_start_time = time.time()
    frame_count = 0
    results = None

    window_created = False
    
    mp_pose = mp.solutions.pose

    pose = mp_pose.Pose(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    mp_draw = mp.solutions.drawing_utils

    while True:
        box_width = 360
        box_height = 180

        with webrtc_receiver.frame_lock:
            frame = webrtc_receiver.latest_frame

        if frame is None:
            continue
        
        if not window_created:

            cv2.namedWindow(
                "Workout",
                cv2.WINDOW_NORMAL
            )

            cv2.resizeWindow(
                "Workout",
                1280,
                720
            )

            cv2.setWindowProperty(
                "Workout",
                cv2.WND_PROP_TOPMOST,
                1
            )

            window_created = True
        
        frame = cv2.rotate(
            frame,
            cv2.ROTATE_90_CLOCKWISE
        )
        
        frame = cv2.resize(
            frame,
            (1280, 720)
        )
        
        rgb_frame = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )
        
        frame_count += 1

        if frame_count % 3 == 0:
            results = pose.process(
                rgb_frame
            )
        
        if results and results.pose_landmarks:

            mp_draw.draw_landmarks(
                frame,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS
            )

            landmarks = results.pose_landmarks.landmark

            left_shoulder = landmarks[11]
            left_elbow = landmarks[13]
            left_wrist = landmarks[15]

            if (
                left_shoulder.visibility > 0.7 and
                left_elbow.visibility > 0.7 and
                left_wrist.visibility > 0.7
            ):

                shoulder = [
                    left_shoulder.x,
                    left_shoulder.y
                ]

                elbow = [
                    left_elbow.x,
                    left_elbow.y
                ]

                wrist = [
                    left_wrist.x,
                    left_wrist.y
                ]

                angle = calculate_angle(
                    shoulder,
                    elbow,
                    wrist
                )

                if angle > 120 and stage != "down":
                    stage = "down"

                elif angle < 70 and stage == "down":
                    stage = "up"
                    counter += 1

                if angle > 120:
                    feedback = "Ready"

                elif angle > 70:
                    feedback = "Curl Up"

                else:
                    feedback = "Excellent Rep!"

            else:
                feedback = "Show Left Arm"
            
        # Background
        cv2.rectangle(
            frame,
            (20,20),
            (20 + box_width, 20 + box_height),
            (25,25,25),
            -1
        )

        # Border
        cv2.rectangle(
            frame,
            (20,20),
            (20 + box_width, 20 + box_height),
            (173,255,47),
            2
        )

        cv2.putText(
            frame,
            "SMARTFIT AI",
            (35,55),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (173,255,47),
            2
        )

        cv2.putText(
            frame,
            f"Curls: {counter}",
            (35,115),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.6,
            (173,255,47),
            3
        )
        
        if feedback == "Excellent Rep!":
            feedback_color = (0,255,0)

        elif feedback == "Curl Up":
            feedback_color = (0,255,255)

        else:
            feedback_color = (0,165,255)
            
        cv2.putText(
            frame,
            feedback,
            (35,165),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            feedback_color,
            2
        )
        
        cv2.imshow("Workout", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):

            duration = int(
                time.time() - workout_start_time
            )

            data = {
                "userId": webrtc_receiver.current_user_id,
                "exercise": "Bicep Curl",
                "reps": counter,
                "duration": duration,
                "date": datetime.now().isoformat()
            }

            requests.post(
                f"{BACKEND_URL}/save-workout",
                json=data
            )

            print(
                "Workout Saved Successfully"
            )

            webrtc_receiver.workout_active = False

            cv2.destroyAllWindows()

            return
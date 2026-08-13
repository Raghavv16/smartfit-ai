import cv2
import webrtc_receiver
import mediapipe as mp
import time
import requests
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
BACKEND_URL = os.getenv("BACKEND_URL")

counter = 0
stage = None
feedback = "Ready"
workout_start_time = None
frame_count = 0
results = None

def display_loop():
    
    global counter
    global stage
    global feedback
    global workout_start_time
    global frame_count
    global results
    
    counter = 0
    stage = None
    feedback = "Ready"
    workout_start_time = time.time()
    frame_count = 0
    results = None

    mp_pose = mp.solutions.pose

    pose = mp_pose.Pose(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    mp_draw = mp.solutions.drawing_utils

    while webrtc_receiver.workout_active:
        box_width = 360
        box_height = 180

        with webrtc_receiver.frame_lock:
            frame = webrtc_receiver.latest_frame

        if frame is None:
            continue
        
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

            # LEFT SIDE
            left_shoulder = landmarks[11]
            left_wrist = landmarks[15]
            left_ankle = landmarks[27]

            # RIGHT SIDE
            right_shoulder = landmarks[12]
            right_wrist = landmarks[16]
            right_ankle = landmarks[28]

            # VISIBILITY CHECK
            if (
                left_shoulder.visibility > 0.7 and
                right_shoulder.visibility > 0.7 and
                left_wrist.visibility > 0.7 and
                right_wrist.visibility > 0.7 and
                left_ankle.visibility > 0.7 and
                right_ankle.visibility > 0.7
            ):
                
                # ARMS
                arms_up = (
                    left_wrist.y < left_shoulder.y and
                    right_wrist.y < right_shoulder.y
                )

                arms_down = (
                    left_wrist.y > left_shoulder.y and
                    right_wrist.y > right_shoulder.y
                )

                # LEGS
                ankle_distance = abs(left_ankle.x - right_ankle.x)

                legs_apart = ankle_distance > 0.15
                legs_together = ankle_distance < 0.07

                # FEEDBACK
                if arms_up and not legs_apart:
                    feedback = "Spread Legs More"
                
                elif legs_apart and not arms_up:
                    feedback = "Raise Arms Higher"

                elif arms_up and legs_apart:
                    feedback = "Perfect Rep"

                else:
                    feedback = "Ready"

                # COUNTER LOGIC
                if arms_down and legs_together:
                    stage = "closed"

                elif (
                    arms_up and 
                    legs_apart and 
                    stage == "closed"
                ):
                    counter += 1
                    stage = "open"
                    
            else:
                feedback = "Ready"
                
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
            f"Reps: {counter}",
            (35,115),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.6,
            (173,255,47),
            3
        )
        
        if feedback == "Perfect Rep":
            feedback_color = (0,255,0)

        elif (
            feedback == "Raise Arms Higher"
            or
            feedback == "Spread Legs More"
        ):
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

        with webrtc_receiver.processed_frame_lock:
            webrtc_receiver.processed_frame = frame.copy()
            
    duration = int(
        time.time() - workout_start_time
    )

    data = {
        "userId": webrtc_receiver.current_user_id,
        "exercise": "Jumping Jacks",
        "reps": counter,
        "duration": duration,
        "date": datetime.now().isoformat()
    }

    requests.post(
        f"{BACKEND_URL}/save-workout",
        json=data
    )

    with webrtc_receiver.processed_frame_lock:
        webrtc_receiver.processed_frame = None

    webrtc_receiver.workout_active = False
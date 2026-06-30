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
feedback = "Show Full Body"
workout_start_time = None
frame_count = 0
results = None

def calculate_angle(a, b, c):

    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    radians = np.arctan2(
        c[1] - b[1],
        c[0] - b[0]
    ) - np.arctan2(
        a[1] - b[1],
        a[0] - b[0]
    )

    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180:
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
    feedback = "Show Full Body"
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
            
            # STORE VISIBILITY OF LANDMARKS
            shoulder_vis = landmarks[11].visibility
            elbow_vis = landmarks[13].visibility
            wrist_vis = landmarks[15].visibility
            hip_vis = landmarks[23].visibility
            knee_vis = landmarks[25].visibility
            ankle_vis = landmarks[27].visibility

            # LEFT ARM LANDMARKS
            shoulder = [
                landmarks[11].x,
                landmarks[11].y
            ]

            shoulder_y = landmarks[11].y
            hip_y = landmarks[23].y
            body_horizontal = abs(shoulder_y - hip_y) < 0.20
            
            if not body_horizontal:
                feedback = "Keep Body Straight"

            elbow = [
                landmarks[13].x,
                landmarks[13].y
            ]

            wrist = [
                landmarks[15].x,
                landmarks[15].y
            ]
            
            # CALCULATE ELBOW ANGLE
            if (
                shoulder_vis > 0.7 and 
                elbow_vis > 0.7 and 
                wrist_vis > 0.7 and 
                hip_vis > 0.7 and
                knee_vis > 0.7 and
                ankle_vis > 0.7 and
                body_horizontal
            ):
                
                angle = calculate_angle(
                    shoulder,
                    elbow,
                    wrist
                )

                # PUSHUP LOGIC
                if angle > 105 and stage != "up":
                    stage = "up"
                    feedback = "Go Down"

                elif angle > 85:
                    feedback = "Lower More"

                elif angle < 85:
                    feedback = "Perfect Pushup"

                    if stage == "up":
                        stage = "down"
                        counter += 1
                        
            else:
                feedback = "Show Full Body"
            
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
            f"Pushups: {counter}",
            (35,115),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.6,
            (173,255,47),
            3
        )
        
        if feedback == "Perfect Pushup":
            feedback_color = (0,255,0)

        elif feedback == "Lower More":
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
                "exercise": "Pushup",
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
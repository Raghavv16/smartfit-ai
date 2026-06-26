import cv2
import webrtc_receiver
import mediapipe as mp
import numpy as np
import time
import requests
from datetime import datetime

mp_pose = mp.solutions.pose

pose = mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

mp_draw = mp.solutions.drawing_utils

counter = 0
stage = None
min_angle = 180
feedback = "Show Full Leg"
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
    global min_angle
    global feedback
    global workout_start_time
    global frame_count
    global results
    
    counter = 0
    stage = None
    min_angle = 180
    feedback = "Show Full Leg"
    workout_start_time = time.time()
    frame_count = 0
    results = None

    window_created = False

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
            hip_vis = landmarks[23].visibility
            knee_vis = landmarks[25].visibility
            ankle_vis = landmarks[27].visibility

            # LANDMARKS
            shoulder = [
                landmarks[11].x,
                landmarks[11].y
            ]

            hip = [
                landmarks[23].x,
                landmarks[23].y
            ]

            knee = [
                landmarks[25].x,
                landmarks[25].y
            ]

            ankle = [
                landmarks[27].x,
                landmarks[27].y
            ]

            # CALCULATE KNEE ANGLE
            if (
                hip_vis > 0.7 and
                knee_vis > 0.7 and
                ankle_vis > 0.7
            ):
                knee_angle = calculate_angle(
                    hip,
                    knee,
                    ankle
                )

                hip_angle = calculate_angle(
                    shoulder,
                    hip,
                    knee
                )

                min_angle = min(min_angle, knee_angle)

                # SQUAT LOGIC
                if knee_angle > 165:
                    stage = "up"
                    feedback = "Go Down"

                elif knee_angle > 100:
                    feedback = "Lower More"

                elif knee_angle < 85 and hip_angle < 110:
                    feedback = "Perfect Squat"
                    
                    if stage == "up":
                        if min_angle < 85:
                            stage = "down"
                            counter += 1
                        
                        min_angle = 180
                        
            else:
                feedback = "Show Full Leg"
                
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
            f"Squats: {counter}",
            (35,115),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.6,
            (173,255,47),
            3
        )
        
        if feedback == "Perfect Squat":
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
                "exercise": "Squat",
                "reps": counter,
                "duration": duration,
                "date": datetime.now().isoformat()
            }

            requests.post(
                "http://127.0.0.1:8000/save-workout",
                json=data
            )

            print(
                "Workout Saved Successfully"
            )

            webrtc_receiver.workout_active = False

            cv2.destroyAllWindows()

            return
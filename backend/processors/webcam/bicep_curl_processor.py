import cv2
import mediapipe as mp
import numpy as np
import requests
import time
from datetime import datetime
import webrtc_receiver

mp_pose = mp.solutions.pose

pose = mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)
 
mp_draw = mp.solutions.drawing_utils

# Function to calculate elbow angle 
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
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    
    cv2.namedWindow('Workout', cv2.WINDOW_NORMAL)
    cv2.resizeWindow('Workout', 1280, 720)
    cv2.setWindowProperty("Workout", cv2.WND_PROP_TOPMOST, 1)

    counter = 0
    stage = None
    angle = 0
    start_time = time.time()
    feedback = "Show Left Arm"

    while True:
        success, frame = cap.read()
        
        box_width = 380
        box_height = 180
        
        if not success:
            break

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = pose.process(rgb_frame)

        if results.pose_landmarks:
            mp_draw.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
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

                # REP COUNTING LOGIC
                if angle > 140 and stage != "down":
                    stage = 'down'

                elif angle < 70 and stage == 'down':
                    stage = 'up'
                    counter += 1

                # FEEDBACK LOGIC
                if angle > 140:
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
            (35, 55),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (173,255,47),
            2
        )

        cv2.putText(
            frame, 
            f'REPS: {counter}', 
            (35, 115), 
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
            (35, 165),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            feedback_color,
            2
        )

        cv2.imshow('Workout', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    webrtc_receiver.workout_active = False

    duration = int(time.time() - start_time)

    data = {
        "userId": webrtc_receiver.current_user_id,
        "exercise": "Bicep Curl",
        "reps": counter,
        "duration": duration,
        "date": datetime.now().isoformat()
    }

    requests.post(
        "http://127.0.0.1:8000/save-workout",
        json=data
    )

    return
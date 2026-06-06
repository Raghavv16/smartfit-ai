import cv2
import mediapipe as mp
import numpy as np
import requests
import time
<<<<<<< HEAD
import sys
import os

sys.path.append(
    os.path.abspath("../backend")
)

from database import workouts_collection

user_id = sys.argv[1]
=======
from datetime import datetime
>>>>>>> fe5f0cdf879ee106164b920f8c2366f6363f750a

mp_pose = mp.solutions.pose

pose = mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

mp_draw = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
cv2.namedWindow('Workout', cv2.WINDOW_NORMAL)
cv2.resizeWindow('Workout', 1280, 720)

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

plank_start = None
elapsed_time = 0
status = "NOT HOLDING"

start_time = time.time()

while True:

    success, frame = cap.read()

    if not success:
        break

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = pose.process(rgb_frame)

    if results.pose_landmarks:

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

        elbow = [
            landmarks[13].x,
            landmarks[13].y
        ]

        wrist = [
            landmarks[15].x,
            landmarks[15].y
        ]

        hip = [
            landmarks[23].x,
            landmarks[23].y
        ]

        ankle = [
            landmarks[27].x,
            landmarks[27].y
        ]

        shoulder_y = landmarks[11].y
        hip_y = landmarks[23].y
        body_horizontal = abs(shoulder_y - hip_y) < 0.15

        hip_above_ground = hip_y < landmarks[27].y - 0.05

        elbow_angle = calculate_angle(
            shoulder,
            elbow,
            wrist
        )

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
                hip,
                ankle
            )

            # DISPLAY ANGLE
            cv2.putText(
                frame,
                f"Angle: {int(angle)}",
                (50, 100),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (255, 255, 255),
                2
            )

            # PLANK LOGIC
            if (angle > 150 and
                60 <= elbow_angle <= 140 and
                hip_above_ground):
                
                status = "HOLDING"
                
                if plank_start is None:
                    plank_start = time.time()

                elapsed_time = int(time.time() - plank_start)

            else:
                status = "NOT HOLDING"
                plank_start = None
                elapsed_time = 0

    # DISPLAY PLANK TIMER
    cv2.putText(
        frame,
        f"Time: {elapsed_time}s",
        (50, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    cv2.putText(
        frame,
        f"Status: {status}",
        (50, 100),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 255),
        2
    )

    frame = cv2.resize(frame, (1280, 720))
    cv2.imshow("Workout", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()

duration = elapsed_time

data = {
    "exercise": "Plank",
    "reps": elapsed_time,
    "duration": duration,
    "date": datetime.now().isoformat()
}

requests.post(
    "http://127.0.0.1:8000/save-workout",
    json=data
)

print("Workout Saved")

workouts_collection.insert_one({
    "userId": user_id,
    "exercise": "Plank",
    "reps": 0,
    "duration": timer
})


print("Workout Saved Successfully")
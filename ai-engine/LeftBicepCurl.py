import cv2
import mediapipe as mp
import numpy as np
import requests
import time
import sys
import os
from datetime import datetime

sys.path.append(
    os.path.abspath("../backend")
)

from database import workouts_collection

user_id = sys.argv[1]
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
 
mp_draw = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
cv2.namedWindow('Workout', cv2.WINDOW_NORMAL)
cv2.resizeWindow('Workout', 1280, 720)

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

counter = 0
stage = None

start_time = time.time()
while True:
    success, frame = cap.read()
    
    if not success:
        break

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = pose.process(rgb_frame)

    if results.pose_landmarks:
        mp_draw.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        landmarks = results.pose_landmarks.landmark
        shoulder = [landmarks[11].x, landmarks[11].y]
        elbow = [landmarks[13].x, landmarks[13].y]
        wrist = [landmarks[15].x, landmarks[15].y]

        angle = calculate_angle(shoulder, elbow, wrist)

        if angle > 140:
            stage = 'down'
        if angle < 70 and stage == 'down':
            stage = 'up'
            counter += 1

        # print(angle, stage)

    cv2.putText(frame, f'Reps: {counter}', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    frame = cv2.resize(frame, (1280, 720))
    cv2.imshow('Workout', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

duration = int(time.time() - start_time)

data = {
    "userId": user_id,
    "exercise": "Bicep",
    "reps": counter,
    "duration": duration,
    "date": datetime.now().isoformat()
}

requests.post(
    "http://127.0.0.1:8000/save-workout",
    json=data
)

print("Workout Saved Successfully")
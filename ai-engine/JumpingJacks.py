import cv2
import mediapipe as mp
import requests
import time
from datetime import datetime
import sys
import os


sys.path.append(
    os.path.abspath("../backend")
)

from database import workouts_collection

user_id = sys.argv[1]

print("User ID:", user_id)
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

counter = 0
stage = None
feedback = "Ready"
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

    # DISPLAY
    cv2.putText(
        frame,
        f"Jumping Jacks: {counter}",
        (50, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    cv2.putText(
        frame,
        feedback,
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

duration = int(time.time() - start_time)

data = {
    "exercise": "Jumping Jacks",
    "reps": counter,
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
    "exercise": "Jumping Jacks",
    "reps": counter,
    "duration": duration
})
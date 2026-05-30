import cv2
import mediapipe as mp
import numpy as np
import requests
import time

mp_pose = mp.solutions.pose

pose = mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

mp_draw = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)

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

counter = 0
stage = None

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

        # LEFT LEG LANDMARKS

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

        angle = calculate_angle(
            hip,
            knee,
            ankle
        )

        # SHOW ANGLE

        cv2.putText(
            frame,
            str(int(angle)),
            tuple(np.multiply(knee, [640, 480]).astype(int)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (255, 255, 255),
            2
        )

        # SQUAT LOGIC

        if angle > 160:
            stage = "up"

        if angle < 90 and stage == "up":
            stage = "down"
            counter += 1

    # SHOW REPS

    cv2.putText(
        frame,
        f"Squats: {counter}",
        (50, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    cv2.imshow("Squat Counter", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()

duration = int(time.time() - start_time)

data = {
    "exercise": "Squat",
    "reps": counter,
    "duration": duration
}

requests.post(
    "http://127.0.0.1:8000/save-workout",
    json=data
)

print("Workout Saved")
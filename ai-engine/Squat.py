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

counter = 0
stage = None
min_angle = 180

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

            # SHOW ANGLE
            cv2.putText(
                frame,
                f"K:{int(knee_angle)} H:{int(hip_angle)}",
                tuple(np.multiply(knee, [640, 480]).astype(int)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (255, 255, 255),
                2
            )

            # SQUAT LOGIC
            if knee_angle > 165:
                stage = "up"

            elif knee_angle < 85 and hip_angle < 110 and stage == "up":
                if min_angle < 85:
                    stage = "down"
                    counter += 1
                min_angle = 180

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

    frame = cv2.resize(frame, (1280, 720))
    cv2.imshow("Workout", frame)

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
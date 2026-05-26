import cv2
import mediapipe as mp
import numpy as np

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
 
mp_draw = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)

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

    cv2.imshow('Pose Detection', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
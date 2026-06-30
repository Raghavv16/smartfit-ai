import cv2
import mediapipe as mp
import requests
import time
from datetime import datetime
import os
import webrtc_receiver
from dotenv import load_dotenv

load_dotenv()
BACKEND_URL = os.getenv("BACKEND_URL")

def display_loop():
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    
    cv2.namedWindow('Workout', cv2.WINDOW_NORMAL)
    cv2.resizeWindow('Workout', 1280, 720)
    cv2.setWindowProperty("Workout", cv2.WND_PROP_TOPMOST, 1)

    counter = 0
    stage = None
    feedback = "Ready"
    start_time = time.time()
    
    mp_pose = mp.solutions.pose

    pose = mp_pose.Pose(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    mp_draw = mp.solutions.drawing_utils

    while True:

        success, frame = cap.read()
        
        box_width = 380
        box_height = 180
        
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

        cv2.imshow("Workout", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    webrtc_receiver.workout_active = False

    duration = int(time.time() - start_time)

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

    return
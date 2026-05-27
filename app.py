import streamlit as st
import os
import sys

st.title("AI Fitness Tracker")

exercise = st.selectbox(
    "Choose Exercise",
    ["Left Bicep Curl", "Squat", "Pushup"]
)

st.write(f"Selected Exercise: {exercise}")

if st.button("Start Workout"):

    if exercise == "Left Bicep Curl":
        os.system(f'"{sys.executable}" LeftBicepCurl.py')

    elif exercise == "Squat":
        os.system(f'"{sys.executable}" Squat.py')

    elif exercise == "Pushup":
        os.system(f'"{sys.executable}" Pushup.py')
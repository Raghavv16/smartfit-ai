import streamlit as st
import os

st.title("AI Fitness Tracker")

exercise = st.selectbox("Choose Exercise", ["Left Bicep Curl", "Squat", "Pushup"])

st.write(f"Selected Exercise: {exercise}")

if st.button("Start Workout") and exercise == "Left Bicep Curl":
    os.system("python LeftBicepCurl.py")
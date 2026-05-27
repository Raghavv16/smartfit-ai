import streamlit as st
import os
import sys

st.set_page_config(
    page_title = "SmartFit AI",
    page_icon = "🏋️",
    layout = "wide",
)
st.title("🏋️ SmartFit AI")
st.subheader("🤖 AI Powered Fitness Tracker")
st.write("Select an exercise and click Start Workout")
st.sidebar.title("Smartfit AI")
st.sidebar.write("AI Fitness Tracker")
st.divider()

exercise = st.selectbox(
    "Choose Exercise",
    ["Left Bicep Curls", "Squats", "Pushups"]
)

st.write(f"Selected Exercise: {exercise}")

if exercise == "Left Bicep Curls":
    st.write("Keep left arm visible.")

elif exercise == "Squats":
    st.write("Keep full body visible while squatting")

elif exercise == "Pushups":
    st.write("Perform pushups with left side of your body visible to the camera")

if st.button("Start Workout"):

    st.success(f"{exercise} Started Successfully!")
    st.warning("Press Q to stop the workout")

    if exercise == "Left Bicep Curls":
        os.system(f'"{sys.executable}" LeftBicepCurl.py')

    elif exercise == "Squats":
        os.system(f'"{sys.executable}" Squat.py')

    elif exercise == "Pushups":
        os.system(f'"{sys.executable}" Pushup.py')

st.markdown("---")
st.write("Built using Streamlit, OpenCV and MediaPipe")
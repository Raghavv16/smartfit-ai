import streamlit as st
import os
import sys

st.set_page_config(
    page_title = "SmartFit AI",
    page_icon = "🏋️",
    layout = "wide",
)

st.title("🏋️ SmartFit AI")
st.caption("Track Bicep Curls, Squats and Pushups using Computer Vision and MediaPipe.")

st.subheader("Select an exercise below and let AI track your workout repetitions in real time.")

# SIDEBAR
st.sidebar.title("🏋️ SmartFit AI")
st.sidebar.markdown("---")
st.sidebar.subheader("Supported Exercises")
st.sidebar.write("💪 Left Bicep Curls")
st.sidebar.write("🦵 Squats")
st.sidebar.write("🔥 Pushups")
st.sidebar.markdown("---")
st.sidebar.info("Press Q anytime to stop the workout")

# CONTAINERIZED HERO SECTION
with st.container():
    exercise = st.selectbox(
        "Choose Exercise",
        ["Left Bicep Curls", "Squats", "Pushups"]
    )

    if exercise == "Left Bicep Curls":
        st.info(
            "Keep your left arm clearly visible to the camera and perform controlled curls."
        )

    elif exercise == "Squats":
        st.info(
            "Keep your full body visible and face sideways or slightly angled for best squat tracking."
        )

    elif exercise == "Pushups":
        st.info(
            "Keep the left side of your body visible while performing pushups."
        )

    if st.button("🚀 Start Workout"):

        st.success(f"{exercise} Started Successfully!")
        st.warning("Press Q to stop the workout")

        if exercise == "Left Bicep Curls":
            os.system(f'"{sys.executable}" LeftBicepCurl.py')

        elif exercise == "Squats":
            os.system(f'"{sys.executable}" Squat.py')

        elif exercise == "Pushups":
            os.system(f'"{sys.executable}" Pushup.py')

with st.expander("ℹ️ About SmartFit AI"):
    st.write(
        """
        SmartFit AI uses OpenCV and MediaPipe Pose Detection
        to track exercise movements and count repetitions
        in real time using your webcam.
        """
    )

st.markdown("---")

st.caption(
    "Built with ❤️ using Streamlit • OpenCV • MediaPipe"
)


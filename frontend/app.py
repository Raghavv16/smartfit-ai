import streamlit as st
import requests

st.title("AI Fitness Tracker")

exercise = st.selectbox(
    "Choose Exercise",
    [
        "Left Bicep Curl",
        "Squat",
        "Pushup",
        "Plank"
    ]
)

if st.button("Start Workout"):

    if exercise == "Left Bicep Curl":

        response = requests.get(
            "http://127.0.0.1:8000/bicep"
        )

        st.json(response.json())

    elif exercise == "Squat":

        response = requests.get(
            "http://127.0.0.1:8000/squat"
        )

        st.json(response.json())

    elif exercise == "Pushup":

        response = requests.get(
            "http://127.0.0.1:8000/pushup"
        )

        st.json(response.json())

    elif exercise == "Plank":

        response = requests.get(
            "http://127.0.0.1:8000/plank"
        )

        st.json(response.json())
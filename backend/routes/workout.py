from fastapi import APIRouter
from database import (workouts_collection, users_collection)
from bson import ObjectId
from models import Workout

router = APIRouter()

# -------------------------------
# Database Routes
# -------------------------------

@router.post("/save-workout")
def save_workout(workout: Workout):

    workouts_collection.insert_one(
        workout.dict()
    )

    users_collection.update_one(
        {"_id": ObjectId(workout.userId)},
        {
            "$inc": {
                "currentProgress": workout.reps
            }
        }
    )

    return {
        "message": "Workout Saved Successfully"
    }
    
@router.get("/workouts/{user_id}")
def get_workouts(user_id: str):

    workouts = []

    for workout in workouts_collection.find(
        {"userId": user_id}
    ):
        workout["_id"] = str(workout["_id"])
        workouts.append(workout)

    return workouts
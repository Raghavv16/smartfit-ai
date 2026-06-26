from fastapi import APIRouter
from database import users_collection
from bson import ObjectId
from models import GoalUpdate

router = APIRouter()

# -------------------------------
# Goal API
# -------------------------------

@router.get("/goal/{user_id}")
def get_goal(user_id:str):

    user = users_collection.find_one(
        {"_id":ObjectId(user_id)}
    )

    if not user:
        return{
            "message":"User not found"
        }
    
    return{
        "workoutGoal":user.get("workoutGoal",100),
        "currentProgress":user.get("currentProgress",0)
    }
    
@router.put("/goal/{user_id}")
def update_goal(
    user_id: str,
    data: GoalUpdate
):

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "workoutGoal": data.workoutGoal
            }
        }
    )

    return {
        "message": "Goal Updated Successfully"
    }
    
# -------------------------------
# Reset Goal Progress API
# -------------------------------

@router.put("/goal/reset/{user_id}")
def reset_goal(user_id: str):

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "currentProgress": 0
            }
        }
    )

    return {
        "message": "Progress Reset Successfully"
    }
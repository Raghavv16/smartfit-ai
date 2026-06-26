from fastapi import APIRouter, UploadFile, File
from database import users_collection
from bson import ObjectId
from bson.errors import InvalidId
import cloudinary.uploader

router = APIRouter()

# -------------------------------
# Get User Profile
# -------------------------------

@router.get("/profile/{user_id}")
def get_profile(user_id: str):

    try:
        user = users_collection.find_one(
            {"_id": ObjectId(user_id)}
        )
    except InvalidId:
        return {"message": "Invalid user id"}

    if not user:
        return {"message": "User not found"}

    user["_id"] = str(user["_id"])
    user.pop("password",None)
    return user

# -------------------------------
# Update Profile
# -------------------------------

@router.put("/profile/{user_id}")
def update_profile(user_id: str, profile: dict):

    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "name": profile["name"],
                "age": profile["age"],
                "height": profile["height"],
                "weight": profile["weight"],
                "goal": profile["goal"]
            }
        }
    )

    if result.modified_count:
        return {
            "message": "Profile Updated Successfully"
        }
    
    return {
        "message": "No Changes Made"
    }
    
# -------------------------------
# Update Avatar
# -------------------------------
    
@router.post("/upload-avatar/{user_id}")
async def upload_avatar(user_id: str, file: UploadFile = File(...)):

    result = cloudinary.uploader.upload(file.file)

    avatar_url = result["secure_url"]

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "avatar": avatar_url
            }
        }
    )

    return {
        "message": "Avatar Updated Successfully",
        "avatar_url": avatar_url
    }
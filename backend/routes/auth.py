from fastapi import APIRouter
import bcrypt
import re
from database import users_collection
from models import User, Login
from utils.validators import validate_password

router = APIRouter()

# -------------------------------
# Sign Up Route
# -------------------------------

@router.post("/signup")
def signup(user: User):

    # Email Validation
    email_pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"

    if not re.match(email_pattern,user.email):
        return {
            "message": "Invalid email"
    }

    # Check Existing User
    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        return {
            "message": "Email already registered"
        }
    
    # Password Validation
    if not validate_password(user.password):
        return {
            "message": "Weak password"
    }


    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")
    
    # Insert User
    result = users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "age": user.age,
        "height": user.height,
        "weight": user.weight,
        "goal": user.goal,
        "workoutGoal":user.workoutGoal,
        "currentProgress":user.currentProgress
    })

    return {
        "message": "Signup Successful",
        "userId": str(result.inserted_id)
    }
    
# -------------------------------
# Login Route
# -------------------------------

@router.post("/login")
def login(data: Login):

    try:
        user = users_collection.find_one(
            {"email": data.email}
        )

        if not user:
            return {
                "message": "User not found",
                "userId": None
            }

        stored_password = user.get("password")

        if not bcrypt.checkpw(
            data.password.encode("utf-8"),
            stored_password.encode("utf-8")
        ):
            return {
                "message": "Invalid password",
                "userId": None
            }

        return {
            "message": "Login Successful",
            "userId": str(user["_id"])
        }

    except Exception as e:
        print("LOGIN ERROR:", e)

        return {
            "message": "Server error",
            "userId": None
        }
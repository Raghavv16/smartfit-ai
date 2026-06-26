from pydantic import BaseModel

# Workout Model
class Workout(BaseModel):
    userId: str
    exercise: str
    reps: int
    duration: int
    date: str

# User Model 
class User(BaseModel):
    name: str
    email: str
    password: str
    age: int
    height: float
    weight: float
    goal: str
    workoutGoal: int = 100
    currentProgress: int = 0

# Login Model
class Login(BaseModel):
    email: str
    password: str

# Goal Update Model
class GoalUpdate(BaseModel):
    workoutGoal: int
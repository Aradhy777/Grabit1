from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
import models, auth, database
import secrets
from datetime import datetime, timedelta
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connect to MongoDB
    await database.connect_db()
    yield
    # Shutdown: close MongoDB connection
    await database.close_db()

app = FastAPI(title="GrabitAI Auth Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str  # student or teacher

class UserLogin(BaseModel):
    email: str
    password: str

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetConfirm(BaseModel):
    email: str
    otp: str
    new_password: str

@app.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    db = database.get_db()
    existing = await db["users"].find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = auth.hash_password(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_pwd,
        "role": user.role,
    }
    result = await db["users"].insert_one(new_user)
    return {"message": "User created successfully", "user_id": str(result.inserted_id)}

@app.post("/login")
async def login(user_credentials: UserLogin):
    db = database.get_db()
    user = await db["users"].find_one({"email": user_credentials.email})

    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")

    if not auth.verify_password(user_credentials.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")

    access_token = auth.create_access_token(
        data={
            "sub": user["email"],
            "role": user["role"],
            "name": user.get("name", ""),
        },
        expires_delta=auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": access_token, "token_type": "bearer"}

# Protected Routes
@app.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest):
    db = database.get_db()
    user = await db["users"].find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
        
    otp = "".join([str(secrets.randbelow(10)) for _ in range(6)])
    expiry = datetime.utcnow() + timedelta(minutes=15)
    
    await db["users"].update_one(
        {"email": request.email}, 
        {"$set": {"reset_otp": otp, "reset_otp_expiry": expiry}}
    )
    
    # In a real app, send an email here. For dev, we return it.
    return {"message": "Reset code generated", "dev_otp": otp}

@app.post("/reset-password")
async def reset_password(request: PasswordResetConfirm):
    db = database.get_db()
    user = await db["users"].find_one({"email": request.email})
    
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
        
    if "reset_otp" not in user or user["reset_otp"] != request.otp:
        raise HTTPException(status_code=400, detail="Invalid reset code")
        
    if datetime.utcnow() > user["reset_otp_expiry"]:
        raise HTTPException(status_code=400, detail="Reset code has expired")
        
    hashed_pwd = auth.hash_password(request.new_password)
    
    await db["users"].update_one(
        {"email": request.email},
        {
            "$set": {"password": hashed_pwd},
            "$unset": {"reset_otp": "", "reset_otp_expiry": ""}
        }
    )
    
    return {"message": "Password updated successfully"}

@app.get("/teacher/dashboard")
def teacher_dashboard(current_user: dict = Depends(auth.check_role("teacher"))):
    return {
        "message": f"Welcome Teacher {current_user['email']}",
        "stats": {"lectures_delivered": 12, "active_students": 45}
    }

@app.get("/student/dashboard")
def student_dashboard(current_user: dict = Depends(auth.check_role("student"))):
    return {
        "message": f"Welcome Student {current_user['email']}",
        "stats": {"lectures_attended": 8, "quizzes_completed": 3}
    }

@app.get("/")
def home():
    return {"message": "GrabitAI Auth Service is Live"}

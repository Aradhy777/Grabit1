from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "student"  # "student" or "teacher"

class UserInDB(BaseModel):
    name: str
    email: str
    hashed_password: str
    role: str = "student"

class UserOut(BaseModel):
    name: str
    email: str
    role: str

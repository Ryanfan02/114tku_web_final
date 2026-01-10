from fastapi import APIRouter, HTTPException
from app.db import db
from app.models.user import RegisterBody, LoginBody, AuthResponse
from app.security import hash_password, verify_password, create_access_token
import time

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=AuthResponse)
async def register(body: RegisterBody):
    if body.password != body.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = await db.users.find_one({"username": body.username})
    if existing:
        raise HTTPException(status_code=409, detail="Username already exists")

    hashed = hash_password(body.password)

    doc = {
        "username": body.username,
        "password_hash": hashed,
        "createdAt": int(time.time() * 1000),
    }

    result = await db.users.insert_one(doc)

    token = create_access_token({
        "user_id": str(result.inserted_id),
        "username": body.username,
        "isGuest": False,
    })
    return AuthResponse(token=token, username=body.username, isGuest=False)

@router.post("/login", response_model=AuthResponse)
async def login(body: LoginBody):
    user = await db.users.find_one({"username": body.username})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    ok = verify_password(body.password, user.get("password_hash", ""))
    if not ok:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({
        "user_id": str(user["_id"]),
        "username": body.username,
        "isGuest": False,
    })
    return AuthResponse(token=token, username=body.username, isGuest=False)

@router.post("/guest", response_model=AuthResponse)
async def guest_login():
    # 不寫入 users，不落庫，只給前端一個 token 表示訪客身分
    token = create_access_token({
        "user_id": "guest",
        "username": "guest",
        "isGuest": True,
    })
    return AuthResponse(token=token, username="guest", isGuest=True)

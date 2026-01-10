from fastapi import Header, HTTPException
from app.security import decode_token

async def get_current_user(authorization: str = Header(default="")) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    parts = authorization.split(" ")
    if len(parts) != 2:
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    scheme = parts[0]
    token = parts[1]

    if scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid auth scheme")

    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("user_id")
    username = payload.get("username")
    is_guest = bool(payload.get("isGuest", False))

    if not user_id or not username:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    return {"user_id": user_id, "username": username, "isGuest": is_guest}

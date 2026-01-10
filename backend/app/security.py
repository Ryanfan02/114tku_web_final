from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def create_access_token(payload: dict) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)

    to_encode = {}
    for k in payload:
        to_encode[k] = payload[k]
    to_encode["exp"] = expire

    token = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=ALGORITHM)
    return token


def decode_token(token: str) -> dict:
    try:
        data = jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
        return data
    except JWTError:
        return {}

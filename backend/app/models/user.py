from pydantic import BaseModel, Field

class RegisterBody(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=6, max_length=200)
    confirmPassword: str = Field(min_length=6, max_length=200)

class LoginBody(BaseModel):
    username: str
    password: str

class AuthResponse(BaseModel):
    token: str
    username: str
    isGuest: bool = False

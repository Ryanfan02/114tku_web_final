from pydantic import BaseModel, Field
from typing import Optional

class EventCreateBody(BaseModel):
    dateISO: str = Field(min_length=10, max_length=10)  # YYYY-MM-DD
    title: str = Field(min_length=1, max_length=120)
    note: str = Field(default="", max_length=1000)

class EventUpdateBody(BaseModel):
    # 允許部分更新，所以全部都 Optional
    dateISO: Optional[str] = Field(default=None, min_length=10, max_length=10)
    title: Optional[str] = Field(default=None, min_length=1, max_length=120)
    note: Optional[str] = Field(default=None, max_length=1000)
    done: Optional[bool] = None

class EventOut(BaseModel):
    id: str
    dateISO: str
    title: str
    note: str
    done: bool
    createdAt: int

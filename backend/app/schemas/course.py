# filepath: backend/app/schemas/course.py
from pydantic import BaseModel

class Course(BaseModel):
    id: int
    name: str
    description: str

    class Config:
        orm_mode = True
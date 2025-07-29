from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class StudentBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    address: str
    date_of_birth: date
    gender: str

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: int
    student_id: str
    enrollment_date: date
    
    class Config:
        orm_mode = True
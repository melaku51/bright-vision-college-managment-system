from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    address = Column(String)
    date_of_birth = Column(Date)
    gender = Column(String)
    enrollment_date = Column(Date)
    
    payments = relationship("Payment", back_populates="student")
    courses = relationship("CourseEnrollment", back_populates="student")
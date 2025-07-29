from sqlalchemy import Column, Integer, String, ForeignKey, Float, Date
import datetime
from sqlalchemy.orm import relationship
from ..database import Base

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True)
    name = Column(String)
    description = Column(String)
    fee = Column(Float)
    duration = Column(String)  # e.g., "3 months"

class CourseEnrollment(Base):
    __tablename__ = "course_enrollments"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    enrollment_date = datetime.date.today()
    completion_date = Column(Date, nullable=True)
    status = Column(String)  # "active", "completed", "dropped"
    
    student = relationship("Student", back_populates="courses")
    course = relationship("Course")
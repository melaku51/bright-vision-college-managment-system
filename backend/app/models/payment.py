from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    amount = Column(Float)
    payment_date = Column(Date)
    payment_method = Column(String)
    transaction_id = Column(String, unique=True)
    status = Column(String)  # "pending", "completed", "failed"
    description = Column(String)
    
    student = relationship("Student", back_populates="payments")
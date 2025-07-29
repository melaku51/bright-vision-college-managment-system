from pydantic import BaseModel
from datetime import date
from typing import Optional

class PaymentBase(BaseModel):
    amount: float
    payment_date: date
    payment_method: str
    description: Optional[str] = None

class PaymentCreate(PaymentBase):
    student_id: int

class Payment(PaymentBase):
    id: int
    transaction_id: str
    status: str
    
    class Config:
        orm_mode = True
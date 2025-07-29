from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models
from ..database import get_db
import uuid
from datetime import date

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/", response_model=schemas.Payment)
def create_payment(payment: schemas.PaymentCreate, db: Session = Depends(get_db)):
    # Verify student exists
    db_student = db.query(models.Student).filter(models.Student.id == payment.student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Generate transaction ID
    transaction_id = str(uuid.uuid4())
    
    db_payment = models.Payment(
        **payment.dict(),
        transaction_id=transaction_id,
        status="completed"  # You might want to implement payment processing logic
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.get("/student/{student_id}", response_model=List[schemas.Payment])
def read_student_payments(student_id: str, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    payments = db.query(models.Payment).filter(models.Payment.student_id == student.id).all()
    return payments
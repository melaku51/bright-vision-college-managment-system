from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routes import student, payment, course
from .routes import auth
# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Bright Vision College API",
    description="Student Registration and Payment System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(student.router)
app.include_router(payment.router)
app.include_router(course.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Bright Vision College API"}
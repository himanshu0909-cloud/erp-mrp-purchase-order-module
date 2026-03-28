from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/vendors")
def create_vendor(name: str, contact: str, rating: float, db: Session = Depends(get_db)):
    vendor = models.Vendor(name=name, contact=contact, rating=rating)
    db.add(vendor)
    db.commit()
    db.refresh(vendor)
    return vendor

@router.get("/vendors")
def get_vendors(db: Session = Depends(get_db)):
    return db.query(models.Vendor).all()
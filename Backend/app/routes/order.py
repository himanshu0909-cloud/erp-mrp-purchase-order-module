from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create-order")
def create_order(order: schemas.PurchaseOrderCreate, db: Session = Depends(get_db)):
    return crud.create_purchase_order(db, order)
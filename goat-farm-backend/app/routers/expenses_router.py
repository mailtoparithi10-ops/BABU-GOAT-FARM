from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..models import Expense, Goat
from ..schemas import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from ..dependencies import get_db, admin_required

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db), current_user = Depends(admin_required)):
    if expense.related_goat_id:
        goat = db.query(Goat).filter(Goat.id == expense.related_goat_id).first()
        if not goat:
            raise HTTPException(status_code=404, detail="Related goat not found")
            
    db_exp = Expense(**expense.model_dump())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(admin_required)):
    return db.query(Expense).offset(skip).limit(limit).all()

@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(expense_id: int, db: Session = Depends(get_db), current_user = Depends(admin_required)):
    exp = db.query(Expense).filter(Expense.id == expense_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Expense not found")
    return exp

@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, exp_update: ExpenseUpdate, db: Session = Depends(get_db), current_user = Depends(admin_required)):
    db_exp = db.query(Expense).filter(Expense.id == expense_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Expense not found")
        
    update_data = exp_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_exp, key, value)
        
    db.commit()
    db.refresh(db_exp)
    return db_exp

@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int, db: Session = Depends(get_db), current_user = Depends(admin_required)):
    db_exp = db.query(Expense).filter(Expense.id == expense_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(db_exp)
    db.commit()

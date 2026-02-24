from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from ..models import Sale, Goat, Expense
from ..schemas import SaleCreate, SaleUpdate, SaleResponse
from ..dependencies import get_db, admin_required

router = APIRouter(prefix="/sales", tags=["Sales"])

@router.post("/", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db), current_user = Depends(admin_required)):
    # 1. Verification of Goat
    goat = db.query(Goat).filter(Goat.id == sale.goat_id).first()
    if not goat:
        raise HTTPException(status_code=404, detail="Goat not found")
    if goat.current_status == "sold":
        raise HTTPException(status_code=400, detail="Goat is already sold")
    if goat.current_status == "dead":
        raise HTTPException(status_code=400, detail="Cannot sell a dead goat")
        
    # 2. Calculate Profit
    purchase_cost = goat.purchase_cost or 0.0
    
    # Calculate total related expenses for this specific goat
    related_expenses_sum = db.query(func.sum(Expense.amount)).filter(Expense.related_goat_id == goat.id).scalar() or 0.0
    
    # profit = sale_price - (purchase_cost + related_expenses)
    profit = sale.sale_price - (purchase_cost + related_expenses_sum)
    
    db_sale = Sale(**sale.model_dump(), profit=profit)
    db.add(db_sale)
    
    # 3. Update the Goat status
    goat.current_status = "sold"
    if sale.sale_weight:
        goat.sale_weight = sale.sale_weight

    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.get("/", response_model=List[SaleResponse])
def get_sales(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(admin_required)):
    return db.query(Sale).offset(skip).limit(limit).all()

@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(sale_id: int, db: Session = Depends(get_db), current_user = Depends(admin_required)):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

@router.put("/{sale_id}", response_model=SaleResponse)
def update_sale(sale_id: int, sale_update: SaleUpdate, db: Session = Depends(get_db), current_user = Depends(admin_required)):
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Sale not found")
        
    update_data = sale_update.model_dump(exclude_unset=True)
    
    prev_sale_price = db_sale.sale_price
    
    for key, value in update_data.items():
        setattr(db_sale, key, value)
        
    # Re-calculate profit if price changed
    if 'sale_price' in update_data and update_data['sale_price'] != prev_sale_price:
        goat = db.query(Goat).filter(Goat.id == db_sale.goat_id).first()
        purchase_cost = goat.purchase_cost or 0.0
        related_expenses_sum = db.query(func.sum(Expense.amount)).filter(Expense.related_goat_id == goat.id).scalar() or 0.0
        db_sale.profit = db_sale.sale_price - (purchase_cost + related_expenses_sum)

    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.delete("/{sale_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sale(sale_id: int, db: Session = Depends(get_db), current_user = Depends(admin_required)):
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Sale not found")
        
    # Revert Goat status back to active
    goat = db.query(Goat).filter(Goat.id == db_sale.goat_id).first()
    if goat:
        goat.current_status = "active"
        
    db.delete(db_sale)
    db.commit()

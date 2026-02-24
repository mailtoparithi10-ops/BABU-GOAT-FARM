from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..models import Goat, Vaccination
from ..schemas import GoatCreate, GoatUpdate, GoatResponse, VaccinationCreate, VaccinationUpdate, VaccinationResponse
from ..dependencies import get_db, get_current_user, admin_required

router = APIRouter(prefix="/goats", tags=["Goats"])

# --- GOAT ROUTES ---

@router.post("/", response_model=GoatResponse, status_code=status.HTTP_201_CREATED)
def create_goat(goat: GoatCreate, db: Session = Depends(get_db), current_user = Depends(admin_required)):
    existing = db.query(Goat).filter(Goat.tag_number == goat.tag_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tag number already exists")
    db_goat = Goat(**goat.model_dump())
    db.add(db_goat)
    db.commit()
    db.refresh(db_goat)
    return db_goat

@router.get("/", response_model=List[GoatResponse])
def get_goats(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Goat).all()

@router.get("/{goat_id}", response_model=GoatResponse)
def get_goat(goat_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    goat = db.query(Goat).filter(Goat.id == goat_id).first()
    if not goat:
        raise HTTPException(status_code=404, detail="Goat not found")
    return goat

@router.put("/{goat_id}", response_model=GoatResponse)
def update_goat(goat_id: int, goat_update: GoatUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Workers can update goats (e.g. weight, health notes)
    # If more granular permissions are needed inside an update, they should be added here
    db_goat = db.query(Goat).filter(Goat.id == goat_id).first()
    if not db_goat:
        raise HTTPException(status_code=404, detail="Goat not found")
    
    update_data = goat_update.model_dump(exclude_unset=True)
    
    # Optional logic: restrict some fields from workers
    
    for key, value in update_data.items():
        setattr(db_goat, key, value)
        
    db.commit()
    db.refresh(db_goat)
    return db_goat

@router.delete("/{goat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goat(goat_id: int, db: Session = Depends(get_db), current_user = Depends(admin_required)):
    db_goat = db.query(Goat).filter(Goat.id == goat_id).first()
    if not db_goat:
        raise HTTPException(status_code=404, detail="Goat not found")
    db.delete(db_goat)
    db.commit()

# --- VACCINATION ROUTES (Inside Goats Router for logically grouped domain) ---

@router.post("/{goat_id}/vaccinations", response_model=VaccinationResponse, status_code=status.HTTP_201_CREATED)
def add_vaccination(goat_id: int, vac: VaccinationCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if vac.goat_id != goat_id:
        raise HTTPException(status_code=400, detail="Path ID and Body ID mismatch")
    
    goat = db.query(Goat).filter(Goat.id == goat_id).first()
    if not goat:
        raise HTTPException(status_code=404, detail="Goat not found")

    db_vac = Vaccination(**vac.model_dump())
    db.add(db_vac)
    
    # Auto-update goat's last vaccination status
    goat.vaccination_status = "Vaccinated"
    goat.last_vaccination_date = vac.date_given
    
    db.commit()
    db.refresh(db_vac)
    return db_vac

@router.get("/{goat_id}/vaccinations", response_model=List[VaccinationResponse])
def get_goat_vaccinations(goat_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Vaccination).filter(Vaccination.goat_id == goat_id).all()
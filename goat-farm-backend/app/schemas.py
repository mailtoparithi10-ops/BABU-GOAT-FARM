from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List

# -------- USER -------- #
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool

    class Config:
        from_attributes = True

# -------- GOAT -------- #
class GoatBase(BaseModel):
    tag_number: str
    name: Optional[str] = None
    breed: Optional[str] = None
    gender: Optional[str] = None
    color: Optional[str] = None
    date_of_birth: Optional[date] = None
    weight: Optional[float] = None
    purchase_date: Optional[date] = None
    purchase_cost: Optional[float] = None
    source: Optional[str] = None
    mother_id: Optional[int] = None
    father_id: Optional[int] = None
    health_status: Optional[str] = None
    vaccination_status: Optional[str] = None
    last_vaccination_date: Optional[date] = None
    pregnancy_status: Optional[str] = None
    expected_delivery_date: Optional[date] = None
    current_status: Optional[str] = "active"
    sale_weight: Optional[float] = None
    notes: Optional[str] = None

class GoatCreate(GoatBase):
    pass

class GoatUpdate(GoatBase):
    tag_number: Optional[str] = None

class GoatResponse(GoatBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# -------- VACCINATION -------- #
class VaccinationBase(BaseModel):
    goat_id: int
    vaccine_name: str
    dose: Optional[str] = None
    date_given: date
    next_due_date: Optional[date] = None
    vet_name: Optional[str] = None
    notes: Optional[str] = None

class VaccinationCreate(VaccinationBase):
    pass

class VaccinationUpdate(VaccinationBase):
    goat_id: Optional[int] = None
    vaccine_name: Optional[str] = None
    date_given: Optional[date] = None

class VaccinationResponse(VaccinationBase):
    id: int

    class Config:
        from_attributes = True

# -------- INVENTORY -------- #
class InventoryBase(BaseModel):
    item_name: str
    category: str
    quantity: float
    unit: str
    cost_per_unit: float
    total_cost: float
    supplier: Optional[str] = None
    purchase_date: Optional[date] = None
    low_stock_threshold: Optional[float] = None

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(InventoryBase):
    item_name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    cost_per_unit: Optional[float] = None
    total_cost: Optional[float] = None

class InventoryResponse(InventoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# -------- EXPENSE -------- #
class ExpenseBase(BaseModel):
    category: str
    amount: float
    date: date
    payment_method: Optional[str] = None
    description: Optional[str] = None
    related_goat_id: Optional[int] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(ExpenseBase):
    category: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[date] = None

class ExpenseResponse(ExpenseBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# -------- SALE -------- #
class SaleBase(BaseModel):
    goat_id: int
    buyer_name: str
    buyer_phone: Optional[str] = None
    sale_price: float
    sale_weight: Optional[float] = None
    price_per_kg: Optional[float] = None
    sale_date: date
    payment_status: Optional[str] = None

class SaleCreate(SaleBase):
    pass

class SaleUpdate(SaleBase):
    goat_id: Optional[int] = None
    buyer_name: Optional[str] = None
    sale_price: Optional[float] = None
    sale_date: Optional[date] = None

class SaleResponse(SaleBase):
    id: int
    profit: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True

# -------- DASHBOARD -------- #
class DashboardSummary(BaseModel):
    total_goats: int
    active_goats: int
    pregnant_goats: int
    vaccination_due_count: int
    low_inventory_count: int
    monthly_expense_total: float
    monthly_revenue_total: float
    net_profit: float
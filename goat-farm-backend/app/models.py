from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # admin / worker
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Goat(Base):
    __tablename__ = "goats"

    id = Column(Integer, primary_key=True, index=True)
    tag_number = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    breed = Column(String)
    gender = Column(String)
    color = Column(String)
    date_of_birth = Column(Date)
    weight = Column(Float)
    purchase_date = Column(Date)
    purchase_cost = Column(Float)
    source = Column(String)
    mother_id = Column(Integer, ForeignKey("goats.id"))
    father_id = Column(Integer, ForeignKey("goats.id"))
    health_status = Column(String)
    vaccination_status = Column(String)
    last_vaccination_date = Column(Date)
    pregnancy_status = Column(String)
    expected_delivery_date = Column(Date)
    current_status = Column(String, default="active") # active, sold, dead
    sale_weight = Column(Float)
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    mother = relationship("Goat", remote_side=[id], foreign_keys=[mother_id])
    father = relationship("Goat", remote_side=[id], foreign_keys=[father_id])
    vaccinations = relationship("Vaccination", back_populates="goat")
    sales = relationship("Sale", back_populates="goat")
    expenses = relationship("Expense", back_populates="goat")


class Vaccination(Base):
    __tablename__ = "vaccinations"

    id = Column(Integer, primary_key=True, index=True)
    goat_id = Column(Integer, ForeignKey("goats.id"), nullable=False)
    vaccine_name = Column(String, nullable=False)
    dose = Column(String)
    date_given = Column(Date, nullable=False)
    next_due_date = Column(Date)
    vet_name = Column(String)
    notes = Column(String)

    goat = relationship("Goat", back_populates="vaccinations")


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, nullable=False)
    category = Column(String, nullable=False) # feed / medicine / equipment / supplement
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    cost_per_unit = Column(Float, nullable=False)
    total_cost = Column(Float, nullable=False)
    supplier = Column(String)
    purchase_date = Column(Date)
    low_stock_threshold = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False) # feed / veterinary / labor / transport / electricity / misc
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    payment_method = Column(String)
    description = Column(String)
    related_goat_id = Column(Integer, ForeignKey("goats.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    goat = relationship("Goat", back_populates="expenses")


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    goat_id = Column(Integer, ForeignKey("goats.id"), nullable=False, unique=True)
    buyer_name = Column(String, nullable=False)
    buyer_phone = Column(String)
    sale_price = Column(Float, nullable=False)
    sale_weight = Column(Float)
    price_per_kg = Column(Float)
    sale_date = Column(Date, nullable=False)
    payment_status = Column(String)
    profit = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    goat = relationship("Goat", back_populates="sales")

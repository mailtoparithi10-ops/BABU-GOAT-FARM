from database import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Goat(db.Model):
    __tablename__ = "goats"
    
    id = db.Column(db.Integer, primary_key=True)
    tag_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100))
    breed = db.Column(db.String(50))
    gender = db.Column(db.String(10))
    color = db.Column(db.String(50))
    date_of_birth = db.Column(db.Date)
    weight = db.Column(db.Float)
    purchase_date = db.Column(db.Date)
    purchase_cost = db.Column(db.Float)
    source = db.Column(db.String(100))
    mother_id = db.Column(db.Integer, db.ForeignKey('goats.id'))
    father_id = db.Column(db.Integer, db.ForeignKey('goats.id'))
    health_status = db.Column(db.String(50))
    vaccination_status = db.Column(db.String(50))
    last_vaccination_date = db.Column(db.Date)
    pregnancy_status = db.Column(db.String(50))
    expected_delivery_date = db.Column(db.Date)
    current_status = db.Column(db.String(20), default='active')
    sale_weight = db.Column(db.Float)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    vaccinations = db.relationship('Vaccination', backref='goat', lazy=True)
    sales = db.relationship('Sale', backref='goat', lazy=True)
    expenses = db.relationship('Expense', backref='goat', lazy=True)

class Vaccination(db.Model):
    __tablename__ = "vaccinations"
    
    id = db.Column(db.Integer, primary_key=True)
    goat_id = db.Column(db.Integer, db.ForeignKey('goats.id'), nullable=False)
    vaccine_name = db.Column(db.String(100), nullable=False)
    dose = db.Column(db.String(50))
    date_given = db.Column(db.Date, nullable=False)
    next_due_date = db.Column(db.Date)
    vet_name = db.Column(db.String(100))
    notes = db.Column(db.Text)

class Inventory(db.Model):
    __tablename__ = "inventory"
    
    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), nullable=False)
    cost_per_unit = db.Column(db.Float, nullable=False)
    total_cost = db.Column(db.Float, nullable=False)
    supplier = db.Column(db.String(100))
    purchase_date = db.Column(db.Date)
    low_stock_threshold = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Expense(db.Model):
    __tablename__ = "expenses"
    
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    payment_method = db.Column(db.String(50))
    description = db.Column(db.Text)
    related_goat_id = db.Column(db.Integer, db.ForeignKey('goats.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Sale(db.Model):
    __tablename__ = "sales"
    
    id = db.Column(db.Integer, primary_key=True)
    goat_id = db.Column(db.Integer, db.ForeignKey('goats.id'), nullable=False, unique=True)
    buyer_name = db.Column(db.String(100), nullable=False)
    buyer_phone = db.Column(db.String(20))
    sale_price = db.Column(db.Float, nullable=False)
    sale_weight = db.Column(db.Float)
    price_per_kg = db.Column(db.Float)
    sale_date = db.Column(db.Date, nullable=False)
    payment_status = db.Column(db.String(20))
    profit = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

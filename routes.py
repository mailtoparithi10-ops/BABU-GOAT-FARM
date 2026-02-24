from flask import Blueprint, request, jsonify
from database import db
from models import User, Goat, Inventory, Expense, Sale
from auth import hash_password, verify_password, create_access_token, token_required, admin_required
from datetime import datetime, date
from sqlalchemy import func, extract

# Create blueprints
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
goats_bp = Blueprint('goats', __name__, url_prefix='/goats')
inventory_bp = Blueprint('inventory', __name__, url_prefix='/inventory')
expenses_bp = Blueprint('expenses', __name__, url_prefix='/expenses')
sales_bp = Blueprint('sales', __name__, url_prefix='/sales')
dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/dashboard')

# ============ AUTH ROUTES ============
@auth_bp.route('/register', methods=['POST'])
@admin_required
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    
    user = User(
        name=data['name'],
        email=data['email'],
        password_hash=hash_password(data['password']),
        role=data['role']
    )
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not verify_password(data['password'], user.password_hash):
        return jsonify({"error": "Invalid credentials"}), 400
    
    if not user.is_active:
        return jsonify({"error": "Inactive user"}), 400
    
    token = create_access_token({"id": user.id, "role": user.role})
    return jsonify({"access_token": token, "token_type": "bearer"})

# ============ GOATS ROUTES ============
@goats_bp.route('', methods=['GET'])
@token_required
def get_goats():
    goats = Goat.query.all()
    return jsonify([{
        "id": g.id,
        "tag_number": g.tag_number,
        "name": g.name,
        "breed": g.breed,
        "gender": g.gender,
        "weight": g.weight,
        "current_status": g.current_status,
        "health_status": g.health_status
    } for g in goats])

@goats_bp.route('', methods=['POST'])
@token_required
def create_goat():
    data = request.get_json()
    
    if Goat.query.filter_by(tag_number=data['tag_number']).first():
        return jsonify({"error": "Tag number already exists"}), 400
    
    goat = Goat(**{k: v for k, v in data.items() if hasattr(Goat, k)})
    db.session.add(goat)
    db.session.commit()
    
    return jsonify({"id": goat.id, "message": "Goat created"}), 201

@goats_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_goat(id):
    goat = Goat.query.get_or_404(id)
    data = request.get_json()
    
    for key, value in data.items():
        if hasattr(goat, key):
            setattr(goat, key, value)
    
    db.session.commit()
    return jsonify({"message": "Goat updated"})

@goats_bp.route('/<int:id>', methods=['DELETE'])
@admin_required
def delete_goat(id):
    goat = Goat.query.get_or_404(id)
    db.session.delete(goat)
    db.session.commit()
    return jsonify({"message": "Goat deleted"})

# ============ INVENTORY ROUTES ============
@inventory_bp.route('', methods=['GET'])
@token_required
def get_inventory():
    items = Inventory.query.all()
    return jsonify([{
        "id": i.id,
        "item_name": i.item_name,
        "category": i.category,
        "quantity": i.quantity,
        "unit": i.unit,
        "cost_per_unit": i.cost_per_unit,
        "total_cost": i.total_cost
    } for i in items])

@inventory_bp.route('', methods=['POST'])
@token_required
def create_inventory():
    data = request.get_json()
    item = Inventory(**data)
    db.session.add(item)
    db.session.commit()
    return jsonify({"id": item.id, "message": "Inventory item created"}), 201

@inventory_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_inventory(id):
    item = Inventory.query.get_or_404(id)
    data = request.get_json()
    
    for key, value in data.items():
        if hasattr(item, key):
            setattr(item, key, value)
    
    db.session.commit()
    return jsonify({"message": "Inventory updated"})

@inventory_bp.route('/<int:id>', methods=['DELETE'])
@admin_required
def delete_inventory(id):
    item = Inventory.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Inventory deleted"})

# ============ EXPENSES ROUTES ============
@expenses_bp.route('', methods=['GET'])
@token_required
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([{
        "id": e.id,
        "category": e.category,
        "amount": e.amount,
        "date": e.date.isoformat(),
        "description": e.description
    } for e in expenses])

@expenses_bp.route('', methods=['POST'])
@token_required
def create_expense():
    data = request.get_json()
    expense = Expense(**data)
    db.session.add(expense)
    db.session.commit()
    return jsonify({"id": expense.id, "message": "Expense created"}), 201

@expenses_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_expense(id):
    expense = Expense.query.get_or_404(id)
    data = request.get_json()
    
    for key, value in data.items():
        if hasattr(expense, key):
            setattr(expense, key, value)
    
    db.session.commit()
    return jsonify({"message": "Expense updated"})

@expenses_bp.route('/<int:id>', methods=['DELETE'])
@admin_required
def delete_expense(id):
    expense = Expense.query.get_or_404(id)
    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Expense deleted"})

# ============ SALES ROUTES ============
@sales_bp.route('', methods=['GET'])
@token_required
def get_sales():
    sales = Sale.query.all()
    return jsonify([{
        "id": s.id,
        "goat_id": s.goat_id,
        "buyer_name": s.buyer_name,
        "sale_price": s.sale_price,
        "sale_date": s.sale_date.isoformat(),
        "profit": s.profit
    } for s in sales])

@sales_bp.route('', methods=['POST'])
@token_required
def create_sale():
    data = request.get_json()
    
    # Check if goat already sold
    if Sale.query.filter_by(goat_id=data['goat_id']).first():
        return jsonify({"error": "Goat already sold"}), 400
    
    sale = Sale(**data)
    db.session.add(sale)
    
    # Update goat status
    goat = Goat.query.get(data['goat_id'])
    if goat:
        goat.current_status = 'sold'
    
    db.session.commit()
    return jsonify({"id": sale.id, "message": "Sale created"}), 201

@sales_bp.route('/<int:id>', methods=['DELETE'])
@admin_required
def delete_sale(id):
    sale = Sale.query.get_or_404(id)
    db.session.delete(sale)
    db.session.commit()
    return jsonify({"message": "Sale deleted"})

# ============ DASHBOARD ROUTES ============
@dashboard_bp.route('/summary', methods=['GET'])
@token_required
def get_dashboard():
    total_goats = Goat.query.count()
    active_goats = Goat.query.filter_by(current_status='active').count()
    pregnant_goats = Goat.query.filter(Goat.pregnancy_status.isnot(None)).count()
    
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    monthly_expenses = db.session.query(func.sum(Expense.amount)).filter(
        extract('month', Expense.date) == current_month,
        extract('year', Expense.date) == current_year
    ).scalar() or 0
    
    monthly_revenue = db.session.query(func.sum(Sale.sale_price)).filter(
        extract('month', Sale.sale_date) == current_month,
        extract('year', Sale.sale_date) == current_year
    ).scalar() or 0
    
    return jsonify({
        "total_goats": total_goats,
        "active_goats": active_goats,
        "pregnant_goats": pregnant_goats,
        "vaccination_due_count": 0,
        "low_inventory_count": 0,
        "monthly_expense_total": float(monthly_expenses),
        "monthly_revenue_total": float(monthly_revenue),
        "net_profit": float(monthly_revenue - monthly_expenses)
    })

def register_routes(app):
    """Register all blueprints with the Flask app"""
    app.register_blueprint(auth_bp)
    app.register_blueprint(goats_bp)
    app.register_blueprint(inventory_bp)
    app.register_blueprint(expenses_bp)
    app.register_blueprint(sales_bp)
    app.register_blueprint(dashboard_bp)

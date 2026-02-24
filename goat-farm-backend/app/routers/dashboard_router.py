from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import date

from ..models import Goat, Expense, Sale, Inventory
from ..schemas import DashboardSummary
from ..dependencies import get_db, admin_required

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db), current_user = Depends(admin_required)):
    """Admin only dashboard summarizing farm performance."""
    
    today = date.today()
    current_month = today.month
    current_year = today.year
    
    # Goats Stats
    total_goats = db.query(func.count(Goat.id)).scalar() or 0
    active_goats = db.query(func.count(Goat.id)).filter(Goat.current_status == "active").scalar() or 0
    pregnant_goats = db.query(func.count(Goat.id)).filter(Goat.pregnancy_status == "Pregnant", Goat.current_status == "active").scalar() or 0
    vaccination_due_count = db.query(func.count(Goat.id)).filter(
        Goat.current_status == "active",
        # Custom logic can be adjusted based on farm policy, e.g., using Vaccination table's next_due_date
        Goat.vaccination_status != "Vaccinated" 
    ).scalar() or 0
    
    # Inventory Stats
    low_inventory_count = db.query(func.count(Inventory.id)).filter(
        Inventory.quantity <= Inventory.low_stock_threshold
    ).scalar() or 0
    
    # Financials - Current Month Expenses
    monthly_expense_total = db.query(func.sum(Expense.amount)).filter(
        extract('month', Expense.date) == current_month,
        extract('year', Expense.date) == current_year
    ).scalar() or 0.0
    
    # Financials - Current Month Revenue (Sales)
    monthly_revenue_total = db.query(func.sum(Sale.sale_price)).filter(
        extract('month', Sale.sale_date) == current_month,
        extract('year', Sale.sale_date) == current_year
    ).scalar() or 0.0
    
    # Net Profit overall (sum of all Sale profit column - sum of all general Expenses, OR specific calculations)
    # The requirement asks for generic "Net Profit". A common metric is sum(sale.profit) - sum(general_expenses).
    # Since sale profit already deducts individual assigned expenses + purchase price, we just sum it.
    # If we need absolute Net Profit involving everything including inventory overhead, we'd minus all unassigned expenses.
    
    total_sales_profit = db.query(func.sum(Sale.profit)).scalar() or 0.0
    
    # Subtract any general expenses that weren't assigned to a goat (and therefore not already deducted in sale profit)
    unassigned_expenses_sum = db.query(func.sum(Expense.amount)).filter(Expense.related_goat_id == None).scalar() or 0.0
    
    net_profit = total_sales_profit - unassigned_expenses_sum

    return DashboardSummary(
        total_goats=total_goats,
        active_goats=active_goats,
        pregnant_goats=pregnant_goats,
        vaccination_due_count=vaccination_due_count,
        low_inventory_count=low_inventory_count,
        monthly_expense_total=monthly_expense_total,
        monthly_revenue_total=monthly_revenue_total,
        net_profit=net_profit
    )

from pydantic import BaseModel
from datetime import date

class Expense(BaseModel):
    date: date
    amount: float
    currency: str
    department: str
    category: str
    description: str

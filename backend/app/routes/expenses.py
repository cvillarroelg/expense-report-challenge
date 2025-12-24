from fastapi import APIRouter, Depends
from typing import List
from app.schemas.expense import Expense
from app.data.expenses import expenses_data
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Expense])
def get_expenses(user=Depends(get_current_user)):
    return expenses_data

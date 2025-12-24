from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from typing import List
from app.schemas.expense import Expense
from app.data.expenses import expenses_data
from app.core.security import get_current_user
from app.services.expenses_validator import validate_expenses_file


router = APIRouter()

@router.get("/", response_model=List[Expense])
def get_expenses(user=Depends(get_current_user)):
    return expenses_data

@router.post("/validate")
async def validate_expenses(file: UploadFile = File(...)):
    if not file.filename.endswith((".xlsx", ".csv")):
        raise HTTPException(status_code=400, detail="Invalid file type")

    result = await validate_expenses_file(file)
    return result
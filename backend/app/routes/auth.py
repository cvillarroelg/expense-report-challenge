from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user
from app.schemas.auth import LoginRequest, LoginResponse
from app.services.auth_service import authenticate_user

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest):
    try:
        token = authenticate_user(data.email, data.password)
        return {"token": token}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return user

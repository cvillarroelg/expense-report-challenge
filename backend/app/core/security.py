from fastapi import Header, HTTPException
from app.services.auth_service import verify_token

def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")

    token = authorization.replace("Bearer ", "")

    if not verify_token(token):
        raise HTTPException(status_code=401, detail="Token inválido")

    return {"email": "test@test.com"}

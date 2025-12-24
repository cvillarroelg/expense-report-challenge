FAKE_TOKEN = "fake-jwt-token-123456"

def authenticate_user(email: str, password: str) -> str:
    if not password:
        raise ValueError("The password cannot be empty")

    # Token simulado
    return FAKE_TOKEN

def verify_token(token: str) -> bool:
    return token == FAKE_TOKEN

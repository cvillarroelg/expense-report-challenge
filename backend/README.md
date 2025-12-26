# Backend – Expense Management API

Backend API built with **FastAPI** for validating, storing and processing expense reports.

---

## 🧰 Technologies

- Python 3.11
- FastAPI
- Uvicorn
- Pandas
- OpenPyXL
- python-multipart
- email-validator
- Docker

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI entry point
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── schemas/         # Pydantic models
├── requirements.txt
├── Dockerfile
└── README.md
```

---

## 🚀 Run locally (without Docker)

### Prerequisites
- Python >= 3.10
- pip

### Create virtual environment
```bash
python -m venv venv
source venv/bin/activate   # Linux / Mac
venv\Scripts\activate    # Windows
```

### Install dependencies
```bash
pip install -r requirements.txt
```

### Run server
```bash
uvicorn app.main:app --reload
```

API will be available at:
```
http://localhost:8000
```

Swagger UI:
```
http://localhost:8000/docs
```

---

## 🐳 Run with Docker

### Build image
```bash
docker build -t expense-backend .
```

### Run container
```bash
docker run -p 8000:8000 expense-backend
```

---

## 📌 Main Features

- User authentication (mocked / token-based)
- Expense validation
- CSV and XLSX file validation
- Business rules:
  - No future dates
  - Amount > 0
  - Currency must be USD
  - Required fields validation
- Row-by-row error reporting

---

## 📬 API Endpoints

### Validate expenses file
```
POST /expenses/validate
```
Accepts:
- `.csv`
- `.xlsx`

Returns:
- Valid rows
- Invalid rows with detailed errors

---

## 📝 Notes

- This backend is designed to work together with the React frontend.
- Data persistence is simulated on the frontend (localStorage).
- Authentication is mocked for demo purposes.

---

## ✅ Ready for Docker Compose

This backend is fully compatible with `docker-compose` when paired with the frontend service.

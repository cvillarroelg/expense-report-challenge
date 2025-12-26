# Expense Management Application

This project is a technical assignment built using **React + TypeScript** for the frontend and **FastAPI** for the backend.

The goal of the application is to simulate an expense reporting system, including authentication, data visualization, file validation, and reporting features.

---

## 🧰 Technologies Used

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- jsPDF

### Backend
- FastAPI
- Uvicorn
- Pydantic
- Pandas
- OpenPyXL

### DevOps
- Docker
- Docker Compose

---

## ✅ Implemented Features

- User login with simulated authentication token
- Protected routes
- Expense dashboard with:
  - Table view
  - Total expenses calculation
  - Category pie chart
  - Department bar chart
- Create expense form with validations
- Local persistence using LocalStorage
- CSV / XLSX file upload and validation
- PDF export of expense report
- Confirmation dialogs for critical actions
- Dockerized frontend and backend

---

## 🚀 Run the project with Docker

### Prerequisites
- Docker (Docker Desktop)

### Start the application
```bash
docker compose up --build

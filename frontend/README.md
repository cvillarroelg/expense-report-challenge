# Frontend – Expense Management App

Frontend application built with **React**, **TypeScript**, and **Vite**.

---

## 🧰 Technologies
- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- jsPDF

---

## 🚀 Run locally (without Docker)

### Prerequisites
- Node.js >= 18
- npm

### Install dependencies
```bash
npm install
```

### Environment variables

Create a `.env` file in the root of the frontend project:

```env
VITE_API_URL=http://localhost:8000
```

### Start the development server
```bash
npm run dev
```

The application will be available at:
```
http://localhost:5173
```

---

## 🚀 Run with Docker

### Prerequisites
- Docker (Docker Desktop)

### Build and run the frontend container
```bash
docker compose up --build frontend
```

The application will be available at:
```
http://localhost:5173
```

---

## 🔐 Authentication

- Login is handled via the backend API
- The authentication token is stored in LocalStorage
- Protected routes are guarded using a `ProtectedRoute` component

---

## 📊 Main Features

- Login and protected dashboard
- Expense creation with validations
- Expenses table with formatted dates and currency
- Pie chart showing expenses by category
- Bar chart showing expenses by department
- PDF export with total expenses calculation
- CSV / XLSX expenses file upload with validation
- LocalStorage persistence for expenses

---

## 📁 Project Structure (simplified)

```
src/
├── components/
├── pages/
├── services/
├── data/
├── types/
├── utils/
└── App.tsx
```

---

## 📝 Notes

- This frontend depends on the backend running on `http://localhost:8000`
- Make sure the backend is running before attempting to log in

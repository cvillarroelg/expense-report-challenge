import pandas as pd
from datetime import date
from fastapi import UploadFile
from io import BytesIO

REQUIRED_COLUMNS = [
    "Date",
    "Amount",
    "Currency",
    "Department",
    "Category",
    "Description"
]

def is_empty(value) -> bool:
    return pd.isna(value) or str(value).strip() == ""

async def validate_expenses_file(file: UploadFile):
    contents = await file.read()

    # Read file
    if file.filename.endswith(".csv"):
        df = pd.read_csv(BytesIO(contents))
    elif file.filename.endswith(".xlsx"):
        df = pd.read_excel(BytesIO(contents))
    else:
        return {"valid": False, "errors": ["Invalid file type"]}

    # Normalize columns (case-insensitive)
    columns_map = {col.lower().strip(): col for col in df.columns}

    for required in REQUIRED_COLUMNS:
        if required.lower() not in columns_map:
            return {
                "valid": False,
                "errors": [f"Missing column: {required}"]
            }

    errors = []
    valid_rows = []

    for index, row in df.iterrows():
        row_errors = []

        # -------- GENERIC EMPTY CHECK --------
        for field in REQUIRED_COLUMNS:
            value = row[columns_map[field.lower()]]
            if is_empty(value):
                row_errors.append(f"Missing {field}")

        # -------- DATE --------
        if "Missing Date" not in row_errors:
            expense_date = pd.to_datetime(
                row[columns_map["date"]],
                errors="coerce"
            )
            if pd.isna(expense_date):
                row_errors.append("Invalid Date format")
            elif expense_date.date() > date.today():
                row_errors.append("Future date not allowed")

        # -------- AMOUNT --------
        if "Missing Amount" not in row_errors:
            amount = row[columns_map["amount"]]
            if amount <= 0:
                row_errors.append("Amount must be > 0")

        # -------- DESCRIPTION --------
        if "Missing Description" not in row_errors:
            description = str(row[columns_map["description"]]).strip()
            if len(description) < 3:
                row_errors.append("Description too short")
        
        # -------- CURRENCY --------
        if "Missing Currency" not in row_errors:
            currency = str(row[columns_map["currency"]]).strip().upper()
            if currency != "USD":
                row_errors.append("Invalid Currency (only USD allowed)")

        # -------- RESULT --------
        if row_errors:
            errors.append({
                "row": index + 2,
                "errors": row_errors
            })
        else:
            valid_rows.append({
                "date": str(expense_date.date()),
                "amount": float(amount),
                "currency": str(row[columns_map["currency"]]),
                "department": str(row[columns_map["department"]]),
                "category": str(row[columns_map["category"]]),
                "description": description
            })

    return {
        "valid": len(errors) == 0,
        "validRows": valid_rows,
        "invalidRows": errors
    }

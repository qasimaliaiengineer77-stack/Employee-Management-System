from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database.session import get_db
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeResponse

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.post("/", response_model=EmployeeResponse)
def add_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):

    last_employee = db.query(Employee).order_by(Employee.id.desc()).first()
    next_id = last_employee.id + 1 if last_employee else 1

    new_employee = Employee(
        employee_id=f"EMP-{next_id:03d}",
        full_name=employee.full_name,
        email=employee.email,
        department=employee.department,
        salary=employee.salary,
        joining_date=employee.joining_date
    )

    db.add(new_employee)

    try:
        db.commit()
        db.refresh(new_employee)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already exists")

    return new_employee
@router.get("/", response_model=list[EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()
@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    employee: EmployeeCreate,
    db: Session = Depends(get_db)
):
    existing_employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not existing_employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    existing_employee.full_name = employee.full_name
    existing_employee.email = employee.email
    existing_employee.department = employee.department
    existing_employee.salary = employee.salary
    existing_employee.joining_date = employee.joining_date

    try:
        db.commit()
        db.refresh(existing_employee)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already exists")

    return existing_employee
@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    employee: EmployeeCreate,
    db: Session = Depends(get_db)
):
    existing_employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not existing_employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    existing_employee.full_name = employee.full_name
    existing_employee.email = employee.email
    existing_employee.department = employee.department
    existing_employee.salary = employee.salary
    existing_employee.joining_date = employee.joining_date

    try:
        db.commit()
        db.refresh(existing_employee)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already exists")

    return existing_employee


@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.delete(employee)
    db.commit()

    return {"message": "Employee deleted successfully"}
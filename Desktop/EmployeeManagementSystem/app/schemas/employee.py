from datetime import date
from pydantic import BaseModel, ConfigDict, Field


class EmployeeCreate(BaseModel):
    full_name: str = Field(min_length=2)
    email: str
    department: str
    salary: float = Field(gt=0)
    joining_date: date


class EmployeeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    salary: float
    joining_date: date
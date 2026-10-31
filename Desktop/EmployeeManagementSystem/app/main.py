from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api.employees import router as employee_router

app = FastAPI(title="Employee Management System")

BASE_DIR = Path(__file__).resolve().parent

app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "ui"),
    name="static"
)

app.include_router(employee_router)


@app.get("/")
def home():
    return FileResponse(BASE_DIR / "ui" / "index.html")
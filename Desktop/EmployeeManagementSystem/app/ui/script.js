
const API = "/employees/";
const form = document.getElementById("employeeForm");
const table = document.getElementById("employeeTable");
const message = document.getElementById("message");

let employees = [];

function showMessage(text, error = false) {
    message.textContent = text;
    message.style.color = error ? "red" : "green";
}

async function loadEmployees() {
    try {
        const response = await fetch(API);
        if (!response.ok) throw new Error("Could not load employees");

        employees = await response.json();
        document.getElementById("totalEmployees").textContent = employees.length;
        renderEmployees(employees);
    } catch (error) {
        showMessage(error.message, true);
    }
}

function renderEmployees(data) {
    table.replaceChildren();

    data.forEach(employee => {
        const row = document.createElement("tr");

        const values = [
            employee.employee_id,
            employee.full_name,
            employee.email,
            employee.department,
            employee.salary,
            employee.joining_date
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actions = document.createElement("td");

        const edit = document.createElement("button");
        edit.textContent = "Edit";
        edit.className = "action-button";
        edit.addEventListener("click", () => editEmployee(employee));

        const remove = document.createElement("button");
        remove.textContent = "Delete";
        remove.className = "action-button delete-button";
        remove.addEventListener("click", () => deleteEmployee(employee.id));

        actions.append(edit, remove);
        row.appendChild(actions);
        table.appendChild(row);
    });
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const id = document.getElementById("employeeDbId").value;

    const data = {
        full_name: document.getElementById("full_name").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
        salary: Number(document.getElementById("salary").value),
        joining_date: document.getElementById("joining_date").value
    };

    try {
        const response = await fetch(id ? `${API}${id}` : API, {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.detail || "Request failed");

        form.reset();
        document.getElementById("employeeDbId").value = "";
        document.getElementById("formTitle").textContent = "Add New Employee";
        document.getElementById("submitButton").textContent = "Add Employee";
        document.getElementById("cancelButton").hidden = true;

        showMessage(id ? "Employee updated!" : "Employee added!");
        await loadEmployees();
    } catch (error) {
        showMessage(error.message, true);
    }
});

function editEmployee(employee) {
    document.getElementById("employeeDbId").value = employee.id;
    document.getElementById("full_name").value = employee.full_name;
    document.getElementById("email").value = employee.email;
    document.getElementById("department").value = employee.department;
    document.getElementById("salary").value = employee.salary;
    document.getElementById("joining_date").value = employee.joining_date;

    document.getElementById("formTitle").textContent = "Update Employee";
    document.getElementById("submitButton").textContent = "Save Changes";
    document.getElementById("cancelButton").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("cancelButton").addEventListener("click", () => {
    form.reset();
    document.getElementById("employeeDbId").value = "";
    document.getElementById("formTitle").textContent = "Add New Employee";
    document.getElementById("submitButton").textContent = "Add Employee";
    document.getElementById("cancelButton").hidden = true;
});

async function deleteEmployee(id) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
        const response = await fetch(`${API}${id}`, { method: "DELETE" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.detail || "Delete failed");

        showMessage("Employee deleted!");
        await loadEmployees();
    } catch (error) {
        showMessage(error.message, true);
    }
}

document.getElementById("search").addEventListener("input", event => {
    const query = event.target.value.toLowerCase();

    renderEmployees(employees.filter(employee =>
        employee.full_name.toLowerCase().includes(query) ||
        employee.employee_id.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query)
    ));
});

loadEmployees();

let currentEditId = null; // Track the task being edited

// Utility: get todos from storage
function getTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

// Utility: save todos to storage
function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Utility: reset form
function resetForm() {
  document.getElementById("todo-form").reset();
  document.getElementById("submitBtn").textContent = "Add";
  document.getElementById("cancelBtn").classList.add("d-none"); // hide cancel
  currentEditId = null;
}

// Handle form submit (Add / Update)
document.getElementById("todo-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const inputEl = document.getElementById("enteredTodo");
  const enteredTodo = inputEl.value.trim();
  if (!enteredTodo) return;

  let todos = getTodos();

  if (currentEditId) {
    // Update existing
    const task = todos.find(t => t.id === currentEditId);
    if (task) {
      task.todo = enteredTodo;
      saveTodos(todos);
      renderTasks();
    }
    resetForm();
    return;
  }

  // Prevent duplicates
  if (todos.some(t => t.todo === enteredTodo)) {
    alert("Task already exists!");
    resetForm();
    return;
  }

  // Add new task
  const formattedTodo = enteredTodo.charAt(0).toUpperCase() + enteredTodo.slice(1);
  todos.push({
    id: Date.now(),
    todo: formattedTodo,
    status: "todo",
  });
  saveTodos(todos);
  renderTasks();
  resetForm();
});

// Render tasks into columns
function renderTasks() {
  ["todo", "inprogress", "done"].forEach(id => {
    document.getElementById(id).innerHTML = "";
  });

  const todos = getTodos();
  const statusMap = {
    todo: "secondary",
    inprogress: "info",
    done: "success",
  };

  todos.forEach(item => {
    const column = document.getElementById(item.status);

    const todoBox = document.createElement("div");
    todoBox.className = `bg-${statusMap[item.status]} rounded-2 p-2 m-1 draggable-task d-flex flex-nowrap align-items-center`;
    todoBox.setAttribute("draggable", "true");
    todoBox.dataset.id = item.id;

    const title = document.createElement("h6");
    title.className = "mb-1 me-3";
    title.textContent = item.todo;

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-warning me-1";
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-danger";
    deleteBtn.textContent = "Delete";

    // Edit
    editBtn.addEventListener("click", () => {
      document.getElementById("enteredTodo").value = item.todo;
      document.getElementById("submitBtn").textContent = "Update";
      document.getElementById("cancelBtn").classList.remove("d-none"); // show cancel
      currentEditId = item.id;
    });

    // Delete
    deleteBtn.addEventListener("click", () => {
      const updated = todos.filter(t => t.id !== item.id);
      saveTodos(updated);
      renderTasks();
      if (currentEditId === item.id) resetForm();
    });

    todoBox.appendChild(title);
    todoBox.appendChild(editBtn);
    todoBox.appendChild(deleteBtn);
    column.appendChild(todoBox);
  });

  setupDragAndDrop();
}

// Cancel editing
document.getElementById("cancelBtn").addEventListener("click", resetForm);

// Drag & drop setup (same as your original)
function setupDragAndDrop() {
  ["todo", "inprogress", "done"].forEach(columnId => {
    const column = document.getElementById(columnId);

    column.addEventListener("dragover", e => e.preventDefault());
    column.addEventListener("drop", e => {
      e.preventDefault();
      const taskId = parseInt(e.dataTransfer.getData("text/plain"));
      const todos = getTodos();
      const task = todos.find(t => t.id === taskId);

      if (task && task.status !== columnId) {
        task.status = columnId;
        saveTodos(todos);
        renderTasks();
      }
    });
  });

  document.querySelectorAll(".draggable-task").forEach(task => {
    task.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", task.dataset.id);
    });
  });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("todos")) saveTodos([]);
  renderTasks();
});

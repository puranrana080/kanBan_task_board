
// Form Submit
document.getElementById("todo-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const enteredTodo = document.getElementById("enteredTodo").value.trim();

  if (!enteredTodo) return;

  let localStorageToDo = JSON.parse(localStorage.getItem("todos")) || [];

  const todoExist = localStorageToDo.find((todo) => todo.todo === enteredTodo);
  if (todoExist) {
    alert("ToDo already added");
    document.getElementById("todo-form").reset();
    return;
  }

  localStorageToDo.push({
    id: Date.now(), // Better unique ID than array index
    todo: enteredTodo,
    status: "todo",
  });

  localStorage.setItem("todos", JSON.stringify(localStorageToDo));
  document.getElementById("todo-form").reset();
  renderTasks(); // Re-render instead of reload
});

// Render all tasks
function renderTasks() {
  ["todo", "inprogress", "done"].forEach((columnId) => {
    document.getElementById(columnId).innerHTML = ""; // Clear column
  });

  let todoTaskData = JSON.parse(localStorage.getItem("todos")) || [];

  const statusMap = {
    todo: { color: "warning" },
    inprogress: { color: "info" },
    done: { color: "success" },
  };

  todoTaskData.forEach((item) => {
    const status = item.status;
    const column = document.getElementById(status);
    const color = statusMap[status]?.color || "secondary";

    const todoBox = document.createElement("div");
    todoBox.classList.add("bg-" + color, "rounded-2", "p-2", "m-1", "draggable-task");
    todoBox.setAttribute("draggable", "true");
    todoBox.dataset.id = item.id; // Store ID

    const title = document.createElement("h6");
    title.classList.add("mb-1");
    title.textContent = item.todo;

    const editBtn = document.createElement("button");
    editBtn.classList.add("btn", "btn-sm", "btn-warning", "btn-sm");
    editBtn.textContent = "Edit";

    // Append elements
    todoBox.appendChild(title);
    todoBox.appendChild(editBtn);
    column.appendChild(todoBox);

    // Edit button click
    editBtn.addEventListener("click", () => {
      const newTitle = prompt("Edit task:", item.todo);
      if (newTitle === null) return; // Cancelled
      if (newTitle.trim() === "") {
        alert("Task cannot be empty!");
        return;
      }

      // Update in localStorage
      const tasks = JSON.parse(localStorage.getItem("todos"));
      const task = tasks.find(t => t.id === item.id);
      if (task) {
        task.todo = newTitle.trim();
        localStorage.setItem("todos", JSON.stringify(tasks));
        renderTasks(); // Refresh UI
      }
    });
  });

  setupDragAndDrop();
}

// Setup drag and drop
function setupDragAndDrop() {
  ["todo", "inprogress", "done"].forEach((columnId) => {
    const column = document.getElementById(columnId);

    column.addEventListener("dragover", (e) => e.preventDefault());
    column.addEventListener("drop", (e) => {
      e.preventDefault();
      const taskId = parseInt(e.dataTransfer.getData("text/plain"));
      const tasks = JSON.parse(localStorage.getItem("todos")) || [];
      const task = tasks.find(t => t.id === taskId);

      if (task && task.status !== columnId) {
        task.status = columnId;
        localStorage.setItem("todos", JSON.stringify(tasks));
        renderTasks(); // Update UI without reload
      }
    });
  });

  // Add dragstart to all draggable tasks
  document.querySelectorAll(".draggable-task").forEach(task => {
    task.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", task.dataset.id);
    });
  });
}

// Initial setup
document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("todos")) {
    localStorage.setItem("todos", JSON.stringify([]));
  }
  renderTasks();
});


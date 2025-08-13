// Form Submit
document
  .getElementById("todo-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const enteredTodo = document.getElementById("enteredTodo").value.trim();
    console.log("new ToDo", enteredTodo);

    //inset into localStorage
    let localStorageToDo = JSON.parse(localStorage.getItem("todos"));

    let todoExist = localStorageToDo.find((todo) => todo.todo == enteredTodo);
    if (todoExist) {
      alert("ToDo already added");
      location.reload()
      return;
    }

    localStorageToDo.push({
      id: localStorageToDo.length,
      todo: enteredTodo,
      status: "todo",
    });
    localStorage.setItem("todos", JSON.stringify(localStorageToDo));
    location.reload();
  });

document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("todos")) {
    localStorage.setItem("todos", JSON.stringify([]));
  }
  let todoTaskData = JSON.parse(localStorage.getItem("todos"));
  console.log("All Data", todoTaskData);

  // new todo task Added
  const newTaskData = todoTaskData.filter((item) => item.status === "todo");
  newTaskData.forEach((item) => {
    insertIntoColumn(item, "todo", "light");
  });

  // In progress Data
  const inProgressTaskData = todoTaskData.filter(
    (item) => item.status === "inprogress"
  );
  inProgressTaskData.forEach((item) => {
    insertIntoColumn(item, "inprogress", "info");
  });

  //done tasks Data
  const taskDoneData = todoTaskData.filter((item) => item.status === "done");
  taskDoneData.forEach((item) => {
    insertIntoColumn(item, "done", "success");
  });

  function insertIntoColumn(todo, columnId, color) {
    let column = document.getElementById(columnId);

    let todoBox = document.createElement("div");
    todoBox.setAttribute("draggable", "true");
    todoBox.classList.add(`bg-${color}`, "rounded-2", "p-1", "m-1");

    let title = document.createElement("h5");
    title.textContent = `${todo.todo}`;

    let editBtn = document.createElement("button");
    editBtn.classList.add("btn", "btn-sm", "bg-warning");
    editBtn.textContent = "Edit";

    todoBox.appendChild(title);
    todoBox.appendChild(editBtn);
    column.appendChild(todoBox);

    //   adding event to todoBox with dragabble to true
    todoBox.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", todo.id);
    });
  }

  ["todo", "inprogress", "done"].forEach((columnId) => {
    const column = document.getElementById(columnId);

    column.addEventListener("dragover", (e) => e.preventDefault());
    column.addEventListener("drop", (e) => {
      e.preventDefault();
      const taskId = parseInt(e.dataTransfer.getData("text/plain"));
      const todoTaskData = JSON.parse(localStorage.getItem("todos")) || [];
      const task = todoTaskData.find((t) => t.id === taskId);
      if (task && task.status !== columnId) {
        task.status = columnId;
        localStorage.setItem("todos", JSON.stringify(todoTaskData));
        location.reload();
      }
    });
  });
});

import { TodoApp } from "./TodoApp.js";

// init
document.addEventListener("DOMContentLoaded", () => {
  window.todoApp = new TodoApp(document.getElementById("app"));
});

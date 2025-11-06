import { TodoItem } from "./TodoItem.js"; // модель однієї задачі

// Основний клас додатку
export class TodoApp {
  constructor(root) {
    // Кореневий DOM-елемент застосунку
    this.root = root;

    // Ключ для збереження у localStorage
    this.storageKey = "todo_oop_v1";

    // Масив усіх задач
    this.todos = [];

    // Поточний активний фільтр (all | active | completed)
    this.filter = "all";

    // --- Пошук основних елементів у DOM ---
    this.input = root.querySelector("#newInput");
    this.addBtn = root.querySelector("#addBtn");
    this.listEl = root.querySelector("#list");
    this.countEl = root.querySelector("#count");
    this.filterBtns = Array.from(root.querySelectorAll(".filter-btn"));
    this.clearCompletedBtn = root.querySelector("#clearCompleted");

    // --- Ініціалізація ---
    this.load(); // завантаження збережених задач із localStorage
    this.bind(); // прив’язка подій
    this.render(); // перше відображення списку
  }

  // --- Прив’язка подій ---
  bind() {
    // Додавання нової задачі при кліку або натисканні Enter
    this.addBtn.addEventListener("click", () => this.handleAdd());
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.handleAdd();
    });

    // Обробка подій усередині списку (делегування)
    this.listEl.addEventListener("click", (e) => this.handleListClick(e));
    this.listEl.addEventListener("dblclick", (e) => this.handleDblClick(e));
    this.listEl.addEventListener("focusout", (e) => this.finishEdit(e), true);

    // Кнопки фільтрів (All / Active / Completed)
    this.filterBtns.forEach((b) =>
      b.addEventListener("click", (e) => this.changeFilter(e))
    );

    // Кнопка очищення завершених задач
    this.clearCompletedBtn.addEventListener("click", () =>
      this.clearCompleted()
    );
  }

  // --- Збереження у localStorage ---
  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
  }

  // --- Завантаження із localStorage ---
  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        // Відновлення об’єктів TodoItem із JSON
        const parsed = JSON.parse(raw);
        this.todos = parsed.map((t) => new TodoItem(t));
      }
    } catch (e) {
      console.warn("Failed to load todos", e);
    }
  }

  // --- Додавання нової задачі ---
  handleAdd() {
    const text = this.input.value.trim();
    if (!text) return; // ігноруємо порожній ввід

    const todo = new TodoItem({ text });
    this.todos.unshift(todo); // додаємо на початок списку
    this.input.value = ""; // очищаємо поле вводу

    this.save();
    this.render();
  }

  // --- Пошук задачі за ID ---
  findById(id) {
    return this.todos.find((t) => t.id === id);
  }

  // --- Обробка кліків у списку (видалення / позначення виконаним) ---
  handleListClick(e) {
    const el = e.target;
    const itemEl = el.closest(".item");
    if (!itemEl) return;
    const id = itemEl.dataset.id;

    // Видалення задачі
    if (el.matches('[data-action="delete"]')) {
      this.todos = this.todos.filter((t) => t.id !== id);
      this.save();
      this.render();
      return;
    }

    // Перемикання стану (виконано/не виконано)
    if (el.matches('[data-action="toggle"]')) {
      const t = this.findById(id);
      if (t) {
        t.done = !t.done;
        this.save();
        this.render();
      }
      return;
    }
  }

  // --- Редагування задачі по подвійному кліку ---
  handleDblClick(e) {
    const itemEl = e.target.closest(".item");
    if (!itemEl) return;

    const id = itemEl.dataset.id;
    const textEl = itemEl.querySelector(".text");
    const t = this.findById(id);
    if (!t) return;

    // Заміна тексту на input для редагування
    const input = document.createElement("input");
    input.className = "edit-input";
    input.value = t.text;
    input.dataset.id = id;
    textEl.replaceWith(input);
    input.focus();
    input.select();

    // Підтвердження Enter / відміна Escape
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") input.blur(); // завершити редагування
      if (ev.key === "Escape") {
        input.value = t.text; // відновити старе значення
        input.blur();
      }
    });
  }

  // --- Завершення редагування (onBlur або Enter) ---
  finishEdit(e) {
    const el = e.target;
    if (!el.classList || !el.classList.contains("edit-input")) return;

    const id = el.dataset.id;
    const t = this.findById(id);
    if (!t) return;

    const newText = el.value.trim();
    if (newText) {
      t.text = newText;
    }

    this.save();
    this.render();
  }

  // --- Зміна фільтра ---
  changeFilter(e) {
    const btn = e.currentTarget;
    this.filter = btn.dataset.filter;

    // Візуальне оновлення активної кнопки
    this.filterBtns.forEach((b) => b.classList.toggle("active", b === btn));

    this.render();
  }

  // --- Очищення завершених задач ---
  clearCompleted() {
    this.todos = this.todos.filter((t) => !t.done);
    this.save();
    this.render();
  }

  // --- Відображення списку ---
  render() {
    this.listEl.innerHTML = "";

    // Вибір задач для відображення за поточним фільтром
    const toShow = this.todos.filter((t) => {
      if (this.filter === "active") return !t.done;
      if (this.filter === "completed") return t.done;
      return true; // для all
    });

    // Створення DOM-елементів списку
    for (const t of toShow) {
      const li = document.createElement("li");
      li.className = "item";
      li.dataset.id = t.id;

      li.innerHTML = `
        <input type="checkbox" data-action="toggle" ${
          t.done ? "checked" : ""
        } aria-label="toggle">
        <div class="text ${t.done ? "completed" : ""}">${t.text}</div>
        <div class="controls">
          <button class="icon-btn" data-action="delete" title="Delete">✕</button>
        </div>
      `;

      this.listEl.appendChild(li);
    }

    // Підрахунок активних і загальних задач
    const total = this.todos.length;
    const active = this.todos.filter((t) => !t.done).length;
    this.countEl.textContent = `${active} active / ${total} total`;
  }
}

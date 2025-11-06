export class TodoItem {
  constructor({
    id = null,
    text = "",
    done = false,
    created = Date.now(),
  } = {}) {
    this.id = id ?? TodoItem.generateId();
    this.text = text;
    this.done = done;
    this.created = created;
  }

  static generateId() {
    return "t_" + Math.random().toString(36).slice(2, 9);
  }
}

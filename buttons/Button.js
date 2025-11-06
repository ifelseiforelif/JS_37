export class Button {
  constructor(name, width, height, color) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.name = name;
  }
  show(f) {
    const div = document.getElementsByClassName("block")[0];
    const btn = document.createElement("button");
    btn.textContent = this.name;
    btn.style.backgroundColor = this.color;
    btn.style.width = this.width;
    btn.style.height = this.height;
    div.appendChild(btn);
    btn.addEventListener(
      "click",
      arguments.length == 0
        ? (e) => {
            alert(e.target.textContent);
          }
        : f
    );
  }
}

const body = document.body;
const div = document.createElement("div");
body.appendChild(div);

const my_styles = {
  backgroundColor: "green",
  padding: "5px",
  textContent: "Add style",
};
const btn = document.createElement("button");
btn.textContent = "Add style";
btn.style.backgroundColor = "green";
btn.style.padding = "5px";
div.appendChild(btn);

const h1 = document.createElement("h1");

h1.textContent = "Hello JS";
div.appendChild(h1);
btn.addEventListener("click", () => {
  h1.classList = "main";
  //TODO: error
  btn.removeEventListener(
    "click",
    () => {
      console.log("+");
    },
    true
  );
});

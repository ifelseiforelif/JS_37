"use strict";
import { Button } from "./Button.js";
const btn1 = new Button("OK", 200, 300, "red");
btn1.show();
const btn2 = new Button("Cancel", 200, 300, "yellow");
btn2.show(function () {
  const div = document.getElementsByTagName("div")[0];
  div.classList.toggle("block");
  div.classList.toggle("block-2");
});

const form = document.getElementById("frm-btn");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formObj = new FormData(form);
  const data = Object.fromEntries(formObj.entries());
  console.log(data.col);
  const new_btn = new Button(data.title, data.h, data.w, data.col);
  new_btn.show();
});

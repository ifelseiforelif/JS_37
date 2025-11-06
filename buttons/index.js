"use strict";
import { Button } from "./Button.js";
const btn1 = new Button("OK", 200, 300, "red");
btn1.show();
const btn2 = new Button("Cancel", 200, 300, "yellow");
btn2.show(function () {
  //document.body.style.backgroundColor = "grey";
  const div = document.getElementsByTagName("div")[0];
  div.classList.toggle("block");
  div.classList.toggle("block-2");
});

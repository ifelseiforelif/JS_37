let i = 0;
const interval = setInterval(() => {
  console.log(i);
  i++;
  if (i === 10) {
    clearInterval(interval);
    console.log("Зупинено після 10 ітерацій");
  }
}, 1000);
setTimeout(() => {
  console.log("Boom");
}, 3000);

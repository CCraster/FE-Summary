let a = [1, 2, 3, 4, 5];
let iter = a[Symbol.iterator]();
for (let i of iter) {
  if (i > 2) {
    break;
  }
  console.log(i);
}

for (let i of iter) {
  console.log(i);
}

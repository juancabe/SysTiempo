let array = [
  "esp8266fuera321",
  "esp8266fuera12",
  "esp8266fuera435",
  "esp8266fuera5443",
  "esp8266fuera9481",
  "esp8266fuera9323",
];
const serverName = "esp8266fuera";
console.log(" Array:", array);
array.sort();
console.log("Sorted:", array);
const lastTime = array[array.length - 1].split(serverName)[1];
console.log("Last time:", lastTime);

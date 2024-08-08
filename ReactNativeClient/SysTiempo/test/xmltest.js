import { XMLHttpRequest } from "xmlhttprequest";

function findHelloRespondingIPs() {
  const baseIP = "192.168.1.";
  const endpoint = "/some-endpoint"; // Specify the correct endpoint here
  const respondingIPs = [];
  const promises = [];

  // Function to check each IP using XMLHttpRequest
  function checkIP(ip) {
    return new Promise((resolve) => {
      const url = `http://${ip}${endpoint}`;
      const xhr = new XMLHttpRequest();

      xhr.open("GET", url, true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          // Request completed
          if (xhr.status === 200 && xhr.responseText === "hello") {
            resolve(ip); // Responding with "hello"
          } else {
            resolve(null); // Either not "hello" or request failed
          }
        }
      };

      xhr.onerror = function () {
        resolve(null); // Handle network errors
      };

      xhr.send();
    });
  }

  // Create all promises for each IP in the range
  for (let i = 2; i <= 255; i++) {
    const ip = `${baseIP}${i}`;
    promises.push(checkIP(ip));
  }

  // Wait for all promises to resolve and filter the results
  return Promise.all(promises).then((results) =>
    results.filter((ip) => ip !== null),
  );
}

// Usage
findHelloRespondingIPs().then((respondingIPs) => {
  console.log('IPs that responded with "hello":', respondingIPs);
});

async function findHelloRespondingIPs() {
  const baseIP = "192.168.1.";
  const endpoint = "/"; // Specify the correct endpoint here
  const promises = [];

  // Function to fetch and check each IP
  async function checkIP(ip) {
    const url = `http://${ip}${endpoint}`;
    try {
      const response = await fetch(url);

      if (response.ok) {
        const text = await response.text();
        if (text === "esp8266dentro") {
          return ip; // Return the IP if it responds with "hello"
        }
      }
    } catch (error) {
      // Ignore errors, just return null for non-responding IPs
      return null;
    }
    return null;
  }

  // Create all promises

  for (let i = 2; i <= 255; i++) {
    const ip = `${baseIP}${i}`;
    promises.push(checkIP(ip));
  }

  // Wait for all promises to resolve
  const results = await Promise.all(promises);

  // Filter out null results and return the responding IPs
  return results.filter((ip) => ip !== null);
}

let firstIP = "";
// Usage
findHelloRespondingIPs().then((respondingIPs) => {
  firstIP = respondingIPs[0];
  console.log("First IP:", firstIP);
});

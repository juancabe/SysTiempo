async function findHelloRespondingIPs(Burl) {
  const baseIP = "192.168.1.";
  const endpoint = "/"; // Specify the correct endpoint here
  const promises = [];

  // Function to fetch and check each IP
  async function checkIP(ip) {
    const url = `http://${ip}${endpoint}`;
    try {
      const response = await fetch(url, { method: "GET", mode: "no-cors" });
      console.log("Checking IP:", ip, response.ok);
      if (response.ok) {
        const text = await response.text();
        if (text === Burl) {
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

  for (let i = 128; i <= 130; i++) {
    const ip = `${baseIP}${i}`;
    promises.push(checkIP(ip));
  }

  // Wait for all promises to resolve
  const results = await Promise.all(promises);

  // Filter out null results and return the responding IPs
  return results.filter((ip) => ip !== null);
}

export async function getEspData(Burl) {
  let url = "";
  if (Burl === "esp8266dentro") url = "http://192.168.1.128";
  else url = "http://" + Burl + ".local";

  console.log("Looking for ", Burl, " at:", url);
  try {
    const response = await fetch(url, { method: "GET", mode: "no-cors" });
    const text = await response.text();
    if (text !== Burl) {
      console.log("Not an ESP8266 device");
      throw new Error("Not an ESP8266 device");
    } else {
      console.log("Found ", Burl, " at:", url);
    }
  } catch (e) {
    console.log("Error fetching data at DNS for", Burl);
    console.log("Trying to find it by IP");
    /*
    const firstIP = await findHelloRespondingIPs(Burl);
    if (firstIP) {
      url = firstIP;
      console.log("Found ", Burl, " at:", url);
    } else {
      console.log("No ESP8266 device found");
      return "No ESP8266 device found";
    }
    */
    url = "192.168.1.128";
    console.log("Looking at ", url);

    try {
      const response = await fetch(url, { method: "GET", mode: "no-cors" });
      const text = await response.text();
      if (text !== Burl) {
        console.log("Not an ESP8266 device");
        throw new Error("Not an ESP8266 device");
      } else {
        console.log("Found ", Burl, " at:", url);
      }
    } catch (e) {
      console.log("Error fetching data at ", url, " for", Burl);
      return "No ESP8266 device found";
    }
  }

  let msg = [];
  // {"first":{"index":0,"time":1723112255},"last":{"index":0,"time":1723112255}}
  console.log("Fetching data from:", url + "/weatherindexesntimes");
  let response = null;
  let dataDentro = null;
  try {
    response = await fetch(url + "/weatherindexesntimes");
    dataDentro = await response.json();
  } catch (e) {
    console.log("Error fetching data:", e);
  }
  console.log("Data:", dataDentro);
  let path = "/weatherbyindex?index=";
  // {"index":0,"temp":27.77,"hum":46.43,"time":1723112255}
  if (dataDentro.first.index < 0) {
    msg = "No data";
  } else {
    if (dataDentro.first.index <= dataDentro.last.index) {
      for (let i = dataDentro.first.index; i < dataDentro.last.index; i++) {
        try {
          const urlIs = url + path + i;
          //console.log("Fetching data from:", urlIs);
          const response = await fetch(urlIs);
          const data = await response.json();
          msg.push(data);
        } catch (e) {
          console.log("Error fetching data:", e);
        }
      }
    } else {
      const maxItems = -1;
      try {
        const urlItems = "/weathervectoritems";
        //console.log("Fetching data from:", url + urlItems);
        const response = await fetch(urlItems);
        const dataItems = await response.json();
        console.log("Data:", dataItems);
        maxItems = dataItems.maxItems;
      } catch (e) {
        console.log("TODO: /weathervectoritems | ", e);
      }
      if (maxItems < 0) {
        msg = "No data";
      } else {
        for (let i = dataDentro.first.index; i < maxItems; i++) {
          try {
            const urlIs = url + path + i;
            console.log("Fetching data from:", urlIs);
            const response = await fetch(urlIs);
            const data = await response.json();
            msg += data;
          } catch (e) {
            console.log("Error fetching data:", e);
          }
        }
        for (let i = 0; i <= dataDentro.last.index; i++) {
          try {
            const urlIs = url + path + i;
            console.log("Fetching data from:", urlIs);
            const response = await fetch(urlIs);
            const data = await response.json();
            msg.push(data);
          } catch (e) {
            console.log("Error fetching data:", e);
          }
        }
      }
    }
  }
  //console.log("Data fetched:", Burl, msg);
  return msg;
}

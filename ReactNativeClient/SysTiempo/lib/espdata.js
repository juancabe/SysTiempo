export async function getEspData() {
  let msg = [];
  let urlDentro = "http://192.168.1.128/weatherindexesntimes";
  // {"first":{"index":0,"time":1723112255},"last":{"index":0,"time":1723112255}}
  console.log("Fetching data from:", urlDentro);
  let response = null;
  let dataDentro = null;
  try {
    response = await fetch(urlDentro);
    dataDentro = await response.json();
  } catch (e) {
    console.log("Error fetching data:", e);
  }
  console.log("Data:", dataDentro);
  urlDentro = "http://192.168.1.128/weatherbyindex?index=";
  // {"index":0,"temp":27.77,"hum":46.43,"time":1723112255}
  if (dataDentro.first.index < 0) {
    msg = "No data";
  } else {
    if (dataDentro.first.index <= dataDentro.last.index) {
      for (let i = dataDentro.first.index; i < dataDentro.last.index; i++) {
        try {
          const urlIs = urlDentro + i;
          console.log("Fetching data from:", urlIs);
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
        const urlItems = "http://192.168.1.128/weatheritems";
        console.log("Fetching data from:", urlItems);
        const response = await fetch(urlItems);
        const dataItems = await response.json();
        console.log("Data:", dataItems);
        maxItems = dataItems.maxItems;
      } catch (e) {
        console.log("TODO: /weatheritems | ", e);
      }
      if (maxItems < 0) {
        msg = "No data";
      } else {
        for (let i = dataDentro.first.index; i < maxItems; i++) {
          try {
            const urlIs = urlDentro + i;
            console.log("Fetching data from:", urlIs);
            const response = await fetch(urlIs);
            const data = await response.json();
            msg += data;
          } catch (e) {
            console.log("Error fetching data:", e);
          }
        }
        for (let i = 0; i < dataDentro.last.index; i++) {
          try {
            const urlIs = urlDentro + i;
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
  console.log("data[0].temp", msg[0].temp);
  console.log("data[0].hum", msg[0].hum);
  return msg;
}

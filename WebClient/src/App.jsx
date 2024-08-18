import "./App.css"

import { useState, useEffect } from "react"
import { getEspData } from "./libs/espData"

function App() {

  const [data, setData] = useState(null)

  useEffect(() => {
    getEspData({ Burl: "esp8266fuera", lastTime: -1}).then((data => {
      setData(data);
    }))
  })

  console.log(data);

  return (
    <div>
      <h1>Hello World!</h1>
      <h2>SysTiempo web client</h2>
    </div>
  )
}

export default App
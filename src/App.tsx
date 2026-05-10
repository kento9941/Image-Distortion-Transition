import { useState } from "react";
import Scene from "./components/scene/scene"
import Buttons from "./components/ui/buttons";

function App() {
  const [effect, setEffect] = useState(0);
  return (
    <main className="flex flex-col items-center justify-center w-[100vw] h-[100vh] gap-[5vh]">
      <Scene effect={effect} />
      <Buttons effect={effect} setEffect={setEffect} />
    </main>
  )
}

export default App;

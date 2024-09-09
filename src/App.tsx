import { Route, Routes } from "react-router-dom";
import Simulator from "./pages/Simulator";
import NewSimulator from "./pages/NewSimulator";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Simulator />} />
      <Route path="/new" element={<NewSimulator />} />
    </Routes>
  );
}

export default App;

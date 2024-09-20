import { BrowserRouter, Routes ,Route } from "react-router-dom";
import Configuration from "./components/Configuration";
import Spliter from "./components/Spliter";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Configuration />} />
        <Route path="/spliter/:entityId" element={<Spliter />} />
      </Routes>
    </BrowserRouter>
  );
}

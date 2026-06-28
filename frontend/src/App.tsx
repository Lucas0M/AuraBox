import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateCapsule from "./pages/CreateCapsule";
import Checkout from "./pages/Checkout";
import ManageCapsule from "./pages/ManageCapsule";
import PublicCapsule from "./pages/PublicCapsule";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/criar" element={<CreateCapsule />} />
        <Route path="/capsulas/:id/checkout" element={<Checkout />} />
        <Route path="/capsulas/:id/gerenciar" element={<ManageCapsule />} />
        <Route path="/c/:slug" element={<PublicCapsule />} />
      </Routes>
    </BrowserRouter>
  );
}

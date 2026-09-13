import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import GuardaRoupa from "./pages/GuardaRoupa";
import Looks from "./pages/Looks";
import Perfil from "./pages/Perfil";
import CriarLook from "./pages/CriarLook";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/closet" element={<GuardaRoupa />} />

        <Route path="/looks" element={<Looks />} />

        <Route path="/perfil" element={<Perfil />} />

        <Route path="/looks/criar" element={<CriarLook />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
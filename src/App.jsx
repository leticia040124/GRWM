import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import GuardaRoupa from "./pages/GuardaRoupa";
import Looks from "./pages/Looks";
import CriarLook from "./pages/CriarLook";
import DetalhesLook from "./pages/DetalhesLook";
import EditarLook from "./pages/EditarLook";
import Perfil from "./pages/Perfil";
import CombinarLook from "./pages/CombinarLook";
import ResultadoLook from "./pages/ResultadoLook";
import Favoritos from "./pages/Favoritos";
import Inspiracao from "./pages/Inspiracao";
import Viagem from "./pages/Viagem";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/closet" element={<GuardaRoupa />} />
        <Route path="/looks" element={<Looks />} />
        <Route path="/looks/criar" element={<CriarLook />} />
        <Route path="/looks/:id/editar" element={<EditarLook />} />
        <Route path="/looks/:id" element={<DetalhesLook />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/montar-look" element={<CombinarLook />} />
        <Route path="/inspiracao" element={<Inspiracao />} />
        <Route path="/montar-look/resultado" element={<ResultadoLook />}/>
        <Route path="/viagem" element={<Viagem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
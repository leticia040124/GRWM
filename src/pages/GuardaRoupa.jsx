import { Link } from "react-router-dom";
import {
  Home,
  Shirt,
  Star,
  Heart,
  Plane,
  Sparkles,
  UserRound,
  Plus,
} from "lucide-react";

import "../App.css";

function GuardaRoupa() {
  return (
    <div className="closet-page">

      {/* SIDEBAR */}
      <aside className="closet-sidebar">

        <div className="closet-brand">
          <span>SEU CLOSET</span>
          <h2>GRWM</h2>
        </div>

        <nav className="closet-nav">

          <Link to="/" className="closet-nav-item">
            <Home size={17} />
            <span>Início</span>
          </Link>

          <Link
            to="/guarda-roupa"
            className="closet-nav-item active"
          >
            <Shirt size={17} />
            <span>Closet</span>
          </Link>

          <Link to="/looks" className="closet-nav-item">
            <Star size={17} />
            <span>Looks</span>
          </Link>

          <Link to="/looks" className="closet-nav-item">
            <Plane size={17} />
            <span>Viagem</span>
          </Link>

          <Link to="/looks" className="closet-nav-item">
            <Heart size={17} />
            <span>Favoritos</span>
          </Link>

          <Link to="/looks" className="closet-nav-item">
            <Sparkles size={17} />
            <span>Inspiração</span>
          </Link>

          <Link to="/perfil" className="closet-nav-item">
            <UserRound size={17} />
            <span>Perfil</span>
          </Link>

        </nav>

        <div className="closet-motto">
          sem limites.
        </div>

      </aside>


      {/* CONTEÚDO */}
      <main className="closet-content">

        <header className="closet-header">

          <div>
            <h1>Closet</h1>
            <p>8 peças cadastradas</p>
          </div>

          <button className="closet-add-button">
            <Plus size={22} />
          </button>

        </header>

      </main>

    </div>
  );
}

export default GuardaRoupa;
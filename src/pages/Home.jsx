import { Link } from "react-router-dom";
import {
  Home as HomeIcon,
  Shirt,
  Star,
  Plane,
  Heart,
  Sparkles,
  UserRound,
  Plus,
  ArrowRight,
} from "lucide-react";

import "../App.css";

function Home() {
  return (
    <div className="dashboard home-screen">
      <aside className="sidebar">
        <Link to="/" className="logo">
          <span className="logo-symbol">◇</span>
          <span className="logo-text">GRWM</span>
        </Link>

        <nav className="sidebar-menu">
          <Link to="/" className="menu-item active">
            <HomeIcon size={17} strokeWidth={1.6} />
            <span>Início</span>
          </Link>

          <Link to="/closet" className="menu-item">
            <Shirt size={17} strokeWidth={1.6} />
            <span>Meu closet</span>
          </Link>

          <Link to="/looks" className="menu-item">
            <Star size={17} strokeWidth={1.6} />
            <span>Looks</span>
          </Link>

          <Link to="/looks" className="menu-item">
            <Plane size={17} strokeWidth={1.6} />
            <span>Viagem</span>
          </Link>

          <Link to="/looks" className="menu-item">
            <Heart size={17} strokeWidth={1.6} />
            <span>Favoritos</span>
          </Link>

          <Link to="/looks" className="menu-item">
            <Sparkles size={17} strokeWidth={1.6} />
            <span>Inspiração</span>
          </Link>

          <Link to="/perfil" className="menu-item">
            <UserRound size={17} strokeWidth={1.6} />
            <span>Perfil</span>
          </Link>
        </nav>

        <div className="sidebar-motto">
          sem limites.
        </div>
      </aside>

      <main className="dashboard-main home-main">
        <header className="topbar">
          <div />

          <div className="profile-mini">
            <div className="profile-avatar">LM</div>
            <span className="profile-arrow">⌄</span>
          </div>
        </header>

        <section className="home-welcome">
          <div className="home-welcome-text">
            <span className="home-eyebrow">GRWM</span>

            <h1>Oi, Loren!</h1>

            <p>Que tal montar um look hoje?</p>
          </div>

          <Link to="/closet" className="home-add-button">
            <Plus size={19} strokeWidth={1.6} />
          </Link>
        </section>

        <section className="home-feature">
          <div className="home-feature-image">
            <div className="home-feature-overlay">
              <span>SEU CLOSET</span>

              <h2>
                Mais possibilidades
                <br />
                começam aqui.
              </h2>

              <Link to="/closet">
                Explorar closet
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="home-feature-info">
            <span className="home-eyebrow">PARA HOJE</span>

            <h2>
              O que você
              <br />
              vai vestir?
            </h2>

            <p>
              Encontre novas combinações usando
              as peças que já fazem parte do seu closet.
            </p>

            <Link to="/looks" className="home-primary-button">
              Criar um look
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-header">
            <div>
              <span className="home-eyebrow">EXPLORE</span>

              <h2>Seus espaços</h2>
            </div>
          </div>

          <div className="home-shortcuts">
            <Link to="/closet" className="home-shortcut">
              <Shirt size={21} strokeWidth={1.5} />

              <div>
                <span>Closet</span>
                <small>Suas peças</small>
              </div>

              <ArrowRight size={14} />
            </Link>

            <Link to="/looks" className="home-shortcut">
              <Sparkles size={21} strokeWidth={1.5} />

              <div>
                <span>Looks</span>
                <small>Suas combinações</small>
              </div>

              <ArrowRight size={14} />
            </Link>

            <Link to="/looks" className="home-shortcut">
              <Heart size={21} strokeWidth={1.5} />

              <div>
                <span>Favoritos</span>
                <small>Seus preferidos</small>
              </div>

              <ArrowRight size={14} />
            </Link>

            <Link to="/looks" className="home-shortcut">
              <Plane size={21} strokeWidth={1.5} />

              <div>
                <span>Viagem</span>
                <small>Planeje seus looks</small>
              </div>

              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
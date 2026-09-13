import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Home as HomeIcon,
  Shirt,
  Star,
  Heart,
  Plane,
  Sparkles,
  UserRound,
  Plus,
  ArrowRight,
  ChevronDown,
  LogOut,
} from "lucide-react";

import "../App.css";

function Home() {
  const location = useLocation();
  const [perfilAberto, setPerfilAberto] = useState(false);

  const menuAtivo = (rota) => {
    return location.pathname === rota ? "closet-nav-item active" : "closet-nav-item";
  };

  return (
    <div className="closet-page home-page">

      {/* SIDEBAR */}
      <aside className="closet-sidebar">

        <Link to="/" className="closet-brand">
          <span>SEU CLOSET</span>
          <h2>GRWM</h2>
        </Link>

        <nav className="closet-nav">

          <Link to="/" className={menuAtivo("/")}>
            <HomeIcon size={17} strokeWidth={1.6} />
            <span>Início</span>
          </Link>

          <Link to="/closet" className={menuAtivo("/closet")}>
            <Shirt size={17} strokeWidth={1.6} />
            <span>Closet</span>
          </Link>

          <Link to="/looks" className={menuAtivo("/looks")}>
            <Star size={17} strokeWidth={1.6} />
            <span>Looks</span>
          </Link>

          <Link to="/looks" className="closet-nav-item">
            <Plane size={17} strokeWidth={1.6} />
            <span>Viagem</span>
          </Link>

          <Link to="/looks" className="closet-nav-item">
            <Heart size={17} strokeWidth={1.6} />
            <span>Favoritos</span>
          </Link>

          <Link to="/looks" className="closet-nav-item">
            <Sparkles size={17} strokeWidth={1.6} />
            <span>Inspiração</span>
          </Link>

          <Link to="/perfil" className={menuAtivo("/perfil")}>
            <UserRound size={17} strokeWidth={1.6} />
            <span>Perfil</span>
          </Link>

        </nav>

        <div className="closet-motto">
          sem limites.
        </div>

      </aside>


      {/* CONTEÚDO */}
      <main className="closet-content home-content">

        {/* TOPO */}
        <header className="home-topbar">

          <div className="home-topbar-space"></div>

          <div className="home-profile-wrapper">

            <button
              className={`home-profile ${
                perfilAberto ? "open" : ""
              }`}
              onClick={() => setPerfilAberto(!perfilAberto)}
            >

              <div className="home-avatar">
                LM
              </div>

              <div className="home-profile-info">
                <strong>Loren</strong>
                <span>Meu perfil</span>
              </div>

              <ChevronDown
                size={15}
                strokeWidth={1.6}
                className="home-profile-chevron"
              />

            </button>


            {perfilAberto && (
              <div className="home-profile-menu">

                <Link
                  to="/perfil"
                  className="home-profile-menu-item"
                  onClick={() => setPerfilAberto(false)}
                >
                  <UserRound size={15} strokeWidth={1.6} />
                  <span>Meu perfil</span>
                </Link>

                <div className="home-profile-menu-divider"></div>

                <Link
                  to="/login"
                  className="home-profile-menu-item logout"
                >
                  <LogOut size={15} strokeWidth={1.6} />
                  <span>Sair</span>
                </Link>

              </div>
            )}

          </div>

        </header>


        {/* BOAS-VINDAS */}
        <section className="home-welcome">

          <div className="home-welcome-text">

            <span className="home-eyebrow">
              GRWM
            </span>

            <h1>
              Oi, Loren!
            </h1>

            <p>
              Que tal montar um look hoje?
            </p>

          </div>

          <Link
            to="/closet"
            className="home-add-button"
            aria-label="Adicionar peça"
          >
            <Plus
              size={19}
              strokeWidth={1.6}
            />
          </Link>

        </section>


        {/* DESTAQUE */}
        <section className="home-feature">

          <div className="home-feature-image">

            <div className="home-feature-overlay">

              <span>
                SEU CLOSET
              </span>

              <h2>
                Mais possibilidades
                <br />
                começam aqui.
              </h2>

              <Link to="/closet">

                Explorar closet

                <ArrowRight
                  size={14}
                  strokeWidth={1.6}
                />

              </Link>

            </div>

          </div>


          <div className="home-feature-info">

            <span className="home-eyebrow">
              PARA HOJE
            </span>

            <h2>
              O que você
              <br />
              vai vestir?
            </h2>

            <p>
              Encontre novas combinações usando
              as peças que já fazem parte do seu closet.
            </p>

            <Link
  to="/montar-look"
  className="home-primary-button"
>
  Montar meu look

  <ArrowRight
    size={15}
    strokeWidth={1.6}
  />
</Link>

          </div>

        </section>


        {/* SEUS ESPAÇOS */}
        <section className="home-section">

          <div className="home-section-header">

            <span className="home-eyebrow">
              EXPLORE
            </span>

            <h2>
              Seus espaços
            </h2>

          </div>


          <div className="home-shortcuts">

            <Link
              to="/closet"
              className="home-shortcut"
            >

              <Shirt
                size={21}
                strokeWidth={1.5}
              />

              <div>
                <span>Closet</span>
                <small>Suas peças</small>
              </div>

              <ArrowRight
                size={14}
                strokeWidth={1.5}
              />

            </Link>


            <Link
  to="/montar-look"
  className="home-shortcut"
>

  <Sparkles
    size={21}
    strokeWidth={1.5}
  />

  <div>
    <span>Montar meu look</span>
    <small>Crie uma combinação</small>
  </div>

  <ArrowRight
    size={14}
    strokeWidth={1.5}
  />

</Link>


            <Link
              to="/looks"
              className="home-shortcut"
            >

              <Heart
                size={21}
                strokeWidth={1.5}
              />

              <div>
                <span>Favoritos</span>
                <small>Seus preferidos</small>
              </div>

              <ArrowRight
                size={14}
                strokeWidth={1.5}
              />

            </Link>


            <Link
              to="/looks"
              className="home-shortcut"
            >

              <Plane
                size={21}
                strokeWidth={1.5}
              />

              <div>
                <span>Viagem</span>
                <small>Planeje seus looks</small>
              </div>

              <ArrowRight
                size={14}
                strokeWidth={1.5}
              />

            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Home;
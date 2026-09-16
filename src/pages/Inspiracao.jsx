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
  Search,
  X,
  ArrowRight,
} from "lucide-react";

import "../App.css";

function Inspiracao() {
  const location = useLocation();

  const [filtroAtivo, setFiltroAtivo] = useState("Todos");
  const [busca, setBusca] = useState("");

  const filtros = [
    "Todos",
    "Minimalista",
    "Elegante",
    "Casual",
    "Street",
    "Romântico",
  ];

  const referencias = [
    {
      id: 1,
      titulo: "Minimalismo urbano",
      estilo: "Minimalista",
      ocasiao: "Dia a dia",
      imagem:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      titulo: "Elegância sem esforço",
      estilo: "Elegante",
      ocasiao: "Trabalho",
      imagem:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 3,
      titulo: "Casual essencial",
      estilo: "Casual",
      ocasiao: "Passeio",
      imagem:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 4,
      titulo: "Street moderno",
      estilo: "Street",
      ocasiao: "Dia a dia",
      imagem:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 5,
      titulo: "Romântico contemporâneo",
      estilo: "Romântico",
      ocasiao: "Encontro",
      imagem:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 6,
      titulo: "Clássico atual",
      estilo: "Elegante",
      ocasiao: "Evento",
      imagem:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  const menuAtivo = (rota) => {
    return location.pathname === rota
      ? "closet-nav-item active"
      : "closet-nav-item";
  };

  const referenciasFiltradas = referencias.filter((referencia) => {
    const correspondeFiltro =
      filtroAtivo === "Todos" ||
      referencia.estilo === filtroAtivo;

    const correspondeBusca =
      `${referencia.titulo} ${referencia.estilo} ${referencia.ocasiao}`
        .toLowerCase()
        .includes(busca.toLowerCase());

    return correspondeFiltro && correspondeBusca;
  });

  return (
    <div className="closet-page inspiration-page">

      {/* SIDEBAR */}
      <aside className="closet-sidebar">

        <Link to="/home" className="closet-brand">
          <span>SEU CLOSET</span>
          <h2>GRWM</h2>
        </Link>

        <nav className="closet-nav">

          <Link to="/home" className={menuAtivo("/home")}>
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

          <Link to="/viagem" className="closet-nav-item">
            <Plane size={17} strokeWidth={1.6} />
            <span>Viagem</span>
          </Link>

          <Link to="/favoritos" className="closet-nav-item">
            <Heart size={17} strokeWidth={1.6} />
            <span>Favoritos</span>
          </Link>

          <Link
            to="/inspiracao"
            className="closet-nav-item active"
          >
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
      <main className="closet-content inspiration-content">

        <header className="inspiration-header">

          <div>
            <span className="home-eyebrow">
              ENCONTRE SEU ESTILO
            </span>

            <h1>
              Inspiração
            </h1>

            <p>
              Referências para transformar suas ideias
              em novos looks.
            </p>
          </div>

          <div className="inspiration-header-mark">
            <Sparkles size={20} strokeWidth={1.2} />
          </div>

        </header>


        {/* BUSCA */}
        <div className="inspiration-toolbar">

          <div className="inspiration-filters">

            {filtros.map((filtro) => (
              <button
                key={filtro}
                type="button"
                className={
                  filtroAtivo === filtro
                    ? "inspiration-filter active"
                    : "inspiration-filter"
                }
                onClick={() => setFiltroAtivo(filtro)}
              >
                {filtro}
              </button>
            ))}

          </div>

          <div
            className={`inspiration-search ${
              busca ? "has-value" : ""
            }`}
          >
            <Search size={15} strokeWidth={1.6} />

            <input
              type="text"
              placeholder="Buscar inspiração..."
              value={busca}
              onChange={(event) =>
                setBusca(event.target.value)
              }
            />

            {busca && (
              <button
                type="button"
                className="inspiration-search-clear"
                onClick={() => setBusca("")}
                aria-label="Limpar busca"
              >
                <X size={13} />
              </button>
            )}
          </div>

        </div>


        {/* MURAL */}
        <section className="inspiration-section">

          {referenciasFiltradas.length > 0 ? (

            <div className="inspiration-grid">

              {referenciasFiltradas.map((referencia) => (

                <article
                  className="inspiration-card"
                  key={referencia.id}
                >

                  <div className="inspiration-image">

                    <img
                      src={referencia.imagem}
                      alt={referencia.titulo}
                    />

                    <button
                      type="button"
                      className="inspiration-heart"
                      aria-label={`Favoritar ${referencia.titulo}`}
                    >
                      <Heart
                        size={15}
                        strokeWidth={1.5}
                      />
                    </button>

                    <div className="inspiration-image-overlay">
                      <span>
                        Ver inspiração
                      </span>

                      <ArrowRight size={13} />
                    </div>

                  </div>

                  <div className="inspiration-card-info">

                    <div>
                      <span>
                        {referencia.estilo}
                      </span>

                      <h2>
                        {referencia.titulo}
                      </h2>

                      <p>
                        {referencia.ocasiao}
                      </p>
                    </div>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="inspiration-empty">

              <div className="inspiration-empty-icon">
                <Sparkles
                  size={21}
                  strokeWidth={1.3}
                />
              </div>

              <span>
                INSPIRAÇÃO
              </span>

              <h2>
                Nada encontrado.
              </h2>

              <p>
                Tente buscar outro termo ou escolher
                outro estilo.
              </p>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Inspiracao;
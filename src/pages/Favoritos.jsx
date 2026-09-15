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
  ArrowRight,
  X,
} from "lucide-react";

import "../App.css";

function Favoritos() {
  const location = useLocation();

  const [abaAtiva, setAbaAtiva] = useState("pecas");
  const [busca, setBusca] = useState("");

  const [pecas, setPecas] = useState([
    {
      id: 1,
      nome: "Camiseta branca",
      categoria: "Blusas",
      imagem:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      nome: "Blazer preto",
      categoria: "Casacos",
      imagem:
        "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      nome: "Jeans reto",
      categoria: "Calças",
      imagem:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 4,
      nome: "Tênis branco",
      categoria: "Calçados",
      imagem:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    },
  ]);

  const looks = [
    {
      id: 1,
      nome: "Casual de domingo",
      ocasiao: "Casual",
      imagem:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      nome: "Minimalista",
      ocasiao: "Passeio",
      imagem:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 3,
      nome: "Office look",
      ocasiao: "Trabalho",
      imagem:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  const menuAtivo = (rota) => {
    return location.pathname === rota
      ? "closet-nav-item active"
      : "closet-nav-item";
  };

  const removerPeca = (id) => {
    setPecas((atual) =>
      atual.filter((peca) => peca.id !== id)
    );
  };

  const pecasFiltradas = pecas.filter((peca) =>
    `${peca.nome} ${peca.categoria}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  const looksFiltrados = looks.filter((look) =>
    `${look.nome} ${look.ocasiao}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  return (
    <div className="closet-page favorites-page">

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

          <Link to="/favoritos"
            className={menuAtivo("/favoritos")}>
            <Heart size={17} strokeWidth={1.6} />
            <span>Favoritos</span>
          </Link>

          <Link to="/inspiracao" className="closet-nav-item">
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
      <main className="closet-content favorites-content">

        {/* HEADER */}
        <header className="favorites-header">

          <div>
            <span className="home-eyebrow">
              O QUE VOCÊ AMA
            </span>

            <h1>
              Favoritos
            </h1>

            <p>
              Tudo aquilo que você escolheu guardar.
            </p>
          </div>

          <div className="favorites-count">
            <strong>
              {abaAtiva === "pecas"
                ? pecas.length
                : looks.length}
            </strong>

            <span>
              {abaAtiva === "pecas"
                ? "peças salvas"
                : "looks salvos"}
            </span>
          </div>

        </header>


        {/* TOOLBAR */}
        <div className="favorites-toolbar">

          <div className="favorites-tabs">

            <button
              type="button"
              className={
                abaAtiva === "pecas"
                  ? "favorites-tab active"
                  : "favorites-tab"
              }
              onClick={() => setAbaAtiva("pecas")}
            >
              Peças
            </button>

            <button
              type="button"
              className={
                abaAtiva === "looks"
                  ? "favorites-tab active"
                  : "favorites-tab"
              }
              onClick={() => setAbaAtiva("looks")}
            >
              Looks
            </button>

          </div>


          <div
            className={`favorites-search ${
              busca ? "has-value" : ""
            }`}
          >

            <Search
              size={15}
              strokeWidth={1.6}
            />

            <input
              type="text"
              placeholder={
                abaAtiva === "pecas"
                  ? "Buscar peça..."
                  : "Buscar look..."
              }
              value={busca}
              onChange={(event) =>
                setBusca(event.target.value)
              }
            />

            {busca && (
              <button
                type="button"
                className="favorites-search-clear"
                onClick={() => setBusca("")}
                aria-label="Limpar busca"
              >
                <X size={13} />
              </button>
            )}

          </div>

        </div>


        {/* PEÇAS */}
        {abaAtiva === "pecas" && (

          <section className="favorites-section">

            {pecasFiltradas.length > 0 ? (

              <div className="favorites-grid">

                {pecasFiltradas.map((peca) => (

                  <article
                    className="favorite-piece-card"
                    key={peca.id}
                  >

                    <div className="favorite-piece-image">

                      <img
                        src={peca.imagem}
                        alt={peca.nome}
                      />

                      <button
                        type="button"
                        className="favorite-heart active"
                        onClick={() =>
                          removerPeca(peca.id)
                        }
                        aria-label={`Remover ${peca.nome} dos favoritos`}
                      >
                        <Heart
                          size={15}
                          fill="currentColor"
                          strokeWidth={1.5}
                        />
                      </button>

                    </div>


                    <div className="favorite-piece-info">

                      <div>
                        <h3>
                          {peca.nome}
                        </h3>

                        <span>
                          {peca.categoria}
                        </span>
                      </div>

                      <ArrowRight
                        size={14}
                        strokeWidth={1.5}
                      />

                    </div>

                  </article>

                ))}

              </div>

            ) : (

              <div className="favorites-empty">

                <div className="favorites-empty-icon">
                  <Heart
                    size={21}
                    strokeWidth={1.4}
                  />
                </div>

                <span>
                  FAVORITOS
                </span>

                <h2>
                  Nada por aqui ainda.
                </h2>

                <p>
                  {busca
                    ? "Não encontramos nenhum favorito com essa busca."
                    : "Salve suas peças preferidas para encontrar tudo em um só lugar."}
                </p>

                {!busca && (
                  <Link
                    to="/closet"
                    className="favorites-empty-button"
                  >
                    Explorar closet
                    <ArrowRight size={13} />
                  </Link>
                )}

              </div>

            )}

          </section>

        )}


        {/* LOOKS */}
        {abaAtiva === "looks" && (

          <section className="favorites-section">

            {looksFiltrados.length > 0 ? (

              <div className="favorites-looks-grid">

                {looksFiltrados.map((look) => (

                  <article
                    className="favorite-look-card"
                    key={look.id}
                  >

                    <div className="favorite-look-image">

                      <img
                        src={look.imagem}
                        alt={look.nome}
                      />

                      <button
                        type="button"
                        className="favorite-heart active"
                        aria-label={`Remover ${look.nome} dos favoritos`}
                      >
                        <Heart
                          size={15}
                          fill="currentColor"
                          strokeWidth={1.5}
                        />
                      </button>

                    </div>


                    <div className="favorite-look-info">

                      <div>

                        <span>
                          {look.ocasiao}
                        </span>

                        <h3>
                          {look.nome}
                        </h3>

                      </div>

                      <ArrowRight
                        size={14}
                        strokeWidth={1.5}
                      />

                    </div>

                  </article>

                ))}

              </div>

            ) : (

              <div className="favorites-empty">

                <div className="favorites-empty-icon">
                  <Heart
                    size={21}
                    strokeWidth={1.4}
                  />
                </div>

                <span>
                  LOOKS FAVORITOS
                </span>

                <h2>
                  Nada por aqui ainda.
                </h2>

                <p>
                  Salve seus looks preferidos para
                  acessá-los rapidamente.
                </p>

              </div>

            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default Favoritos;
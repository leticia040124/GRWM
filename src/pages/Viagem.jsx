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
  MapPin,
  CalendarDays,
  ChevronRight,
  X,
} from "lucide-react";

import "../App.css";

function Viagem() {
  const location = useLocation();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [viagens, setViagens] = useState([
    {
      id: 1,
      destino: "Rio de Janeiro",
      data: "12 — 16 OUT",
      descricao: "Fim de semana na praia",
    },
    {
      id: 2,
      destino: "São Paulo",
      data: "03 — 07 NOV",
      descricao: "Viagem de trabalho",
    },
  ]);

  const [novaViagem, setNovaViagem] = useState({
    destino: "",
    data: "",
    descricao: "",
  });

  const menuAtivo = (rota) => {
    return location.pathname === rota
      ? "closet-nav-item active"
      : "closet-nav-item";
  };

  const criarViagem = (event) => {
    event.preventDefault();

    if (!novaViagem.destino.trim()) {
      return;
    }

    const viagem = {
      id: Date.now(),
      destino: novaViagem.destino,
      data: novaViagem.data || "A DEFINIR",
      descricao:
        novaViagem.descricao || "Nova viagem",
    };

    setViagens((atual) => [...atual, viagem]);

    setNovaViagem({
      destino: "",
      data: "",
      descricao: "",
    });

    setMostrarFormulario(false);
  };

  return (
    <div className="closet-page travel-page">

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

          <Link
            to="/closet"
            className={menuAtivo("/closet")}
          >
            <Shirt size={17} strokeWidth={1.6} />
            <span>Closet</span>
          </Link>

          <Link
            to="/looks"
            className={menuAtivo("/looks")}
          >
            <Star size={17} strokeWidth={1.6} />
            <span>Looks</span>
          </Link>

          <Link
            to="/viagem"
            className="closet-nav-item active"
          >
            <Plane size={17} strokeWidth={1.6} />
            <span>Viagem</span>
          </Link>

          <Link
            to="/favoritos"
            className="closet-nav-item"
          >
            <Heart size={17} strokeWidth={1.6} />
            <span>Favoritos</span>
          </Link>

          <Link
            to="/inspiracao"
            className="closet-nav-item"
          >
            <Sparkles size={17} strokeWidth={1.6} />
            <span>Inspiração</span>
          </Link>

          <Link
            to="/perfil"
            className={menuAtivo("/perfil")}
          >
            <UserRound size={17} strokeWidth={1.6} />
            <span>Perfil</span>
          </Link>

        </nav>

        <div className="closet-motto">
          sem limites.
        </div>

      </aside>


      {/* CONTEÚDO */}
      <main className="closet-content travel-content">

        <header className="travel-header">

          <div>
            <span className="home-eyebrow">
              ORGANIZE SUAS AVENTURAS
            </span>

            <h1>
              Viagem
            </h1>

            <p>
              Planeje seus looks de acordo com cada destino.
            </p>
          </div>

          <button
            type="button"
            className="travel-add-button"
            onClick={() => setMostrarFormulario(true)}
          >
            <Plus size={15} />
            Nova viagem
          </button>

        </header>


        {/* RESUMO */}
        <section className="travel-summary">

          <div className="travel-summary-card">
            <span>VIAGENS</span>
            <strong>{viagens.length}</strong>
            <p>planejadas</p>
          </div>

          <div className="travel-summary-card">
            <span>PRÓXIMA</span>
            <strong>
              {viagens.length > 0
                ? viagens[0].destino
                : "—"}
            </strong>
            <p>
              {viagens.length > 0
                ? viagens[0].data
                : "Nenhuma viagem"}
            </p>
          </div>

          <div className="travel-summary-note">
            <Plane size={17} strokeWidth={1.3} />
            <div>
              <span>SEU CLOSET, ONDE QUER QUE VOCÊ VÁ</span>
              <p>
                Crie uma viagem e depois escolha
                os looks que quer levar.
              </p>
            </div>
          </div>

        </section>


        {/* LISTA */}
        <section className="travel-section">

          <div className="travel-section-heading">
            <div>
              <span>SEUS DESTINOS</span>
              <h2>
                Próximas viagens
              </h2>
            </div>

            <span className="travel-section-count">
              {viagens.length} {viagens.length === 1 ? "viagem" : "viagens"}
            </span>
          </div>


          {viagens.length > 0 ? (

            <div className="travel-list">

              {viagens.map((viagem) => (

                <article
                  className="travel-card"
                  key={viagem.id}
                >

                  <div className="travel-card-icon">
                    <MapPin
                      size={19}
                      strokeWidth={1.3}
                    />
                  </div>

                  <div className="travel-card-main">

                    <span>
                      {viagem.data}
                    </span>

                    <h3>
                      {viagem.destino}
                    </h3>

                    <p>
                      {viagem.descricao}
                    </p>

                  </div>

                  <button
                    type="button"
                    className="travel-card-action"
                    aria-label={`Abrir viagem para ${viagem.destino}`}
                  >
                    <ChevronRight size={17} />
                  </button>

                </article>

              ))}

            </div>

          ) : (

            <div className="travel-empty">

              <div className="travel-empty-icon">
                <Plane
                  size={21}
                  strokeWidth={1.3}
                />
              </div>

              <span>
                SUAS VIAGENS
              </span>

              <h2>
                Nenhuma viagem planejada.
              </h2>

              <p>
                Crie sua primeira viagem para
                começar a montar seus looks.
              </p>

              <button
                type="button"
                className="travel-empty-button"
                onClick={() => setMostrarFormulario(true)}
              >
                Criar viagem
                <Plus size={13} />
              </button>

            </div>

          )}

        </section>


        {/* FORMULÁRIO */}
        {mostrarFormulario && (

          <div
            className="travel-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget
              ) {
                setMostrarFormulario(false);
              }
            }}
          >

            <div className="travel-modal">

              <button
                type="button"
                className="travel-modal-close"
                onClick={() => setMostrarFormulario(false)}
                aria-label="Fechar"
              >
                <X size={17} />
              </button>

              <div className="travel-modal-heading">
                <span>NOVA VIAGEM</span>
                <h2>
                  Para onde vamos?
                </h2>
                <p>
                  Cadastre seu destino para organizar
                  os looks que você quer levar.
                </p>
              </div>

              <form
                className="travel-form"
                onSubmit={criarViagem}
              >

                <div className="travel-field">
                  <label htmlFor="destino">
                    Destino
                  </label>

                  <div className="travel-input-wrapper">
                    <MapPin size={14} />

                    <input
                      id="destino"
                      type="text"
                      placeholder="Ex.: Rio de Janeiro"
                      value={novaViagem.destino}
                      onChange={(event) =>
                        setNovaViagem({
                          ...novaViagem,
                          destino: event.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>


                <div className="travel-field">
                  <label htmlFor="data">
                    Data
                  </label>

                  <div className="travel-input-wrapper">
                    <CalendarDays size={14} />

                    <input
                      id="data"
                      type="text"
                      placeholder="Ex.: 12 — 16 OUT"
                      value={novaViagem.data}
                      onChange={(event) =>
                        setNovaViagem({
                          ...novaViagem,
                          data: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>


                <div className="travel-field">
                  <label htmlFor="descricao">
                    Descrição
                  </label>

                  <input
                    id="descricao"
                    type="text"
                    placeholder="Ex.: Fim de semana na praia"
                    value={novaViagem.descricao}
                    onChange={(event) =>
                      setNovaViagem({
                        ...novaViagem,
                        descricao: event.target.value,
                      })
                    }
                  />
                </div>


                <button
                  type="submit"
                  className="travel-form-submit"
                >
                  Criar viagem
                  <ArrowRight size={14} />
                </button>

              </form>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default Viagem;
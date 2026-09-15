import { useState } from "react";
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
  MapPin,
  CalendarDays,
  Luggage,
  ChevronRight,
  X,
} from "lucide-react";

const viagensIniciais = [
  {
    id: 1,
    destino: "Rio de Janeiro",
    periodo: "12 — 16 OUT",
    descricao: "Fim de semana na praia",
    dias: 5,
    looks: 3,
    planejados: 3,
    imagem:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    destino: "São Paulo",
    periodo: "03 — 07 NOV",
    descricao: "Viagem de trabalho",
    dias: 5,
    looks: 2,
    planejados: 1,
    imagem:
      "https://images.unsplash.com/photo-1543059080-f9b1272213d5?auto=format&fit=crop&w=1200&q=80",
  },
];

function Viagem() {
  const [viagens, setViagens] = useState(viagensIniciais);
  const [modalAberto, setModalAberto] = useState(false);

  const [form, setForm] = useState({
    destino: "",
    inicio: "",
    fim: "",
    descricao: "",
  });

  const totalLooks = viagens.reduce(
    (total, viagem) => total + viagem.looks,
    0
  );

  const totalPlanejados = viagens.reduce(
    (total, viagem) => total + viagem.planejados,
    0
  );

  const abrirModal = () => {
    setForm({
      destino: "",
      inicio: "",
      fim: "",
      descricao: "",
    });

    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const criarViagem = (event) => {
    event.preventDefault();

    if (!form.destino || !form.inicio || !form.fim) return;

    const novaViagem = {
      id: Date.now(),
      destino: form.destino,
      periodo: `${form.inicio} — ${form.fim}`,
      descricao: form.descricao || "Nova viagem",
      dias: 5,
      looks: 0,
      planejados: 0,
      imagem:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
    };

    setViagens((atual) => [...atual, novaViagem]);
    fecharModal();
  };

  return (
    <div className="closet-page travel-page">
      <aside className="closet-sidebar">
        <Link to="/home" className="closet-brand">
          <span>SEU CLOSET</span>
          <h2>GRWM</h2>
        </Link>

        <nav className="closet-nav">
          <Link to="/home" className="closet-nav-item">
            <Home size={17} strokeWidth={1.6} />
            <span>Início</span>
          </Link>

          <Link to="/closet" className="closet-nav-item">
            <Shirt size={17} strokeWidth={1.6} />
            <span>Closet</span>
          </Link>

          <Link to="/looks" className="closet-nav-item">
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

          <Link to="/favoritos" className="closet-nav-item">
            <Heart size={17} strokeWidth={1.6} />
            <span>Favoritos</span>
          </Link>

          <Link to="/inspiracao" className="closet-nav-item">
            <Sparkles size={17} strokeWidth={1.6} />
            <span>Inspiração</span>
          </Link>

          <Link to="/perfil" className="closet-nav-item">
            <UserRound size={17} strokeWidth={1.6} />
            <span>Perfil</span>
          </Link>
        </nav>

        <div className="closet-sidebar-footer">
          <span>sem limites.</span>
        </div>
      </aside>

      <main className="closet-content travel-content">
        <header className="travel-header">
          <div>
            <span className="travel-eyebrow">
              PLANEJAMENTO
            </span>

            <h1>Viagens</h1>

            <p>
              Organize seus looks e planeje o que levar
              para cada destino.
            </p>
          </div>

          <button
            type="button"
            className="travel-add-button"
            onClick={abrirModal}
          >
            <Plus size={16} strokeWidth={1.8} />
            Nova viagem
          </button>
        </header>

        <section className="travel-summary">
          <div className="travel-summary-card">
            <Plane size={18} strokeWidth={1.5} />

            <div>
              <span>VIAGENS</span>
              <strong>{viagens.length}</strong>
            </div>
          </div>

          <div className="travel-summary-card">
            <Luggage size={18} strokeWidth={1.5} />

            <div>
              <span>LOOKS PLANEJADOS</span>
              <strong>{totalPlanejados}</strong>
            </div>
          </div>

          <div className="travel-summary-card">
            <Star size={18} strokeWidth={1.5} />

            <div>
              <span>LOOKS ORGANIZADOS</span>
              <strong>{totalLooks}</strong>
            </div>
          </div>
        </section>

        <div className="travel-section-heading">
          <div>
            <span>SEU PLANEJAMENTO</span>
            <h2>Próximas viagens</h2>
          </div>

          <small>
            {viagens.length}{" "}
            {viagens.length === 1 ? "viagem" : "viagens"}
          </small>
        </div>

        <section className="travel-grid">
          {viagens.map((viagem) => {
            const progresso =
              viagem.looks > 0
                ? Math.round(
                    (viagem.planejados / viagem.looks) * 100
                  )
                : 0;

            return (
              <article className="travel-card" key={viagem.id}>
                <div className="travel-card-image">
                  <img
                    src={viagem.imagem}
                    alt={viagem.destino}
                  />

                  <div className="travel-card-gradient" />

                  <span className="travel-period">
                    {viagem.periodo}
                  </span>

                  <div className="travel-destination">
                    <MapPin
                      size={14}
                      strokeWidth={1.6}
                    />
                    <span>{viagem.destino}</span>
                  </div>
                </div>

                <div className="travel-card-content">
                  <div className="travel-card-title">
                    <div>
                      <span>{viagem.dias} DIAS</span>
                      <h3>{viagem.descricao}</h3>
                    </div>

                    <button
                      type="button"
                      className="travel-arrow"
                      aria-label={`Abrir viagem para ${viagem.destino}`}
                    >
                      <ChevronRight
                        size={17}
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>

                  <div className="travel-meta">
                    <span>
                      <Shirt size={14} strokeWidth={1.5} />
                      {viagem.looks} looks
                    </span>

                    <span>
                      <CalendarDays
                        size={14}
                        strokeWidth={1.5}
                      />
                      {viagem.planejados} planejados
                    </span>
                  </div>

                  <div className="travel-progress">
                    <div>
                      <span>Planejamento</span>
                      <strong>{progresso}%</strong>
                    </div>

                    <div className="travel-progress-track">
                      <span
                        style={{
                          width: `${progresso}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="travel-plan-button"
                  >
                    <Luggage
                      size={14}
                      strokeWidth={1.6}
                    />
                    Planejar looks
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      {modalAberto && (
        <div
          className="travel-modal-overlay"
          onClick={fecharModal}
        >
          <div
            className="travel-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="travel-modal-close"
              onClick={fecharModal}
              aria-label="Fechar"
            >
              <X size={17} strokeWidth={1.5} />
            </button>

            <span className="travel-eyebrow">
              NOVA VIAGEM
            </span>

            <h2>Planeje seu próximo destino.</h2>

            <form onSubmit={criarViagem}>
              <label>
                Destino
                <input
                  type="text"
                  placeholder="Ex.: Salvador"
                  value={form.destino}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      destino: event.target.value,
                    })
                  }
                />
              </label>

              <div className="travel-form-row">
                <label>
                  Ida
                  <input
                    type="text"
                    placeholder="12 OUT"
                    value={form.inicio}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        inicio: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Volta
                  <input
                    type="text"
                    placeholder="16 OUT"
                    value={form.fim}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        fim: event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <label>
                Descrição
                <input
                  type="text"
                  placeholder="Ex.: Fim de semana na praia"
                  value={form.descricao}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      descricao: event.target.value,
                    })
                  }
                />
              </label>

              <button
                type="submit"
                className="travel-form-submit"
              >
                Criar viagem
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Viagem;
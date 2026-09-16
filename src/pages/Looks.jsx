import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home as HomeIcon,
  Shirt,
  Star,
  Heart,
  Plane,
  Sparkles,
  UserRound,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";


const looksIniciais = [
  {
    id: 1,
    nome: "Casual de domingo",
    ocasiao: "Casual",
    pecas: ["Camiseta branca", "Jeans reto", "Tênis branco"],
    imagem:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    favorito: true,
  },
  {
    id: 2,
    nome: "Noite especial",
    ocasiao: "Noite",
    pecas: ["Blazer preto", "Calça alfaiataria", "Bota preta"],
    imagem:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
    favorito: false,
  },
  {
    id: 3,
    nome: "Dia leve",
    ocasiao: "Passeio",
    pecas: ["Blusa bege", "Calça jeans", "Tênis casual"],
    imagem:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    favorito: false,
  },
  {
    id: 4,
    nome: "Produção elegante",
    ocasiao: "Evento",
    pecas: ["Camisa branca", "Calça preta", "Sapato social"],
    imagem:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
    favorito: true,
  },
];

const categorias = ["Todos", "Favoritos", "Recentes", "Casual", "Noite", "Evento"];

function Looks() {
  const location = useLocation();
  const navigate = useNavigate();

  const [looks, setLooks] = useState(looksIniciais);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [lookSelecionado, setLookSelecionado] = useState(null);
  const [menuAberto, setMenuAberto] = useState(null);

  const menuAtivo = (rota) => {
    return location.pathname === rota ? "active" : "";
  };

  const alternarFavorito = (id) => {
    setLooks((looksAtuais) =>
      looksAtuais.map((look) =>
        look.id === id
          ? { ...look, favorito: !look.favorito }
          : look
      )
    );

    if (lookSelecionado?.id === id) {
      setLookSelecionado((lookAtual) => ({
        ...lookAtual,
        favorito: !lookAtual.favorito,
      }));
    }
  };

  const excluirLook = (id) => {
    setLooks((looksAtuais) =>
      looksAtuais.filter((look) => look.id !== id)
    );

    setLookSelecionado(null);
    setMenuAberto(null);
  };

  const looksFiltrados = looks.filter((look) => {
    if (categoriaAtiva === "Todos") return true;

    if (categoriaAtiva === "Favoritos") {
      return look.favorito;
    }

    if (categoriaAtiva === "Recentes") {
      return look.id <= 3;
    }

    return look.ocasiao === categoriaAtiva;
  });

  return (
    <div className="closet-page">
      {/* SIDEBAR */}
     {/* SIDEBAR */}
<aside className="closet-sidebar">

  <Link to="/home" className="closet-brand">
    <span>SEU CLOSET</span>
    <h2>GRWM</h2>
  </Link>

  <nav className="closet-nav">

    <Link
      to="/home"
      className={`closet-nav-item ${menuAtivo("/home ")}`}
    >
      <HomeIcon size={17} strokeWidth={1.6} />
      <span>Início</span>
    </Link>

    <Link
      to="/closet"
      className={`closet-nav-item ${menuAtivo("/closet")}`}
    >
      <Shirt size={17} strokeWidth={1.6} />
      <span>Closet</span>
    </Link>

    <Link
      to="/looks"
      className={`closet-nav-item ${menuAtivo("/looks")}`}
    >
      <Star size={17} strokeWidth={1.6} />
      <span>Looks</span>
    </Link>

    <Link
      to="/viagem"
      className="closet-nav-item"
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
      className={`closet-nav-item ${menuAtivo("/perfil")}`}
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
      <main className="closet-content looks-page">
        <header className="looks-header">
          <div>
            <span className="home-eyebrow">SEU ESTILO</span>

            <h1>Looks</h1>

            <p>
              Suas combinações favoritas, organizadas em um só lugar.
            </p>
          </div>

          <div className="looks-header-actions">

  <Link
    to="/montar-look"
    className="looks-ai-button"
  >
    <Sparkles size={15} strokeWidth={1.7} />
    Montar meu look
  </Link>

  <Link
    to="/looks/criar"
    className="looks-create-button"
  >
    <Plus size={16} strokeWidth={2} />
    Criar look
  </Link>

</div>
        </header>

        {/* FILTROS */}
        <div className="looks-filters">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              className={
                categoriaAtiva === categoria
                  ? "looks-filter active"
                  : "looks-filter"
              }
              onClick={() => setCategoriaAtiva(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>

        {/* CONTADOR */}
        <div className="looks-count">
          <span>
            {looksFiltrados.length}{" "}
            {looksFiltrados.length === 1 ? "look" : "looks"}
          </span>
        </div>

        {/* GRID */}
        <section className="looks-grid">
          {looksFiltrados.length > 0 ? (
            looksFiltrados.map((look) => (
              <article
                key={look.id}
                className="look-card"
                onClick={() => navigate(`/looks/${look.id}`)}
              >
                <div className="look-photo">
                  <img src={look.imagem} alt={look.nome} />

                  <div className="look-photo-overlay" />

                  <button
                    type="button"
                    className={
                      look.favorito
                        ? "look-favorite favorited"
                        : "look-favorite"
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      alternarFavorito(look.id);
                    }}
                    aria-label="Favoritar look"
                  >
                    <Heart
                      size={15}
                      fill={look.favorito ? "currentColor" : "none"}
                      strokeWidth={1.7}
                    />
                  </button>

                  <span className="look-occasion">
                    {look.ocasiao}
                  </span>
                </div>

                <div className="look-card-info">
                  <div>
                    <h2>{look.nome}</h2>

                    <p>{look.pecas.length} peças</p>
                  </div>

                  <button
                    type="button"
                    className="look-more"
                    onClick={(event) => {
                      event.stopPropagation();
                      setMenuAberto(
                        menuAberto === look.id ? null : look.id
                      );
                    }}
                    aria-label="Mais opções"
                  >
                    <MoreHorizontal size={17} />
                  </button>

                  {menuAberto === look.id && (
                    <div className="look-card-menu">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setLookSelecionado(look);
                          setMenuAberto(null);
                        }}
                      >
                        <Pencil size={13} />
                        Visualizar
                      </button>

                      <button
                        type="button"
                        className="danger"
                        onClick={(event) => {
                          event.stopPropagation();
                          excluirLook(look.id);
                        }}
                      >
                        <Trash2 size={13} />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="looks-empty">
              <div className="looks-empty-icon">
                <Sparkles size={21} strokeWidth={1.4} />
              </div>

              <span>SEM LOOKS AQUI</span>

              <h2>Nada encontrado</h2>

              <p>
                Ainda não existem looks nessa categoria.
                Crie uma nova combinação para começar.
              </p>

              <Link to="/looks/criar">
                <Plus size={14} />
                Criar primeiro look
              </Link>
            </div>
          )}
        </section>
      </main>

      {/* MODAL DE DETALHES */}
      {lookSelecionado && (
        <div
          className="look-modal-overlay"
          onClick={() => setLookSelecionado(null)}
        >
          <div
            className="look-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="look-modal-close"
              onClick={() => setLookSelecionado(null)}
              aria-label="Fechar"
            >
              <X size={18} />
            </button>

            <div className="look-modal-image">
              <img
                src={lookSelecionado.imagem}
                alt={lookSelecionado.nome}
              />
            </div>

            <div className="look-modal-content">
              <span className="look-modal-eyebrow">
                {lookSelecionado.ocasiao}
              </span>

              <h2>{lookSelecionado.nome}</h2>

              <div className="look-modal-divider" />

              <span className="look-modal-label">
                PEÇAS DO LOOK
              </span>

              <div className="look-pieces">
                {lookSelecionado.pecas.map((peca) => (
                  <div className="look-piece" key={peca}>
                    <Check size={13} />
                    <span>{peca}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={
                  lookSelecionado.favorito
                    ? "look-modal-favorite active"
                    : "look-modal-favorite"
                }
                onClick={() =>
                  alternarFavorito(lookSelecionado.id)
                }
              >
                <Heart
                  size={14}
                  fill={
                    lookSelecionado.favorito
                      ? "currentColor"
                      : "none"
                  }
                />

                {lookSelecionado.favorito
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"}
              </button>

              <div className="look-modal-actions">
                <button
                  type="button"
                  className="look-modal-edit"
                >
                  <Pencil size={13} />
                  Editar look
                </button>

                <button
                  type="button"
                  className="look-modal-delete"
                  onClick={() =>
                    excluirLook(lookSelecionado.id)
                  }
                >
                  <Trash2 size={13} />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Looks;
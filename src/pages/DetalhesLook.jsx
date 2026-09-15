import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Home as HomeIcon,
  Shirt,
  Star,
  Heart,
  Plane,
  Sparkles,
  UserRound,
  ArrowLeft,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

const looks = [
  {
    id: "1",
    nome: "Casual de domingo",
    ocasiao: "Casual",
    descricao:
      "Uma combinação leve e confortável para aqueles dias tranquilos.",
    pecas: [
      {
        nome: "Camiseta branca",
        categoria: "Blusas",
        cor: "Branco",
        imagem:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
      },
      {
        nome: "Jeans reto",
        categoria: "Calças",
        cor: "Azul",
        imagem:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
      },
      {
        nome: "Tênis branco",
        categoria: "Calçados",
        cor: "Branco",
        imagem:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
      },
    ],
    imagem:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    favorito: true,
  },
  {
    id: "2",
    nome: "Noite especial",
    ocasiao: "Noite",
    descricao:
      "Uma produção elegante para ocasiões que pedem um toque mais sofisticado.",
    pecas: [
      {
        nome: "Blazer preto",
        categoria: "Casacos",
        cor: "Preto",
        imagem:
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80",
      },
      {
        nome: "Calça alfaiataria",
        categoria: "Calças",
        cor: "Preto",
        imagem:
          "https://images.unsplash.com/photo-1506629905607-d9c297d5d6a1?auto=format&fit=crop&w=700&q=80",
      },
      {
        nome: "Bota preta",
        categoria: "Calçados",
        cor: "Preto",
        imagem:
          "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=700&q=80",
      },
    ],
    imagem:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    favorito: false,
  },
  {
    id: "3",
    nome: "Dia leve",
    ocasiao: "Passeio",
    descricao:
      "Uma combinação simples para aproveitar o dia com conforto e estilo.",
    pecas: [
      {
        nome: "Blusa bege",
        categoria: "Blusas",
        cor: "Bege",
        imagem:
          "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80",
      },
      {
        nome: "Calça jeans",
        categoria: "Calças",
        cor: "Azul",
        imagem:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
      },
      {
        nome: "Tênis casual",
        categoria: "Calçados",
        cor: "Branco",
        imagem:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
      },
    ],
    imagem:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    favorito: false,
  },
  {
    id: "4",
    nome: "Produção elegante",
    ocasiao: "Evento",
    descricao:
      "Uma produção clássica pensada para momentos especiais e eventos.",
    pecas: [
      {
        nome: "Camisa branca",
        categoria: "Blusas",
        cor: "Branco",
        imagem:
          "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=700&q=80",
      },
      {
        nome: "Calça preta",
        categoria: "Calças",
        cor: "Preto",
        imagem:
          "https://images.unsplash.com/photo-1506629905607-d9c297d5d6a1?auto=format&fit=crop&w=700&q=80",
      },
      {
        nome: "Sapato social",
        categoria: "Calçados",
        cor: "Preto",
        imagem:
          "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=700&q=80",
      },
    ],
    imagem:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80",
    favorito: true,
  },
];

function DetalhesLook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalExcluir, setModalExcluir] = useState(false);

  const look = looks.find((item) => item.id === id) || looks[0];

  const menuAtivo = (rota) =>
    window.location.pathname === rota ? "active" : "";

  const alternarFavorito = () => {
    look.favorito = !look.favorito;
  };

  const confirmarExclusao = () => {
    navigate("/looks");
  };

  return (
    <div className="closet-layout">
      <aside className="closet-sidebar">
        <Link to="/" className="closet-brand">
          GRWM
        </Link>

        <nav className="closet-nav">
          <Link
            to="/"
            className={`closet-nav-item ${menuAtivo("/")}`}
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

          <Link to="/favoritos" className="closet-nav-item">
            <Heart size={17} strokeWidth={1.6} />
            <span>Favoritos</span>
          </Link>

          <Link to="/viagem" className="closet-nav-item">
            <Plane size={17} strokeWidth={1.6} />
            <span>Viagem</span>
          </Link>

          <Link to="/inspiracao" className="closet-nav-item">
            <Sparkles size={17} strokeWidth={1.6} />
            <span>Inspiração</span>
          </Link>
        </nav>

        <div className="closet-sidebar-bottom">
          <Link
            to="/perfil"
            className={`closet-nav-item ${menuAtivo("/perfil")}`}
          >
            <UserRound size={17} strokeWidth={1.6} />
            <span>Meu perfil</span>
          </Link>
        </div>
      </aside>

      <main className="closet-content look-details-page">
        <Link to="/looks" className="look-details-back">
          <ArrowLeft size={14} />
          Voltar para looks
        </Link>

        <section className="look-details-hero">
          <div className="look-details-image">
            <img src={look.imagem} alt={look.nome} />
          </div>

          <div className="look-details-info">
            <span className="home-eyebrow">
              {look.ocasiao}
            </span>

            <h1>{look.nome}</h1>

            <p className="look-details-description">
              {look.descricao}
            </p>

            <div className="look-details-meta">
              <div>
                <span>PEÇAS</span>
                <strong>{look.pecas.length}</strong>
              </div>

              <div>
                <span>OCASIÃO</span>
                <strong>{look.ocasiao}</strong>
              </div>
            </div>

            <div className="look-details-buttons">
              <button
                type="button"
                className={
                  look.favorito
                    ? "look-details-favorite active"
                    : "look-details-favorite"
                }
                onClick={alternarFavorito}
              >
                <Heart
                  size={14}
                  fill={look.favorito ? "currentColor" : "none"}
                />

                {look.favorito
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"}
              </button>

              <button
                type="button"
                className="look-details-edit"
                onClick={() => navigate(`/looks/${id}/editar`)}
              >
                <Pencil size={14} />
                Editar look
              </button>

              <button
              type="button"
              className="look-details-delete"
              onClick={() => setModalExcluir(true)}
            >
              <Trash2 size={14} />
              Excluir look
              </button>
            </div>
          </div>
        </section>

        <section className="look-pieces-section">
          <div className="look-pieces-header">
            <div>
              <span>COMPOSIÇÃO</span>
              <h2>Peças deste look</h2>
            </div>

            <small>{look.pecas.length} peças</small>
          </div>

          <div className="look-details-pieces-grid">
            {look.pecas.map((peca) => (
              <article className="look-details-piece" key={peca.nome}>
                <div className="look-details-piece-image">
                  <img src={peca.imagem} alt={peca.nome} />

                  <div className="look-details-piece-check">
                    <Check size={13} />
                  </div>
                </div>

                <div className="look-details-piece-info">
                  <div>
                    <h3>{peca.nome}</h3>
                    <span>{peca.categoria}</span>
                  </div>

                  <strong>{peca.cor}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      {modalExcluir && (
  <div
    className="delete-look-overlay"
    onClick={() => setModalExcluir(false)}
  >
    <div
      className="delete-look-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="delete-look-close"
        onClick={() => setModalExcluir(false)}
        aria-label="Fechar"
      >
        <X size={17} />
      </button>

      <div className="delete-look-icon">
        <Trash2 size={20} strokeWidth={1.5} />
      </div>

      <span className="delete-look-eyebrow">
        EXCLUIR LOOK
      </span>

      <h2>Tem certeza?</h2>

      <p>
        Você está prestes a excluir o look{" "}
        <strong>{look.nome}</strong>.
        <br />
        Essa ação não poderá ser desfeita.
      </p>

      <div className="delete-look-actions">
        <button
          type="button"
          className="delete-look-cancel"
          onClick={() => setModalExcluir(false)}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="delete-look-confirm"
          onClick={confirmarExclusao}
        >
          <Trash2 size={13} />
          Excluir look
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default DetalhesLook;
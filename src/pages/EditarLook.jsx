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
  Search,
  Check,
  X,
  Save,
} from "lucide-react";

const looksIniciais = {
  1: {
    nome: "Casual de domingo",
    ocasiao: "Casual",
    pecas: [1, 2, 3],
  },
  2: {
    nome: "Noite especial",
    ocasiao: "Noite",
    pecas: [4, 5, 8],
  },
  3: {
    nome: "Dia leve",
    ocasiao: "Passeio",
    pecas: [6, 2, 3],
  },
  4: {
    nome: "Produção elegante",
    ocasiao: "Evento",
    pecas: [7, 5, 8],
  },
};

const pecasIniciais = [
  {
    id: 1,
    nome: "Camiseta branca",
    categoria: "Blusas",
    cor: "Branco",
    imagem:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    nome: "Jeans reto",
    categoria: "Calças",
    cor: "Azul",
    imagem:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    nome: "Tênis branco",
    categoria: "Calçados",
    cor: "Branco",
    imagem:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    nome: "Blazer preto",
    categoria: "Casacos",
    cor: "Preto",
    imagem:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 5,
    nome: "Calça preta",
    categoria: "Calças",
    cor: "Preto",
    imagem:
      "https://images.unsplash.com/photo-1506629905607-d9c297d5d6a1?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 6,
    nome: "Blusa bege",
    categoria: "Blusas",
    cor: "Bege",
    imagem:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 7,
    nome: "Camisa branca",
    categoria: "Blusas",
    cor: "Branco",
    imagem:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 8,
    nome: "Bota preta",
    categoria: "Calçados",
    cor: "Preto",
    imagem:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=700&q=80",
  },
];

const categorias = [
  "Todas",
  "Blusas",
  "Calças",
  "Casacos",
  "Calçados",
  "Acessórios",
];

const ocasioes = [
  "Casual",
  "Passeio",
  "Trabalho",
  "Evento",
  "Noite",
  "Viagem",
];

function EditarLook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const lookAtual = looksIniciais[id] || looksIniciais[1];

  const [pecasSelecionadas, setPecasSelecionadas] = useState(
    pecasIniciais.filter((peca) => lookAtual.pecas.includes(peca.id))
  );

  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [nomeLook, setNomeLook] = useState(lookAtual.nome);
  const [ocasiao, setOcasiao] = useState(lookAtual.ocasiao);
  const [salvo, setSalvo] = useState(false);

  const pecasFiltradas = pecasIniciais.filter((peca) => {
    const combinaCategoria =
      categoriaAtiva === "Todas" ||
      peca.categoria === categoriaAtiva;

    const termo = busca.toLowerCase().trim();

    const combinaBusca =
      !termo ||
      peca.nome.toLowerCase().includes(termo) ||
      peca.cor.toLowerCase().includes(termo);

    return combinaCategoria && combinaBusca;
  });

  const alternarPeca = (peca) => {
    const jaSelecionada = pecasSelecionadas.some(
      (item) => item.id === peca.id
    );

    if (jaSelecionada) {
      setPecasSelecionadas((atuais) =>
        atuais.filter((item) => item.id !== peca.id)
      );
    } else {
      if (pecasSelecionadas.length >= 8) return;

      setPecasSelecionadas((atuais) => [...atuais, peca]);
    }
  };

  const removerPeca = (idPeca) => {
    setPecasSelecionadas((atuais) =>
      atuais.filter((peca) => peca.id !== idPeca)
    );
  };

  const salvarAlteracoes = () => {
    if (!nomeLook.trim() || pecasSelecionadas.length === 0) {
      return;
    }

    setSalvo(true);

    setTimeout(() => {
      navigate(`/looks/${id}`);
    }, 1000);
  };

  return (
    <div className="closet-layout">
      <aside className="closet-sidebar">
        <Link to="/" className="closet-brand">
          GRWM
        </Link>

        <nav className="closet-nav">
          <Link to="/" className="closet-nav-item">
            <HomeIcon size={17} strokeWidth={1.6} />
            <span>Início</span>
          </Link>

          <Link to="/closet" className="closet-nav-item">
            <Shirt size={17} strokeWidth={1.6} />
            <span>Closet</span>
          </Link>

          <Link to="/looks" className="closet-nav-item active">
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
          <Link to="/perfil" className="closet-nav-item">
            <UserRound size={17} strokeWidth={1.6} />
            <span>Meu perfil</span>
          </Link>
        </div>
      </aside>

      <main className="closet-content create-look-page">
        <header className="create-look-header">
          <div>
            <Link to={`/looks/${id}`} className="create-look-back">
              <ArrowLeft size={14} />
              Voltar para o look
            </Link>

            <span className="home-eyebrow">
              EDITANDO LOOK
            </span>

            <h1>Editar look</h1>

            <p>
              Altere as peças ou informações da sua combinação.
            </p>
          </div>

          <button
            type="button"
            className={
              salvo
                ? "create-look-save saved"
                : "create-look-save"
            }
            onClick={salvarAlteracoes}
            disabled={
              !nomeLook.trim() ||
              pecasSelecionadas.length === 0 ||
              salvo
            }
          >
            {salvo ? (
              <>
                <Check size={15} />
                Alterações salvas
              </>
            ) : (
              <>
                <Save size={15} />
                Salvar alterações
              </>
            )}
          </button>
        </header>

        <div className="create-look-layout">
          <section className="pieces-selector">
            <div className="pieces-selector-header">
              <div>
                <span>SEU CLOSET</span>
                <h2>Escolha as peças</h2>
              </div>

              <small>
                {pecasSelecionadas.length} selecionadas
              </small>
            </div>

            <div
              className={
                busca
                  ? "create-look-search has-value"
                  : "create-look-search"
              }
            >
              <Search size={15} />

              <input
                type="text"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar peça..."
              />

              {busca && (
                <button
                  type="button"
                  onClick={() => setBusca("")}
                  aria-label="Limpar busca"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="create-look-categories">
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  type="button"
                  className={
                    categoriaAtiva === categoria
                      ? "create-look-category active"
                      : "create-look-category"
                  }
                  onClick={() =>
                    setCategoriaAtiva(categoria)
                  }
                >
                  {categoria}
                </button>
              ))}
            </div>

            <div className="pieces-grid">
              {pecasFiltradas.map((peca) => {
                const selecionada =
                  pecasSelecionadas.some(
                    (item) => item.id === peca.id
                  );

                return (
                  <button
                    type="button"
                    key={peca.id}
                    className={
                      selecionada
                        ? "piece-select-card selected"
                        : "piece-select-card"
                    }
                    onClick={() => alternarPeca(peca)}
                  >
                    <div className="piece-select-image">
                      <img
                        src={peca.imagem}
                        alt={peca.nome}
                      />

                      <div className="piece-select-overlay" />

                      <span className="piece-select-check">
                        {selecionada && (
                          <Check size={13} />
                        )}
                      </span>
                    </div>

                    <div className="piece-select-info">
                      <strong>{peca.nome}</strong>
                      <span>{peca.cor}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="look-builder">
            <div className="look-builder-top">
              <div>
                <span>VISUALIZAÇÃO</span>
                <h2>Seu look</h2>
              </div>

              <span className="look-builder-count">
                {pecasSelecionadas.length}/8
              </span>
            </div>

            <div className="look-preview">
              <div className="selected-pieces">
                {pecasSelecionadas.map((peca) => (
                  <div
                    className="selected-piece"
                    key={peca.id}
                  >
                    <img
                      src={peca.imagem}
                      alt={peca.nome}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removerPeca(peca.id)
                      }
                      aria-label={`Remover ${peca.nome}`}
                    >
                      <X size={12} />
                    </button>

                    <span>{peca.nome}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="look-details-form">
              <div className="create-look-field">
                <label htmlFor="nome-look">
                  Nome do look
                </label>

                <input
                  id="nome-look"
                  type="text"
                  value={nomeLook}
                  onChange={(event) =>
                    setNomeLook(event.target.value)
                  }
                />
              </div>

              <div className="create-look-field">
                <label htmlFor="ocasiao-look">
                  Ocasião
                </label>

                <select
                  id="ocasiao-look"
                  value={ocasiao}
                  onChange={(event) =>
                    setOcasiao(event.target.value)
                  }
                >
                  {ocasioes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              className="look-builder-save"
              onClick={salvarAlteracoes}
              disabled={
                !nomeLook.trim() ||
                pecasSelecionadas.length === 0 ||
                salvo
              }
            >
              {salvo ? (
                <>
                  <Check size={14} />
                  Alterações salvas
                </>
              ) : (
                <>
                  <Save size={14} />
                  Salvar alterações
                </>
              )}
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default EditarLook;
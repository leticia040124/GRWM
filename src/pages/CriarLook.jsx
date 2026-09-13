import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function CriarLook() {
  const navigate = useNavigate();

  const [pecasSelecionadas, setPecasSelecionadas] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [nomeLook, setNomeLook] = useState("");
  const [ocasiao, setOcasiao] = useState("Casual");
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
      setPecasSelecionadas((atuais) => [...atuais, peca]);
    }
  };

  const removerPeca = (id) => {
    setPecasSelecionadas((atuais) =>
      atuais.filter((peca) => peca.id !== id)
    );
  };

  const salvarLook = () => {
    if (!nomeLook.trim() || pecasSelecionadas.length === 0) {
      return;
    }

    setSalvo(true);

    setTimeout(() => {
      navigate("/looks");
    }, 1000);
  };

  return (
    <div className="closet-layout">
      {/* SIDEBAR */}
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

      {/* CONTEÚDO */}
      <main className="closet-content create-look-page">
        <header className="create-look-header">
          <div>
            <Link to="/looks" className="create-look-back">
              <ArrowLeft size={14} />
              Voltar para looks
            </Link>

            <span className="home-eyebrow">NOVA COMBINAÇÃO</span>

            <h1>Criar look</h1>

            <p>
              Escolha as peças que combinam entre si e monte
              sua próxima produção.
            </p>
          </div>

          <button
            type="button"
            className={
              salvo
                ? "create-look-save saved"
                : "create-look-save"
            }
            onClick={salvarLook}
            disabled={
              !nomeLook.trim() ||
              pecasSelecionadas.length === 0 ||
              salvo
            }
          >
            {salvo ? (
              <>
                <Check size={15} />
                Look salvo
              </>
            ) : (
              <>
                <Save size={15} />
                Salvar look
              </>
            )}
          </button>
        </header>

        <div className="create-look-layout">
          {/* ESCOLHA DAS PEÇAS */}
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

            {/* BUSCA */}
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
                onChange={(event) =>
                  setBusca(event.target.value)
                }
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

            {/* CATEGORIAS */}
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

            {/* PEÇAS */}
            <div className="pieces-grid">
              {pecasFiltradas.length > 0 ? (
                pecasFiltradas.map((peca) => {
                  const selecionada = pecasSelecionadas.some(
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
                })
              ) : (
                <div className="pieces-empty">
                  <Search size={20} />
                  <span>Nenhuma peça encontrada.</span>
                </div>
              )}
            </div>
          </section>

          {/* PREVIEW DO LOOK */}
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
              {pecasSelecionadas.length > 0 ? (
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
                        onClick={() => removerPeca(peca.id)}
                        aria-label={`Remover ${peca.nome}`}
                      >
                        <X size={12} />
                      </button>

                      <span>{peca.nome}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="look-preview-empty">
                  <div>
                    <Shirt size={25} strokeWidth={1.2} />
                  </div>

                  <span>SEU LOOK APARECERÁ AQUI</span>

                  <p>
                    Selecione as peças do seu Closet para
                    começar a montar.
                  </p>
                </div>
              )}
            </div>

            {/* DADOS DO LOOK */}
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
                  placeholder="Ex.: Casual de domingo"
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
              onClick={salvarLook}
              disabled={
                !nomeLook.trim() ||
                pecasSelecionadas.length === 0 ||
                salvo
              }
            >
              {salvo ? (
                <>
                  <Check size={14} />
                  Look salvo com sucesso
                </>
              ) : (
                <>
                  <Save size={14} />
                  Salvar look
                </>
              )}
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default CriarLook;
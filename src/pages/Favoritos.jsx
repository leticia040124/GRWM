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
  Search,
  ArrowRight,
  X,
  Plus,
  FolderHeart,
  MoreHorizontal,
  Trash2,
  Check,
} from "lucide-react";

import "../App.css";

function Favoritos() {
  const location = useLocation();
  const navigate = useNavigate();

  const [abaAtiva, setAbaAtiva] = useState("pecas");
  const [busca, setBusca] = useState("");

  const [modalColecao, setModalColecao] = useState(false);
  const [nomeColecao, setNomeColecao] = useState("");

  const [menuColecao, setMenuColecao] = useState(null);

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

  const [looks, setLooks] = useState([
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
  ]);

  const [colecoes, setColecoes] = useState([
    {
      id: 1,
      nome: "Meus favoritos",
      descricao: "Peças que combinam com tudo",
      quantidade: 4,
      imagem:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      nome: "Looks para sair",
      descricao: "Produções para momentos especiais",
      quantidade: 3,
      imagem:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=80",
    },
  ]);

  const menuAtivo = (rota) => {
    return location.pathname === rota
      ? "closet-nav-item active"
      : "closet-nav-item";
  };

  /* =========================================================
     PEÇAS
     ========================================================= */

  const removerPeca = (id) => {
    setPecas((atual) =>
      atual.filter((peca) => peca.id !== id)
    );
  };

  /* =========================================================
     LOOKS
     ========================================================= */

  const removerLook = (id) => {
    setLooks((atual) =>
      atual.filter((look) => look.id !== id)
    );
  };

  /* =========================================================
     BUSCA
     ========================================================= */

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

  const colecoesFiltradas = colecoes.filter((colecao) =>
    `${colecao.nome} ${colecao.descricao}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  /* =========================================================
     COLEÇÕES
     ========================================================= */

  const abrirModalColecao = () => {
    setNomeColecao("");
    setModalColecao(true);
  };

  const fecharModalColecao = () => {
    setModalColecao(false);
    setNomeColecao("");
  };

  const criarColecao = (event) => {
    event.preventDefault();

    const nome = nomeColecao.trim();

    if (!nome) return;

    const novaColecao = {
      id: Date.now(),
      nome,
      descricao: "Nova coleção de favoritos",
      quantidade: 0,
      imagem:
        pecas[0]?.imagem ||
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80",
    };

    setColecoes((atual) => [
      ...atual,
      novaColecao,
    ]);

    fecharModalColecao();
  };

  const excluirColecao = (id) => {
    setColecoes((atual) =>
      atual.filter((colecao) => colecao.id !== id)
    );

    setMenuColecao(null);
  };

  /* =========================================================
     NAVEGAÇÃO
     ========================================================= */

  const abrirPeca = (id) => {
    navigate(`/closet/${id}`);
  };

  const abrirLook = (id) => {
    navigate(`/looks/${id}`);
  };

  return (
    <div
      className="closet-page favorites-page"
      onClick={() => setMenuColecao(null)}
    >

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="closet-sidebar">

        <Link
          to="/home"
          className="closet-brand"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <span>SEU CLOSET</span>
          <h2>GRWM</h2>
        </Link>

        <nav className="closet-nav">

          <Link
            to="/home"
            className={menuAtivo("/home")}
          >
            <HomeIcon
              size={17}
              strokeWidth={1.6}
            />
            <span>Início</span>
          </Link>

          <Link
            to="/closet"
            className={menuAtivo("/closet")}
          >
            <Shirt
              size={17}
              strokeWidth={1.6}
            />
            <span>Closet</span>
          </Link>

          <Link
            to="/looks"
            className={menuAtivo("/looks")}
          >
            <Star
              size={17}
              strokeWidth={1.6}
            />
            <span>Looks</span>
          </Link>

          <Link
            to="/viagem"
            className={menuAtivo("/viagem")}
          >
            <Plane
              size={17}
              strokeWidth={1.6}
            />
            <span>Viagem</span>
          </Link>

          <Link
            to="/favoritos"
            className={menuAtivo("/favoritos")}
          >
            <Heart
              size={17}
              strokeWidth={1.6}
            />
            <span>Favoritos</span>
          </Link>

          <Link
            to="/inspiracao"
            className={menuAtivo("/inspiracao")}
          >
            <Sparkles
              size={17}
              strokeWidth={1.6}
            />
            <span>Inspiração</span>
          </Link>

          <Link
            to="/perfil"
            className={menuAtivo("/perfil")}
          >
            <UserRound
              size={17}
              strokeWidth={1.6}
            />
            <span>Perfil</span>
          </Link>

        </nav>

        <div className="closet-sidebar-footer">
          <span>sem limites.</span>
        </div>

      </aside>


      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

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
                : abaAtiva === "looks"
                ? looks.length
                : colecoes.length}
            </strong>

            <span>
              {abaAtiva === "pecas"
                ? "peças salvas"
                : abaAtiva === "looks"
                ? "looks salvos"
                : "coleções"}
            </span>

          </div>

        </header>


        {/* =====================================================
            TOOLBAR
        ===================================================== */}

        <div className="favorites-toolbar">

          <div className="favorites-tabs">

            <button
              type="button"
              className={
                abaAtiva === "pecas"
                  ? "favorites-tab active"
                  : "favorites-tab"
              }
              onClick={() => {
                setAbaAtiva("pecas");
                setBusca("");
              }}
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
              onClick={() => {
                setAbaAtiva("looks");
                setBusca("");
              }}
            >
              Looks
            </button>

            <button
              type="button"
              className={
                abaAtiva === "colecoes"
                  ? "favorites-tab active"
                  : "favorites-tab"
              }
              onClick={() => {
                setAbaAtiva("colecoes");
                setBusca("");
              }}
            >
              Coleções
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
                  : abaAtiva === "looks"
                  ? "Buscar look..."
                  : "Buscar coleção..."
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


        {/* =====================================================
            PEÇAS
        ===================================================== */}

        {abaAtiva === "pecas" && (

          <section className="favorites-section">

            {pecasFiltradas.length > 0 ? (

              <div className="favorites-grid">

                {pecasFiltradas.map((peca) => (

                  <article
                    className="favorite-piece-card"
                    key={peca.id}
                    onClick={() =>
                      abrirPeca(peca.id)
                    }
                  >

                    <div className="favorite-piece-image">

                      <img
                        src={peca.imagem}
                        alt={peca.nome}
                      />

                      <button
                        type="button"
                        className="favorite-heart active"
                        onClick={(event) => {
                          event.stopPropagation();
                          removerPeca(peca.id);
                        }}
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


        {/* =====================================================
            LOOKS
        ===================================================== */}

        {abaAtiva === "looks" && (

          <section className="favorites-section">

            {looksFiltrados.length > 0 ? (

              <div className="favorites-looks-grid">

                {looksFiltrados.map((look) => (

                  <article
                    className="favorite-look-card"
                    key={look.id}
                    onClick={() =>
                      abrirLook(look.id)
                    }
                  >

                    <div className="favorite-look-image">

                      <img
                        src={look.imagem}
                        alt={look.nome}
                      />

                      <button
                        type="button"
                        className="favorite-heart active"
                        onClick={(event) => {
                          event.stopPropagation();
                          removerLook(look.id);
                        }}
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
                  {busca
                    ? "Não encontramos nenhum look com essa busca."
                    : "Salve seus looks preferidos para acessá-los rapidamente."}
                </p>

                {!busca && (
                  <Link
                    to="/looks"
                    className="favorites-empty-button"
                  >
                    Explorar looks
                    <ArrowRight size={13} />
                  </Link>
                )}

              </div>

            )}

          </section>

        )}


        {/* =====================================================
            COLEÇÕES
        ===================================================== */}

        {abaAtiva === "colecoes" && (

          <section className="favorites-section">

            <div className="favorites-collections-header">

              <div>

                <span>
                  ORGANIZAÇÃO
                </span>

                <h2>
                  Suas coleções
                </h2>

              </div>

              <button
                type="button"
                className="favorites-create-collection"
                onClick={abrirModalColecao}
              >
                <Plus
                  size={14}
                  strokeWidth={1.7}
                />
                Nova coleção
              </button>

            </div>


            {colecoesFiltradas.length > 0 ? (

              <div className="favorites-collections-grid">

                {colecoesFiltradas.map((colecao) => (

                  <article
                    className="favorite-collection-card"
                    key={colecao.id}
                    onClick={() =>
                      setMenuColecao(null)
                    }
                  >

                    <div className="favorite-collection-image">

                      <img
                        src={colecao.imagem}
                        alt={colecao.nome}
                      />

                      <div className="favorite-collection-overlay" />

                      <div className="favorite-collection-icon">
                        <FolderHeart
                          size={18}
                          strokeWidth={1.4}
                        />
                      </div>

                    </div>


                    <div className="favorite-collection-info">

                      <div>

                        <h3>
                          {colecao.nome}
                        </h3>

                        <p>
                          {colecao.descricao}
                        </p>

                        <span>
                          {colecao.quantidade}{" "}
                          {colecao.quantidade === 1
                            ? "item"
                            : "itens"}
                        </span>

                      </div>


                      <div className="favorite-collection-menu">

                        <button
                          type="button"
                          className="favorite-collection-menu-button"
                          onClick={(event) => {
                            event.stopPropagation();

                            setMenuColecao(
                              menuColecao ===
                                colecao.id
                                ? null
                                : colecao.id
                            );
                          }}
                          aria-label="Opções da coleção"
                        >
                          <MoreHorizontal
                            size={16}
                          />
                        </button>


                        {menuColecao ===
                          colecao.id && (

                          <div
                            className="favorite-collection-dropdown"
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                          >

                            <button
                              type="button"
                              onClick={() =>
                                excluirColecao(
                                  colecao.id
                                )
                              }
                            >
                              <Trash2
                                size={13}
                              />
                              Excluir coleção
                            </button>

                          </div>

                        )}

                      </div>

                    </div>

                  </article>

                ))}

              </div>

            ) : (

              <div className="favorites-empty">

                <div className="favorites-empty-icon">
                  <FolderHeart
                    size={21}
                    strokeWidth={1.4}
                  />
                </div>

                <span>
                  COLEÇÕES
                </span>

                <h2>
                  Nenhuma coleção encontrada.
                </h2>

                <p>
                  {busca
                    ? "Tente buscar por outro nome."
                    : "Crie sua primeira coleção para organizar seus favoritos."}
                </p>

                {!busca && (
                  <button
                    type="button"
                    className="favorites-empty-button"
                    onClick={abrirModalColecao}
                  >
                    <Plus size={13} />
                    Criar coleção
                  </button>
                )}

              </div>

            )}

          </section>

        )}

      </main>


      {/* =====================================================
          MODAL — NOVA COLEÇÃO
      ===================================================== */}

      {modalColecao && (

        <div
          className="favorites-modal-overlay"
          onClick={fecharModalColecao}
        >

          <div
            className="favorites-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="favorites-modal-close"
              onClick={fecharModalColecao}
              aria-label="Fechar"
            >
              <X size={16} />
            </button>


            <div className="favorites-modal-icon">
              <FolderHeart
                size={20}
                strokeWidth={1.4}
              />
            </div>


            <span>
              NOVA COLEÇÃO
            </span>

            <h2>
              Organize seus favoritos.
            </h2>

            <p>
              Crie uma coleção para reunir peças
              e looks que fazem sentido juntos.
            </p>


            <form onSubmit={criarColecao}>

              <label>
                Nome da coleção

                <input
                  type="text"
                  placeholder="Ex.: Looks para faculdade"
                  value={nomeColecao}
                  onChange={(event) =>
                    setNomeColecao(
                      event.target.value
                    )
                  }
                  autoFocus
                />

              </label>


              <div className="favorites-modal-actions">

                <button
                  type="button"
                  className="favorites-modal-cancel"
                  onClick={fecharModalColecao}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="favorites-modal-submit"
                >
                  <Check size={14} />
                  Criar coleção
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Favoritos;
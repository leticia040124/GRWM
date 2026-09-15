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
  Search,
  Pencil,
  Trash2,
  X,
  ImagePlus,
} from "lucide-react";

import "../App.css";

function GuardaRoupa() {
  const location = useLocation();

  const categorias = [
    "Tudo",
    "Tops",
    "Calças",
    "Vestidos",
    "Casacos",
    "Calçados",
    "Acessórios",
  ];

  const [roupas, setRoupas] = useState([
    {
      nome: "Blazer Oversized",
      cor: "Preto",
      categoria: "Casacos",
      imagem:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",
      favorito: true,
    },
    {
      nome: "Blusa de Seda",
      cor: "Branco",
      categoria: "Tops",
      imagem:
        "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80",
      favorito: false,
    },
    {
      nome: "Jaqueta de Couro",
      cor: "Preto",
      categoria: "Casacos",
      imagem:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      favorito: true,
    },
    {
      nome: "Blusa Casual",
      cor: "Bege",
      categoria: "Tops",
      imagem:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
      favorito: false,
    },
    {
      nome: "Calça Alfaiataria",
      cor: "Preto",
      categoria: "Calças",
      imagem:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
      favorito: true,
    },
    {
      nome: "Vestido Preto",
      cor: "Preto",
      categoria: "Vestidos",
      imagem:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
      favorito: false,
    },
  ]);

  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Tudo");
  const [busca, setBusca] = useState("");

  const [roupaSelecionada, setRoupaSelecionada] = useState(null);

  const [mostrarModalAdicionar, setMostrarModalAdicionar] =
    useState(false);

  const [mostrarModalEditar, setMostrarModalEditar] =
    useState(false);

  const [mostrarModalExcluir, setMostrarModalExcluir] =
    useState(false);

  const [idEdicao, setIdEdicao] = useState(null);

  const [novaRoupa, setNovaRoupa] = useState({
    nome: "",
    categoria: "Tops",
    cor: "",
    imagem: "",
  });

  const [buscaVazia, setBuscaVazia] = useState(false);


  /* =========================================
     NAVEGAÇÃO
  ========================================= */

  const menuAtivo = (rota) => {
    return location.pathname === rota
      ? "closet-nav-item active"
      : "closet-nav-item";
  };


  /* =========================================
     FILTRO
  ========================================= */

  const roupasFiltradas = roupas.filter((roupa) => {
    const correspondeCategoria =
      categoriaSelecionada === "Tudo" ||
      roupa.categoria === categoriaSelecionada;

    const textoBusca = busca.toLowerCase().trim();

    const correspondeBusca =
      roupa.nome.toLowerCase().includes(textoBusca) ||
      roupa.cor.toLowerCase().includes(textoBusca) ||
      roupa.categoria.toLowerCase().includes(textoBusca);

    return correspondeCategoria && correspondeBusca;
  });


  /* =========================================
     FAVORITO
  ========================================= */

  const alternarFavorito = (nomeRoupa) => {
    setRoupas((roupasAtuais) =>
      roupasAtuais.map((roupa) =>
        roupa.nome === nomeRoupa
          ? {
              ...roupa,
              favorito: !roupa.favorito,
            }
          : roupa
      )
    );

    if (
      roupaSelecionada &&
      roupaSelecionada.nome === nomeRoupa
    ) {
      setRoupaSelecionada({
        ...roupaSelecionada,
        favorito: !roupaSelecionada.favorito,
      });
    }
  };


  /* =========================================
     ADICIONAR
  ========================================= */

  const adicionarRoupa = (event) => {
    event.preventDefault();

    if (
      !novaRoupa.nome.trim() ||
      !novaRoupa.categoria ||
      !novaRoupa.cor.trim()
    ) {
      return;
    }

    const roupaCriada = {
      nome: novaRoupa.nome.trim(),
      categoria: novaRoupa.categoria,
      cor: novaRoupa.cor.trim(),
      imagem:
        novaRoupa.imagem ||
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
      favorito: false,
    };

    setRoupas((roupasAtuais) => [
      ...roupasAtuais,
      roupaCriada,
    ]);

    setNovaRoupa({
      nome: "",
      categoria: "Tops",
      cor: "",
      imagem: "",
    });

    setMostrarModalAdicionar(false);
  };


  /* =========================================
     EDITAR
  ========================================= */

  const abrirEdicao = () => {
    if (!roupaSelecionada) return;

    setIdEdicao(roupaSelecionada.nome);
    setMostrarModalEditar(true);
  };

  const editarRoupa = (event) => {
    event.preventDefault();

    if (
      !roupaSelecionada ||
      !roupaSelecionada.nome.trim() ||
      !roupaSelecionada.categoria ||
      !roupaSelecionada.cor.trim()
    ) {
      return;
    }

    const roupaAtualizada = {
      ...roupaSelecionada,
      nome: roupaSelecionada.nome.trim(),
      cor: roupaSelecionada.cor.trim(),
    };

    setRoupas((roupasAtuais) =>
      roupasAtuais.map((roupa) =>
        roupa.nome === idEdicao
          ? roupaAtualizada
          : roupa
      )
    );

    setRoupaSelecionada(roupaAtualizada);
    setMostrarModalEditar(false);
    setIdEdicao(null);
  };


  /* =========================================
     EXCLUIR
  ========================================= */

  const abrirExclusao = () => {
    if (!roupaSelecionada) return;

    setMostrarModalExcluir(true);
  };

  const excluirRoupa = () => {
    if (!roupaSelecionada) return;

    setRoupas((roupasAtuais) =>
      roupasAtuais.filter(
        (roupa) => roupa.nome !== roupaSelecionada.nome
      )
    );

    setMostrarModalExcluir(false);
    setRoupaSelecionada(null);
  };


  /* =========================================
     IMAGEM
  ========================================= */

  const selecionarImagem = (event) => {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    const imagemUrl = URL.createObjectURL(arquivo);

    setNovaRoupa({
      ...novaRoupa,
      imagem: imagemUrl,
    });
  };


  return (
    <div className="closet-page">


      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside className="closet-sidebar">

        <Link
          to="/"
          className="closet-brand"
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
            className="closet-nav-item"
          >
            <Plane
              size={17}
              strokeWidth={1.6}
            />
            <span>Viagem</span>
          </Link>


          <Link
            to="/favoritos"
            className="closet-nav-item"
          >
            <Heart
              size={17}
              strokeWidth={1.6}
            />
            <span>Favoritos</span>
          </Link>


          <Link
            to="/inspiracao"
            className="closet-nav-item"
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


        <div className="closet-motto">
          sem limites.
        </div>

      </aside>


      {/* =====================================
          CONTEÚDO
      ====================================== */}

      <main className="closet-content">


        {/* CABEÇALHO */}

        <header className="closet-header">

          <div>

            <span className="home-eyebrow">
              SEU ESPAÇO
            </span>

            <h1>
              Closet
            </h1>

            <p>
              {roupasFiltradas.length}{" "}
              {roupasFiltradas.length === 1
                ? "peça encontrada"
                : "peças encontradas"}
            </p>

          </div>


          <button
            className="closet-add-button"
            type="button"
            onClick={() =>
              setMostrarModalAdicionar(true)
            }
            aria-label="Adicionar nova peça"
          >
            <Plus
              size={21}
              strokeWidth={1.6}
            />
          </button>

        </header>


        {/* =====================================
            FERRAMENTAS
        ====================================== */}

        <div className="closet-toolbar">


          <div className="closet-categories">

            {categorias.map((categoria) => (

              <button
                key={categoria}
                type="button"
                className={
                  categoriaSelecionada === categoria
                    ? "closet-category active"
                    : "closet-category"
                }
                onClick={() =>
                  setCategoriaSelecionada(categoria)
                }
              >
                {categoria}
              </button>

            ))}

          </div>


          <div
            className={`closet-search ${
              busca ? "has-value" : ""
            }`}
          >

            <Search
              size={15}
              strokeWidth={1.6}
            />

            <input
              type="text"
              placeholder="Buscar no closet..."
              value={busca}
              onChange={(event) => {
                setBusca(event.target.value);
                setBuscaVazia(false);
              }}
            />

            {busca && (
              <button
                type="button"
                className="closet-search-clear"
                onClick={() => setBusca("")}
                aria-label="Limpar busca"
              >
                <X
                  size={13}
                  strokeWidth={1.7}
                />
              </button>
            )}

          </div>

        </div>


        {/* =====================================
            GRID
        ====================================== */}

        <section className="clothes-grid">

          {roupasFiltradas.length > 0 ? (

            roupasFiltradas.map((roupa) => (

              <article
                className="clothing-card"
                key={roupa.nome}
                onClick={() =>
                  setRoupaSelecionada(roupa)
                }
              >

                <div className="clothing-photo">

                  <img
                    src={roupa.imagem}
                    alt={roupa.nome}
                  />


                  <button
                    type="button"
                    className={
                      roupa.favorito
                        ? "clothing-favorite active"
                        : "clothing-favorite"
                    }
                    aria-label={
                      roupa.favorito
                        ? `Remover ${roupa.nome} dos favoritos`
                        : `Favoritar ${roupa.nome}`
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      alternarFavorito(roupa.nome);
                    }}
                  >

                    <Heart
                      size={17}
                      strokeWidth={1.5}
                      fill={
                        roupa.favorito
                          ? "currentColor"
                          : "none"
                      }
                    />

                  </button>


                  <div className="clothing-gradient" />


                  <div className="clothing-info">

                    <h3>
                      {roupa.nome}
                    </h3>

                    <p>
                      {roupa.cor}
                      {" · "}
                      {roupa.categoria}
                    </p>

                  </div>

                </div>

              </article>

            ))

          ) : (

            <div className="closet-empty">

              <div className="closet-empty-icon">
                <Search
                  size={25}
                  strokeWidth={1.4}
                />
              </div>

              <span>
                NADA POR AQUI
              </span>

              <h2>
                Nenhuma peça encontrada
              </h2>

              <p>
                Tente buscar por outro nome,
                cor ou categoria.
              </p>

              {busca && (
                <button
                  type="button"
                  onClick={() => setBusca("")}
                >
                  Limpar busca
                </button>
              )}

            </div>

          )}

        </section>


        {/* =====================================
            MODAL DE DETALHES
        ====================================== */}

        {roupaSelecionada && !mostrarModalEditar && !mostrarModalExcluir && (

          <div
            className="clothing-modal-overlay"
            onClick={() =>
              setRoupaSelecionada(null)
            }
          >

            <div
              className="clothing-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <button
                type="button"
                className="clothing-modal-close"
                onClick={() =>
                  setRoupaSelecionada(null)
                }
                aria-label="Fechar detalhes"
              >
                ×
              </button>


              <div className="clothing-modal-image">

                <img
                  src={roupaSelecionada.imagem}
                  alt={roupaSelecionada.nome}
                />

              </div>


              <div className="clothing-modal-content">

                <span className="clothing-modal-eyebrow">
                  DETALHES DA PEÇA
                </span>

                <h2>
                  {roupaSelecionada.nome}
                </h2>


                <div className="clothing-modal-details">

                  <div>
                    <span>Cor</span>
                    <strong>
                      {roupaSelecionada.cor}
                    </strong>
                  </div>

                  <div>
                    <span>Categoria</span>
                    <strong>
                      {roupaSelecionada.categoria}
                    </strong>
                  </div>

                </div>


                <div className="clothing-modal-actions">

                  <button
                    type="button"
                    className="clothing-modal-edit"
                    onClick={abrirEdicao}
                  >
                    <Pencil
                      size={14}
                      strokeWidth={1.6}
                    />
                    Editar peça
                  </button>


                  <button
                    type="button"
                    className="clothing-modal-delete"
                    onClick={abrirExclusao}
                  >
                    <Trash2
                      size={14}
                      strokeWidth={1.6}
                    />
                    Excluir peça
                  </button>

                </div>


                <button
                  type="button"
                  className="clothing-modal-favorite"
                  onClick={() =>
                    alternarFavorito(
                      roupaSelecionada.nome
                    )
                  }
                >

                  <Heart
                    size={17}
                    strokeWidth={1.5}
                    fill={
                      roupaSelecionada.favorito
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {roupaSelecionada.favorito
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"}

                </button>

              </div>

            </div>

          </div>

        )}


        {/* =====================================
            MODAL ADICIONAR
        ====================================== */}

        {mostrarModalAdicionar && (

          <div
            className="clothing-modal-overlay"
            onClick={() =>
              setMostrarModalAdicionar(false)
            }
          >

            <div
              className="add-clothing-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <button
                type="button"
                className="clothing-modal-close"
                onClick={() =>
                  setMostrarModalAdicionar(false)
                }
                aria-label="Fechar"
              >
                ×
              </button>


              <div className="add-clothing-header">

                <span className="clothing-modal-eyebrow">
                  NOVA PEÇA
                </span>

                <h2>
                  Adicione algo
                  <br />
                  ao seu closet.
                </h2>

                <p>
                  Cadastre uma peça para organizar
                  suas possibilidades.
                </p>

              </div>


              <form
                className="add-clothing-form"
                onSubmit={adicionarRoupa}
              >

                <div className="form-field">

                  <label htmlFor="nome-peca">
                    Nome da peça
                  </label>

                  <input
                    id="nome-peca"
                    type="text"
                    placeholder="Ex.: Blazer oversized"
                    value={novaRoupa.nome}
                    onChange={(event) =>
                      setNovaRoupa({
                        ...novaRoupa,
                        nome: event.target.value,
                      })
                    }
                  />

                </div>


                <div className="form-row">

                  <div className="form-field">

                    <label htmlFor="categoria-peca">
                      Categoria
                    </label>

                    <select
                      id="categoria-peca"
                      value={novaRoupa.categoria}
                      onChange={(event) =>
                        setNovaRoupa({
                          ...novaRoupa,
                          categoria:
                            event.target.value,
                        })
                      }
                    >

                      <option value="Tops">
                        Tops
                      </option>

                      <option value="Calças">
                        Calças
                      </option>

                      <option value="Vestidos">
                        Vestidos
                      </option>

                      <option value="Casacos">
                        Casacos
                      </option>

                      <option value="Calçados">
                        Calçados
                      </option>

                      <option value="Acessórios">
                        Acessórios
                      </option>

                    </select>

                  </div>


                  <div className="form-field">

                    <label htmlFor="cor-peca">
                      Cor
                    </label>

                    <input
                      id="cor-peca"
                      type="text"
                      placeholder="Ex.: Preto"
                      value={novaRoupa.cor}
                      onChange={(event) =>
                        setNovaRoupa({
                          ...novaRoupa,
                          cor: event.target.value,
                        })
                      }
                    />

                  </div>

                </div>


                <div className="form-field">

                  <label htmlFor="imagem-peca">
                    Imagem
                  </label>

                  <div
                    className={`image-upload ${
                      novaRoupa.imagem
                        ? "has-image"
                        : ""
                    }`}
                  >

                    {novaRoupa.imagem ? (
                      <>
                        <img
                          src={novaRoupa.imagem}
                          alt="Prévia da peça"
                        />

                        <div className="image-upload-overlay">
                          <ImagePlus
                            size={19}
                            strokeWidth={1.5}
                          />

                          <span>
                            Trocar imagem
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImagePlus
                          size={20}
                          strokeWidth={1.5}
                        />

                        <span>
                          Adicionar imagem
                        </span>

                        <small>
                          JPG, PNG ou WEBP
                        </small>
                      </>
                    )}

                    <input
                      id="imagem-peca"
                      type="file"
                      accept="image/*"
                      onChange={selecionarImagem}
                    />

                  </div>

                </div>


                <button
                  type="submit"
                  className="add-clothing-submit"
                >
                  Adicionar ao closet
                </button>

              </form>

            </div>

          </div>

        )}


        {/* =====================================
            MODAL EDITAR
        ====================================== */}

        {mostrarModalEditar && roupaSelecionada && (

          <div
            className="clothing-modal-overlay"
            onClick={() => {
              setMostrarModalEditar(false);
              setIdEdicao(null);
            }}
          >

            <div
              className="add-clothing-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <button
                type="button"
                className="clothing-modal-close"
                onClick={() => {
                  setMostrarModalEditar(false);
                  setIdEdicao(null);
                }}
                aria-label="Fechar edição"
              >
                ×
              </button>


              <div className="add-clothing-header">

                <span className="clothing-modal-eyebrow">
                  EDITAR PEÇA
                </span>

                <h2>
                  Ajuste os detalhes
                  <br />
                  da sua peça.
                </h2>

                <p>
                  Altere as informações que
                  quiser e salve novamente.
                </p>

              </div>


              <form
                className="add-clothing-form"
                onSubmit={editarRoupa}
              >

                <div className="form-field">

                  <label htmlFor="editar-nome">
                    Nome da peça
                  </label>

                  <input
                    id="editar-nome"
                    type="text"
                    value={roupaSelecionada.nome}
                    onChange={(event) =>
                      setRoupaSelecionada({
                        ...roupaSelecionada,
                        nome: event.target.value,
                      })
                    }
                  />

                </div>


                <div className="form-row">

                  <div className="form-field">

                    <label htmlFor="editar-categoria">
                      Categoria
                    </label>

                    <select
                      id="editar-categoria"
                      value={roupaSelecionada.categoria}
                      onChange={(event) =>
                        setRoupaSelecionada({
                          ...roupaSelecionada,
                          categoria:
                            event.target.value,
                        })
                      }
                    >

                      <option value="Tops">
                        Tops
                      </option>

                      <option value="Calças">
                        Calças
                      </option>

                      <option value="Vestidos">
                        Vestidos
                      </option>

                      <option value="Casacos">
                        Casacos
                      </option>

                      <option value="Calçados">
                        Calçados
                      </option>

                      <option value="Acessórios">
                        Acessórios
                      </option>

                    </select>

                  </div>


                  <div className="form-field">

                    <label htmlFor="editar-cor">
                      Cor
                    </label>

                    <input
                      id="editar-cor"
                      type="text"
                      value={roupaSelecionada.cor}
                      onChange={(event) =>
                        setRoupaSelecionada({
                          ...roupaSelecionada,
                          cor: event.target.value,
                        })
                      }
                    />

                  </div>

                </div>


                <button
                  type="submit"
                  className="add-clothing-submit"
                >
                  Salvar alterações
                </button>

              </form>

            </div>

          </div>

        )}


        {/* =====================================
            MODAL EXCLUIR
        ====================================== */}

        {mostrarModalExcluir && roupaSelecionada && (

          <div
            className="clothing-modal-overlay"
            onClick={() =>
              setMostrarModalExcluir(false)
            }
          >

            <div
              className="delete-clothing-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="delete-clothing-icon">
                <Trash2
                  size={21}
                  strokeWidth={1.5}
                />
              </div>


              <span className="clothing-modal-eyebrow">
                EXCLUIR PEÇA
              </span>


              <h2>
                Tem certeza?
              </h2>


              <p>
                A peça{" "}
                <strong>
                  “{roupaSelecionada.nome}”
                </strong>{" "}
                será removida do seu closet.
              </p>


              <div className="delete-clothing-actions">

                <button
                  type="button"
                  className="delete-cancel-button"
                  onClick={() =>
                    setMostrarModalExcluir(false)
                  }
                >
                  Cancelar
                </button>


                <button
                  type="button"
                  className="delete-confirm-button"
                  onClick={excluirRoupa}
                >
                  Excluir peça
                </button>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default GuardaRoupa;
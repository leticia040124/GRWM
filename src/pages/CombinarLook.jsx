import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  Home,
  Shirt,
  Star,
  Heart,
  Plane,
  Sparkles,
  UserRound,
  ArrowLeft,
  Search,
  X,
  Check,
  Sun,
  CloudSun,
  Snowflake,
  Plus,
} from "lucide-react";

import { buscarMinhasPecas } from "../service/roupasService";



const filtros = {
  ocasiao: [
    "Casual",
    "Trabalho",
    "Evento",
    "Encontro",
    "Passeio",
    "Festa",
  ],
  estilo: [
    "Casual",
    "Elegante",
    "Minimalista",
    "Esportivo",
    "Street",
    "Romântico",
  ],
  cores: [
    "Neutras",
    "Escuras",
    "Claras",
    "Coloridas",
    "Sem preferência",
  ],
};

function CombinarLook() {
  const navigate = useNavigate();

  const [ocasiao, setOcasiao] = useState("");
  const [clima, setClima] = useState("");
  const [estilo, setEstilo] = useState("");
  const [cor, setCor] = useState("");

  const [pecasUsar, setPecasUsar] = useState([]);
  const [pecasEvitar, setPecasEvitar] = useState([]);
  const [pecas, setPecas] = useState([]);

  useEffect(() => {
    async function iniciarTeste() {
      try {
        const { data: loginData, error: loginError } =
          await supabase.auth.signInWithPassword({
            email: "biribinha@gmail.com",
            password: "123",
          });

        if (loginError) {
          throw loginError;
        }

        console.log("Usuário de teste logado:", loginData.user);

        const roupas = await buscarMinhasPecas();

        console.log("Peças carregadas:", roupas);

        setPecas(roupas);
      } catch (error) {
        console.error("Erro no teste:", error);
      }
    }

    iniciarTeste();
  }, []);


  const [modalPecas, setModalPecas] = useState(null);
  const [busca, setBusca] = useState("");

  const selecionarPeca = (peca) => {
    const listaAtual =
      modalPecas === "usar" ? pecasUsar : pecasEvitar;

    const setLista =
      modalPecas === "usar" ? setPecasUsar : setPecasEvitar;

    const jaSelecionada = listaAtual.some(
      (item) => item.id === peca.id
    );

    if (jaSelecionada) {
      setLista(
        listaAtual.filter((item) => item.id !== peca.id)
      );
    } else {
      setLista([...listaAtual, peca]);
    }
  };

  const removerPeca = (id, tipo) => {
    if (tipo === "usar") {
      setPecasUsar(
        pecasUsar.filter((peca) => peca.id !== id)
      );
    } else {
      setPecasEvitar(
        pecasEvitar.filter((peca) => peca.id !== id)
      );
    }
  };

  const montarLook = () => {
    navigate("/montar-look/resultado", {
      state: {
        ocasiao,
        clima,
        estilo,
        cor,
        pecasUsar,
        pecasEvitar,
        pecas,
      },
    });
  };

  const menuAtivo = (rota) =>
    window.location.pathname === rota ? "active" : "";

  const pecasFiltradas = pecas.filter((peca) => {
    const correspondeBusca =
      `${peca.name} ${peca.category}`
        .toLowerCase()
        .includes(busca.toLowerCase());

    const estaEmOutraLista =
      modalPecas === "usar"
        ? pecasEvitar.some((item) => item.id === peca.id)
        : pecasUsar.some((item) => item.id === peca.id);

    return correspondeBusca && !estaEmOutraLista;
  });

  return (
    <div className="closet-page">

      {/* SIDEBAR PADRÃO */}
      {/* SIDEBAR */}
      <aside className="closet-sidebar">

        <Link to="/home" className="closet-brand">
          <span>SEU CLOSET</span>
          <h2>GRWM</h2>
        </Link>

        <nav className="closet-nav">

          <Link
            to="/home"
            className={menuAtivo("/home") === "active"
              ? "closet-nav-item active"
              : "closet-nav-item"}
          >
            <Home size={17} strokeWidth={1.6} />
            <span>Início</span>
          </Link>

          <Link
            to="/closet"
            className={menuAtivo("/closet") === "active"
              ? "closet-nav-item active"
              : "closet-nav-item"}
          >
            <Shirt size={17} strokeWidth={1.6} />
            <span>Closet</span>
          </Link>

          <Link
            to="/looks"
            className={menuAtivo("/looks") === "active"
              ? "closet-nav-item active"
              : "closet-nav-item"}
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
            className={menuAtivo("/perfil") === "active"
              ? "closet-nav-item active"
              : "closet-nav-item"}
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
      <main className="closet-content combine-page">

        <Link to="/" className="combine-back">
          <ArrowLeft size={14} />
          Voltar
        </Link>

        <header className="combine-header">

          <div>

            <span className="home-eyebrow">
              PERSONALIZE SUA EXPERIÊNCIA
            </span>

            <h1>
              Montar meu look
            </h1>

            <p>
              Conte o que você procura e deixe o GRWM pensar
              na combinação para você.
            </p>

          </div>

          <div className="combine-header-icon">
            <Sparkles
              size={22}
              strokeWidth={1.4}
            />
          </div>

        </header>


        {/* 01 — OCASIÃO */}
        <section className="combine-section">

          <div className="combine-section-heading">

            <div>
              <span>01</span>
              <h2>Ocasião</h2>
            </div>

            <small>
              Onde você pretende usar o look?
            </small>

          </div>

          <div className="combine-options">

            {filtros.ocasiao.map((item) => (

              <button
                key={item}
                type="button"
                className={`combine-option ${ocasiao === item ? "selected" : ""
                  }`}
                onClick={() => setOcasiao(item)}
              >

                {item}

                {ocasiao === item && (
                  <Check size={14} />
                )}

              </button>

            ))}

          </div>

        </section>


        {/* 02 — CLIMA */}
        <section className="combine-section">

          <div className="combine-section-heading">

            <div>
              <span>02</span>
              <h2>Clima</h2>
            </div>

            <small>
              Como está o tempo?
            </small>

          </div>

          <div className="combine-options climate-options">

            <button
              type="button"
              className={`combine-option climate-option ${clima === "Quente" ? "selected" : ""
                }`}
              onClick={() => setClima("Quente")}
            >
              <Sun size={16} />
              Quente
            </button>

            <button
              type="button"
              className={`combine-option climate-option ${clima === "Ameno" ? "selected" : ""
                }`}
              onClick={() => setClima("Ameno")}
            >
              <CloudSun size={16} />
              Ameno
            </button>

            <button
              type="button"
              className={`combine-option climate-option ${clima === "Frio" ? "selected" : ""
                }`}
              onClick={() => setClima("Frio")}
            >
              <Snowflake size={16} />
              Frio
            </button>

          </div>

        </section>


        {/* 03 — ESTILO */}
        <section className="combine-section">

          <div className="combine-section-heading">

            <div>
              <span>03</span>
              <h2>Estilo</h2>
            </div>

            <small>
              Que estética você quer transmitir?
            </small>

          </div>

          <div className="combine-options">

            {filtros.estilo.map((item) => (

              <button
                key={item}
                type="button"
                className={`combine-option ${estilo === item ? "selected" : ""
                  }`}
                onClick={() => setEstilo(item)}
              >

                {item}

                {estilo === item && (
                  <Check size={14} />
                )}

              </button>

            ))}

          </div>

        </section>


        {/* 04 — CORES */}
        <section className="combine-section">

          <div className="combine-section-heading">

            <div>
              <span>04</span>
              <h2>Cores</h2>
            </div>

            <small>
              Existe alguma preferência?
            </small>

          </div>

          <div className="combine-options">

            {filtros.cores.map((item) => (

              <button
                key={item}
                type="button"
                className={`combine-option ${cor === item ? "selected" : ""
                  }`}
                onClick={() => setCor(item)}
              >

                {item}

                {cor === item && (
                  <Check size={14} />
                )}

              </button>

            ))}

          </div>

        </section>


        {/* 05 — QUERO USAR */}
        <section className="combine-section">

          <div className="combine-section-heading">

            <div>
              <span>05</span>
              <h2>Quero usar</h2>
            </div>

            <small>
              Escolha peças específicas
            </small>

          </div>

          <div className="selected-pieces-area">

            {pecasUsar.map((peca) => (

              <div
                className="selected-piece"
                key={peca.id}
              >

                <img
                  src={peca.image_url}
                  alt={peca.name}
                />

                <div>
                  <strong>{peca.name}</strong>
                  <span>{peca.category}</span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removerPeca(peca.id, "usar")
                  }
                >
                  <X size={13} />
                </button>

              </div>

            ))}

            <button
              type="button"
              className="add-piece-button"
              onClick={() => {
                setModalPecas("usar");
                setBusca("");
              }}
            >
              <Plus size={16} />
              Adicionar peças
            </button>

          </div>

        </section>


        {/* 06 — NÃO QUERO USAR */}
        <section className="combine-section">

          <div className="combine-section-heading">

            <div>
              <span>06</span>
              <h2>Não quero usar</h2>
            </div>

            <small>
              Peças que você prefere evitar
            </small>

          </div>

          <div className="selected-pieces-area">

            {pecasEvitar.map((peca) => (

              <div
                className="selected-piece"
                key={peca.id}
              >

                <img
                  src={peca.image_url}
                  alt={peca.name}
                />

                <div>
                  <strong>{peca.name}</strong>
                  <span>{peca.category}</span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removerPeca(peca.id, "evitar")
                  }
                >
                  <X size={13} />
                </button>

              </div>

            ))}

            <button
              type="button"
              className="add-piece-button"
              onClick={() => {
                setModalPecas("evitar");
                setBusca("");
              }}
            >
              <Plus size={16} />
              Adicionar peças
            </button>

          </div>

        </section>


        {/* RODAPÉ */}
        <div className="combine-footer">

          <div>
            <Sparkles size={16} />

            <span>
              O GRWM vai considerar suas preferências
              para montar a combinação.
            </span>
          </div>

          <button
            type="button"
            className="combine-submit"
            onClick={montarLook}
          >
            <Sparkles size={15} />
            Montar meu look
          </button>

        </div>

      </main>


      {/* MODAL DE SELEÇÃO DE PEÇAS */}
      {modalPecas && (

        <div
          className="piece-picker-overlay"
          onClick={() => setModalPecas(null)}
        >

          <div
            className="piece-picker-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="piece-picker-close"
              onClick={() => setModalPecas(null)}
            >
              <X size={17} />
            </button>

            <span className="home-eyebrow">
              {modalPecas === "usar"
                ? "QUERO USAR"
                : "NÃO QUERO USAR"}
            </span>

            <h2>
              {modalPecas === "usar"
                ? "Escolha suas peças"
                : "Escolha o que evitar"}
            </h2>

            <div className="piece-picker-search">

              <Search size={15} />

              <input
                type="text"
                placeholder="Buscar peça..."
                value={busca}
                onChange={(event) =>
                  setBusca(event.target.value)
                }
              />

            </div>

            <div className="piece-picker-grid">

              {pecasFiltradas.map((peca) => {

                const selecionada =
                  modalPecas === "usar"
                    ? pecasUsar.some(
                      (item) => item.id === peca.id
                    )
                    : pecasEvitar.some(
                      (item) => item.id === peca.id
                    );

                return (

                  <button
                    type="button"
                    className={`piece-picker-card ${selecionada ? "selected" : ""
                      }`}
                    key={peca.id}
                    onClick={() =>
                      selecionarPeca(peca)
                    }
                  >

                    <div className="piece-picker-image">

                      <img
                        src={peca.image_url}
                        alt={peca.name}
                      />

                      {selecionada && (
                        <div className="piece-picker-check">
                          <Check size={14} />
                        </div>
                      )}

                    </div>

                    <div className="piece-picker-info">
                      <strong>{peca.name}</strong>
                      <span>{peca.category}</span>
                    </div>

                  </button>

                );
              })}

            </div>

            <button
              type="button"
              className="piece-picker-done"
              onClick={() => setModalPecas(null)}
            >
              Confirmar seleção
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default CombinarLook;
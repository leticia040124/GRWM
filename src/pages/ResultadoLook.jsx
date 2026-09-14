import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Shirt,
  Star,
  Heart,
  Plane,
  Sparkles,
  UserRound,
  ArrowLeft,
  Heart as HeartIcon,
  RefreshCw,
  Bookmark,
  Check,
} from "lucide-react";

function ResultadoLook() {
  const location = useLocation();
  const navigate = useNavigate();

  const preferencias = location.state || {};

  const {
    ocasiao = "Casual",
    clima = "Ameno",
    estilo = "Minimalista",
    cor = "Neutras",
    pecasUsar = [],
    pecasEvitar = [],
    pecas = [],
  } = preferencias;

  // --------------------------------------------------
  // NORMALIZAÇÃO
  // --------------------------------------------------

  const normalizar = (valor) => {
    if (!valor) return "";

    return valor
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

  // --------------------------------------------------
  // CORES
  // --------------------------------------------------

  const coresEscuras = [
    "preto",
    "preta",
    "azul marinho",
    "marinho",
    "cinza escuro",
    "cinza",
    "vinho",
    "bordo",
    "marrom",
    "verde escuro",
  ];

  const coresClaras = [
    "branco",
    "branca",
    "bege",
    "creme",
    "off white",
    "off-white",
    "rosa claro",
    "azul claro",
    "verde claro",
    "amarelo",
  ];

  const coresNeutras = [
    "preto",
    "preta",
    "branco",
    "branca",
    "cinza",
    "bege",
    "creme",
    "off white",
    "off-white",
    "marrom",
  ];

  const corCombina = (corPeca, corPreferida) => {
    const peca = normalizar(corPeca);
    const preferida = normalizar(corPreferida);

    if (!peca || !preferida) {
      return false;
    }

    // Cor específica
    if (peca === preferida) {
      return true;
    }

    // Grupo de cores escuras
    if (preferida === "escuras") {
      return coresEscuras.includes(peca);
    }

    // Grupo de cores claras
    if (preferida === "claras") {
      return coresClaras.includes(peca);
    }

    // Grupo de cores neutras
    if (preferida === "neutras") {
      return coresNeutras.includes(peca);
    }

    return false;
  };


  const coresCombinam = (cor1, cor2) => {
  const primeira = normalizar(cor1);
  const segunda = normalizar(cor2);

  if (!primeira || !segunda) {
    return false;
  }

  // Mesma cor
  if (primeira === segunda) {
    return true;
  }

  // Cores neutras combinam entre si
  if (
    coresNeutras.includes(primeira) &&
    coresNeutras.includes(segunda)
  ) {
    return true;
  }

  // Preto combina com praticamente tudo
  if (
    ["preto", "preta"].includes(primeira) ||
    ["preto", "preta"].includes(segunda)
  ) {
    return true;
  }

  // Branco combina com praticamente tudo
  if (
    ["branco", "branca"].includes(primeira) ||
    ["branco", "branca"].includes(segunda)
  ) {
    return true;
  }

  return false;
};
  // --------------------------------------------------
  // PEÇAS OBRIGATÓRIAS
  // --------------------------------------------------

  const pecasObrigatorias = pecasUsar.filter(
    (peca) =>
      !pecasEvitar.some(
        (evitar) => evitar.id === peca.id
      )
  );

  // --------------------------------------------------
  // PEÇAS DISPONÍVEIS
  // --------------------------------------------------

  const pecasDisponiveis = pecas.filter(
    (peca) =>
      !pecasEvitar.some(
        (evitar) => evitar.id === peca.id
      ) &&
      !pecasObrigatorias.some(
        (obrigatoria) => obrigatoria.id === peca.id
      )
  );

  // --------------------------------------------------
  // PONTUAÇÃO
  // --------------------------------------------------

  const pontuarPeca = (peca) => {
    let pontos = 0;

    // Peça escolhida pelo usuário
    if (
      pecasUsar.some(
        (item) => item.id === peca.id
      )
    ) {
      pontos += 1000;
    }

    // Ocasião
    if (
      Array.isArray(peca.occasion) &&
      peca.occasion.some(
        (item) =>
          normalizar(item) === normalizar(ocasiao)
      )
    ) {
      pontos += 30;
    }

    // Clima
    if (
      peca.temperature &&
      normalizar(peca.temperature) ===
        normalizar(clima)
    ) {
      pontos += 20;
    }

    // Estilo
    if (
      peca.style &&
      normalizar(peca.style) ===
        normalizar(estilo)
    ) {
      pontos += 20;
    }

    // Cor
    if (
      peca.color &&
      corCombina(peca.color, cor)
    ) {
      pontos += 10;
    }

    return pontos;
  };

  // --------------------------------------------------
  // ORDENAÇÃO
  // --------------------------------------------------

  const pecasOrdenadas = [...pecasDisponiveis].sort(
    (a, b) => pontuarPeca(b) - pontuarPeca(a)
  );

  // --------------------------------------------------
  // CATEGORIAS DO LOOK
  // --------------------------------------------------

  const categoriasNecessarias = [
    {
      nome: "parte de cima",
      categorias: [
        "camiseta",
        "camisa",
        "blusa",
        "regata",
        "cropped",
      ],
    },
    {
      nome: "parte de baixo",
      categorias: [
        "calça",
        "calca",
        "shorts",
        "short",
        "saia",
      ],
    },
    {
      nome: "calçado",
      categorias: [
        "tênis",
        "tenis",
        "sapato",
        "sandália",
        "sandalia",
        "bota",
        "chinelo",
      ],
    },
  ];

  // --------------------------------------------------
  // PEÇAS SUGERIDAS
  // --------------------------------------------------

  const pecasSugeridas = categoriasNecessarias
    .map((grupo) => {
      // Primeiro procura uma peça obrigatória
      const obrigatoria = pecasObrigatorias.find(
        (peca) =>
          grupo.categorias.includes(
            normalizar(peca.category)
          )
      );

      if (obrigatoria) {
        return obrigatoria;
      }

      // Se não houver, pega a melhor peça disponível
      const melhorPeca = pecasOrdenadas.find(
        (peca) =>
          grupo.categorias.includes(
            normalizar(peca.category)
          )
      );

      return melhorPeca;
    })
    .filter(Boolean);

  // --------------------------------------------------
  // LOOK FINAL
  // --------------------------------------------------

  const idsJaSelecionados = new Set(
    pecasObrigatorias.map((peca) => peca.id)
  );

  const sugestoesNovas = pecasSugeridas.filter(
    (peca) => !idsJaSelecionados.has(peca.id)
  );

  const lookFinal = [
    ...pecasObrigatorias,
    ...sugestoesNovas,
  ];

  // --------------------------------------------------
  // AÇÕES
  // --------------------------------------------------

  const salvarLook = () => {
    alert("Look salvo com sucesso!");
  };

  const montarOutro = () => {
    navigate("/montar-look");
  };

  const menuAtivo = (rota) =>
    window.location.pathname === rota ? "active" : "";

  return (
    <div className="closet-page">

      {/* SIDEBAR */}
      <aside className="closet-sidebar">

        <Link to="/" className="closet-brand">
          <span>SEU CLOSET</span>
          <h2>GRWM</h2>
        </Link>

        <nav className="closet-nav">

          <Link
            to="/"
            className={`closet-nav-item ${menuAtivo("/")}`}
          >
            <Home size={17} strokeWidth={1.6} />
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
      <main className="closet-content result-look-page">

        <Link
          to="/montar-look"
          className="result-look-back"
        >
          <ArrowLeft size={14} strokeWidth={1.6} />
          Ajustar preferências
        </Link>


        {/* CABEÇALHO */}
        <header className="result-look-header">

          <div>

            <span className="home-eyebrow">
              SUA COMBINAÇÃO
            </span>

            <h1>
              Encontramos um look
              <br />
              para você.
            </h1>

            <p>
              Uma combinação pensada a partir das
              preferências que você escolheu.
            </p>

          </div>

          <div className="result-look-sparkle">
            <Sparkles
              size={25}
              strokeWidth={1.3}
            />
          </div>

        </header>


        {/* PREFERÊNCIAS */}
        <div className="result-look-preferences">

          <div>
            <span>OCASIÃO</span>
            <strong>{ocasiao}</strong>
          </div>

          <div>
            <span>CLIMA</span>
            <strong>{clima}</strong>
          </div>

          <div>
            <span>ESTILO</span>
            <strong>{estilo}</strong>
          </div>

          <div>
            <span>CORES</span>
            <strong>{cor}</strong>
          </div>

        </div>


        {/* LOOK */}
        <section className="result-look-main">

          <div className="result-look-title">

            <div>
              <span>01</span>
              <h2>Look sugerido</h2>
            </div>

            <span className="result-look-match">
              <Check size={12} />
              Combinação encontrada
            </span>

          </div>


          <div className="result-look-grid">

            {lookFinal.map((peca, index) => (

              <article
                className={`result-look-piece ${
                  index === 0
                    ? "result-look-piece-featured"
                    : ""
                }`}
                key={peca.id}
              >

                <div className="result-look-piece-image">

                  <img
                    src={peca.image_url}
                    alt={peca.name}
                  />

                  <div className="result-look-piece-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                </div>

                <div className="result-look-piece-info">

                  <div>

                    <strong>
                      {peca.name}
                    </strong>

                    <span>
                      {peca.category}
                    </span>

                  </div>

                  <button
                    type="button"
                    aria-label={`Favoritar ${peca.name}`}
                  >
                    <HeartIcon
                      size={15}
                      strokeWidth={1.5}
                    />
                  </button>

                </div>

              </article>

            ))}

          </div>

        </section>


        {/* EXPLICAÇÃO */}
        <section className="result-look-explanation">

          <div className="result-look-explanation-icon">
            <Sparkles
              size={18}
              strokeWidth={1.4}
            />
          </div>

          <div>

            <span>
              POR QUE ESSA COMBINAÇÃO?
            </span>

            <p>
              O look foi montado considerando
              <strong> {ocasiao.toLowerCase()}</strong>,
              clima <strong>{clima.toLowerCase()}</strong>
              {estilo &&
                ` e uma proposta ${estilo.toLowerCase()}`}
              . As peças escolhidas também respeitam
              suas preferências de uso e exclusão.
            </p>

          </div>

        </section>


        {/* AÇÕES */}
        <footer className="result-look-actions">

          <button
            type="button"
            className="result-look-secondary"
            onClick={montarOutro}
          >
            <RefreshCw
              size={14}
              strokeWidth={1.6}
            />
            Montar outro
          </button>

          <button
            type="button"
            className="result-look-primary"
            onClick={salvarLook}
          >
            <Bookmark
              size={14}
              strokeWidth={1.6}
            />
            Salvar look
          </button>

        </footer>

      </main>

    </div>
  );
}

export default ResultadoLook;
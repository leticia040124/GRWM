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

  /*
    Por enquanto, a montagem é simulada no front.
    Depois podemos substituir por uma lógica mais inteligente.
  */

  // Peças que o usuário escolheu obrigatoriamente usar
  const pecasObrigatorias = pecasUsar.filter(
    (peca) =>
      !pecasEvitar.some(
        (evitar) => evitar.id === peca.id
      )
  );

  // Peças do closet que podem ser usadas
  const pecasDisponiveis = pecas.filter(
    (peca) =>
      !pecasEvitar.some(
        (evitar) => evitar.id === peca.id
      ) &&
      !pecasObrigatorias.some(
        (obrigatoria) => obrigatoria.id === peca.id
      )
  );

const pontuarPeca = (peca) => {
  let pontos = 0;

    console.log("DADOS DA PEÇA:", {
    nome: peca.name,
    categoria: peca.category,
    occasion: peca.occasion,
    temperature: peca.temperature,
    style: peca.style,
    color: peca.color,
  });

  console.log("PREFERÊNCIAS:", {
    ocasiao,
    clima,
    estilo,
    cor,
  });

  

  let pontosEscolhida = 0;
  let pontosOcasiao = 0;
  let pontosClima = 0;
  let pontosEstilo = 0;
  let pontosCor = 0;

  

  // Peça escolhida pelo usuário
  if (
    pecasUsar.some(
      (item) => item.id === peca.id
    )
  ) {
    pontosEscolhida = 100;
  }

  // Ocasião
  if (
    peca.occasion &&
    peca.occasion.some(
      (item) =>
        item.toLowerCase() ===
        ocasiao.toLowerCase()
    )
  ) {
    pontosOcasiao = 30;
  }

  // Clima
  if (
    peca.temperature &&
    peca.temperature.toLowerCase() ===
      clima.toLowerCase()
  ) {
    pontosClima = 20;
  }

  // Estilo
  if (
    peca.style &&
    peca.style.toLowerCase() ===
      estilo.toLowerCase()
  ) {
    pontosEstilo = 20;
  }

  // Cor
  if (
    peca.color &&
    peca.color.toLowerCase() ===
      cor.toLowerCase()
  ) {
    pontosCor = 10;
  }

  pontos =
    pontosEscolhida +
    pontosOcasiao +
    pontosClima +
    pontosEstilo +
    pontosCor;

  console.log("---- PONTUAÇÃO DA PEÇA ----");
  console.log("Nome:", peca.name);
  console.log("Categoria:", peca.category);
  console.log("Ocasião:", pontosOcasiao);
  console.log("Clima:", pontosClima);
  console.log("Estilo:", pontosEstilo);
  console.log("Cor:", pontosCor);
  console.log("Escolhida para usar:", pontosEscolhida);
  console.log("TOTAL:", pontos);

  return pontos;
};

  const pecasOrdenadas = [...pecasDisponiveis].sort(
    (a, b) => pontuarPeca(b) - pontuarPeca(a)
  );

  console.log(
    "PEÇAS ORDENADAS:",
    pecasOrdenadas.map((peca) => ({
      nome: peca.name,
      categoria: peca.category,
      pontos: pontuarPeca(peca),
    }))
  );

  // Categorias básicas que queremos no look
  const categoriasNecessarias = [
    "Blusas",
    "Calças",
    "Calçados",
  ];

  // Procura uma peça para cada categoria
  const pecasSugeridas = categoriasNecessarias
    .map((categoria) => {
      const obrigatoria = pecasObrigatorias.find(
        (peca) => peca.category === categoria
      );

      if (obrigatoria) {
        return obrigatoria;
      }

      return pecasOrdenadas.find(
        (peca) => peca.category === categoria
      );
    })
    .filter(Boolean);

  // Junta as peças obrigatórias com as sugeridas
  const lookFinal = [
    ...pecasObrigatorias,
    ...pecasSugeridas.filter(
      (peca) =>
        !pecasObrigatorias.some(
          (obrigatoria) => obrigatoria.id === peca.id
        )
    ),
  ].slice(0, 5);

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
                className={`result-look-piece ${index === 0
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
                    0{index + 1}
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
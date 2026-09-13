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

const pecasBase = [
  {
    id: 1,
    nome: "Camiseta branca",
    categoria: "Blusas",
    imagem:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    nome: "Blazer preto",
    categoria: "Casacos",
    imagem:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    nome: "Jeans reto",
    categoria: "Calças",
    imagem:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    nome: "Calça preta",
    categoria: "Calças",
    imagem:
      "https://images.unsplash.com/photo-1506629905607-d9c297d5d6a1?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 5,
    nome: "Tênis branco",
    categoria: "Calçados",
    imagem:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 6,
    nome: "Camisa branca",
    categoria: "Blusas",
    imagem:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 7,
    nome: "Bota preta",
    categoria: "Calçados",
    imagem:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 8,
    nome: "Blusa bege",
    categoria: "Blusas",
    imagem:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80",
  },
];

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
  } = preferencias;

  /*
    Por enquanto, a montagem é simulada no front.
    Quando entrarmos na parte de IA/backend,
    essa lógica será substituída pela recomendação real.
  */

  const pecasObrigatorias = pecasUsar.filter(
    (peca) =>
      !pecasEvitar.some(
        (evitar) => evitar.id === peca.id
      )
  );

  const pecasDisponiveis = pecasBase.filter(
    (peca) =>
      !pecasEvitar.some(
        (evitar) => evitar.id === peca.id
      ) &&
      !pecasObrigatorias.some(
        (obrigatoria) => obrigatoria.id === peca.id
      )
  );

  const categoriasNecessarias = [
    "Blusas",
    "Calças",
    "Calçados",
  ];

  const pecasSugeridas = categoriasNecessarias.map(
    (categoria) => {
      const obrigatoria = pecasObrigatorias.find(
        (peca) => peca.categoria === categoria
      );

      if (obrigatoria) {
        return obrigatoria;
      }

      return pecasDisponiveis.find(
        (peca) => peca.categoria === categoria
      );
    }
  ).filter(Boolean);

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
            to="/looks"
            className="closet-nav-item"
          >
            <Plane size={17} strokeWidth={1.6} />
            <span>Viagem</span>
          </Link>

          <Link
            to="/looks"
            className="closet-nav-item"
          >
            <Heart size={17} strokeWidth={1.6} />
            <span>Favoritos</span>
          </Link>

          <Link
            to="/looks"
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
                    src={peca.imagem}
                    alt={peca.nome}
                  />

                  <div className="result-look-piece-number">
                    0{index + 1}
                  </div>

                </div>

                <div className="result-look-piece-info">

                  <div>
                    <strong>
                      {peca.nome}
                    </strong>

                    <span>
                      {peca.categoria}
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label={`Favoritar ${peca.nome}`}
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
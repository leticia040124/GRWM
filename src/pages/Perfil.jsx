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
  Camera,
  ChevronRight,
  Check,
  ArrowLeft,
} from "lucide-react";

import "../App.css";

function Perfil() {
  const location = useLocation();
  const navigate = useNavigate();

  const [nome, setNome] = useState("Loren");
  const [email, setEmail] = useState("loren@email.com");
  const [editando, setEditando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const [estilos, setEstilos] = useState([
    "Minimalista",
    "Elegante",
    "Casual",
  ]);

  const estilosDisponiveis = [
    "Minimalista",
    "Elegante",
    "Casual",
    "Street",
    "Romântico",
    "Esportivo",
  ];

  const menuAtivo = (rota) => {
    return location.pathname === rota
      ? "closet-nav-item active"
      : "closet-nav-item";
  };

  const alternarEstilo = (estilo) => {
    setEstilos((atual) =>
      atual.includes(estilo)
        ? atual.filter((item) => item !== estilo)
        : [...atual, estilo]
    );
  };

  const salvarPerfil = (event) => {
    event.preventDefault();

    setEditando(false);
    setSalvo(true);

    setTimeout(() => {
      setSalvo(false);
    }, 2500);
  };

  const sair = () => {
    navigate("/login");
  };

  return (
    <div className="closet-page profile-page">

      {/* SIDEBAR */}
      <aside className="closet-sidebar">

        <Link to="/home" className="closet-brand">
          <span>SEU CLOSET</span>
          <h2>GRWM</h2>
        </Link>

        <nav className="closet-nav">

          <Link to="/home" className={menuAtivo("/home")}>
            <HomeIcon size={17} strokeWidth={1.6} />
            <span>Início</span>
          </Link>

          <Link to="/closet" className={menuAtivo("/closet")}>
            <Shirt size={17} strokeWidth={1.6} />
            <span>Closet</span>
          </Link>

          <Link to="/looks" className={menuAtivo("/looks")}>
            <Star size={17} strokeWidth={1.6} />
            <span>Looks</span>
          </Link>

          <Link to="/viagem" className="closet-nav-item">
            <Plane size={17} strokeWidth={1.6} />
            <span>Viagem</span>
          </Link>

          <Link to="/favoritos" className="closet-nav-item">
            <Heart size={17} strokeWidth={1.6} />
            <span>Favoritos</span>
          </Link>

          <Link to="/inspiracao" className="closet-nav-item">
            <Sparkles size={17} strokeWidth={1.6} />
            <span>Inspiração</span>
          </Link>

          <Link to="/perfil" className={menuAtivo("/perfil")}>
            <UserRound size={17} strokeWidth={1.6} />
            <span>Perfil</span>
          </Link>

        </nav>

        <div className="closet-motto">
          sem limites.
        </div>

      </aside>


      {/* CONTEÚDO */}
      <main className="closet-content profile-content">

        <Link to="/" className="profile-back">
          <ArrowLeft size={14} />
          Voltar para início
        </Link>

        <header className="profile-header">

          <div>
            <span className="home-eyebrow">
              MINHA CONTA
            </span>

            <h1>
              Perfil
            </h1>

            <p>
              Cuide das suas informações e personalize sua experiência no GRWM.
            </p>
          </div>

          {!editando && (
            <button
              className="profile-edit-button"
              onClick={() => setEditando(true)}
            >
              Editar perfil
            </button>
          )}

        </header>


        {salvo && (
          <div className="profile-success">
            <Check size={15} />
            Alterações salvas com sucesso.
          </div>
        )}


        {/* PERFIL + PREFERÊNCIAS */}
        <section className="profile-layout">

          {/* CARD DO PERFIL */}
          <div className="profile-main-card">

            <div className="profile-cover">

              <div className="profile-avatar">

                <span>
                  {nome.charAt(0).toUpperCase()}
                </span>

                <button
                  className="profile-camera"
                  type="button"
                  aria-label="Alterar foto"
                >
                  <Camera size={13} />
                </button>

              </div>

            </div>


            <div className="profile-card-content">

              {editando ? (

                <form
                  className="profile-form"
                  onSubmit={salvarPerfil}
                >

                  <div className="profile-field">

                    <label htmlFor="perfil-nome">
                      Nome
                    </label>

                    <input
                      id="perfil-nome"
                      type="text"
                      value={nome}
                      onChange={(event) =>
                        setNome(event.target.value)
                      }
                    />

                  </div>


                  <div className="profile-field">

                    <label htmlFor="perfil-email">
                      E-mail
                    </label>

                    <input
                      id="perfil-email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                    />

                  </div>


                  <div className="profile-form-actions">

                    <button
                      type="button"
                      className="profile-cancel-button"
                      onClick={() => setEditando(false)}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="profile-save-button"
                    >
                      Salvar alterações
                    </button>

                  </div>

                </form>

              ) : (

                <>

                  <span className="profile-card-eyebrow">
                    SUA CONTA
                  </span>

                  <h2>
                    {nome}
                  </h2>

                  <p className="profile-email">
                    {email}
                  </p>


                  <div className="profile-divider" />


                  <div className="profile-stats">

                    <div>
                      <strong>24</strong>
                      <span>Peças</span>
                    </div>

                    <div>
                      <strong>08</strong>
                      <span>Looks</span>
                    </div>

                    <div>
                      <strong>05</strong>
                      <span>Favoritos</span>
                    </div>

                  </div>

                </>

              )}

            </div>

          </div>


          {/* PREFERÊNCIAS */}
          <div className="profile-preferences-card">

            <div className="profile-section-heading">

              <span>
                PERSONALIZAÇÃO
              </span>

              <h2>
                Seu estilo
              </h2>

              <p>
                Escolha os estilos que mais combinam com você.
              </p>

            </div>


            <div className="profile-style-list">

              {estilosDisponiveis.map((estilo) => {

                const selecionado = estilos.includes(estilo);

                return (
                  <button
                    key={estilo}
                    type="button"
                    className={`profile-style-option ${
                      selecionado ? "selected" : ""
                    }`}
                    onClick={() => alternarEstilo(estilo)}
                  >

                    <span>
                      {estilo}
                    </span>

                    {selecionado && (
                      <Check size={14} />
                    )}

                  </button>
                );

              })}

            </div>

          </div>

        </section>


        {/* CONFIGURAÇÕES */}
        <section className="profile-settings">

          <div className="profile-settings-heading">

            <span>
              CONFIGURAÇÕES
            </span>

            <h2>
              Conta
            </h2>

          </div>


          <div className="profile-settings-list">

            <button
              type="button"
              className="profile-setting-item"
            >

              <div>
                <strong>
                  Alterar senha
                </strong>

                <span>
                  Atualize sua senha de acesso
                </span>
              </div>

              <ChevronRight size={16} />

            </button>


            <button
              type="button"
              className="profile-setting-item"
            >

              <div>
                <strong>
                  Preferências
                </strong>

                <span>
                  Personalize sua experiência
                </span>
              </div>

              <ChevronRight size={16} />

            </button>


            <button
              type="button"
              className="profile-setting-item logout"
              onClick={sair}
            >

              <div>
                <strong>
                  Sair da conta
                </strong>

                <span>
                  Voltar para a tela de login
                </span>
              </div>

              <ChevronRight size={16} />

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Perfil;
import { useRef, useState } from "react";
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
  Palette,
  CalendarDays,
  User,
  LockKeyhole,
  LogOut,
  X,
} from "lucide-react";

import "../App.css";

function Perfil() {
  const location = useLocation();
  const navigate = useNavigate();
  const inputFotoRef = useRef(null);

  const [nome, setNome] = useState("Loren");
  const [email, setEmail] = useState("loren@email.com");

  const [nomeTemporario, setNomeTemporario] = useState("Loren");
  const [emailTemporario, setEmailTemporario] =
    useState("loren@email.com");

  const [editando, setEditando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const [foto, setFoto] = useState(null);

  const [estilos, setEstilos] = useState([
    "Minimalista",
    "Elegante",
    "Casual",
  ]);

  const [cores, setCores] = useState([
    "Preto",
    "Branco",
    "Marrom",
  ]);

  const [ocasioes, setOcasioes] = useState([
    "Dia a dia",
    "Faculdade",
    "Passeios",
  ]);

  const estilosDisponiveis = [
    "Minimalista",
    "Elegante",
    "Casual",
    "Street",
    "Romântico",
    "Esportivo",
  ];

  const coresDisponiveis = [
    "Preto",
    "Branco",
    "Marrom",
    "Bege",
    "Vermelho",
    "Azul",
    "Verde",
    "Rosa",
  ];

  const ocasioesDisponiveis = [
    "Dia a dia",
    "Faculdade",
    "Trabalho",
    "Passeios",
    "Festas",
    "Eventos",
    "Viagens",
  ];

  const menuAtivo = (rota) => {
    return location.pathname === rota
      ? "closet-nav-item active"
      : "closet-nav-item";
  };

  const alternarItem = (item, setLista) => {
    setLista((atual) =>
      atual.includes(item)
        ? atual.filter((valor) => valor !== item)
        : [...atual, item]
    );
  };

  const iniciarEdicao = () => {
    setNomeTemporario(nome);
    setEmailTemporario(email);
    setEditando(true);
  };

  const cancelarEdicao = () => {
    setNomeTemporario(nome);
    setEmailTemporario(email);
    setEditando(false);
  };

  const salvarPerfil = (event) => {
    event.preventDefault();

    if (!nomeTemporario.trim() || !emailTemporario.trim()) {
      return;
    }

    setNome(nomeTemporario.trim());
    setEmail(emailTemporario.trim());

    setEditando(false);
    setSalvo(true);

    setTimeout(() => {
      setSalvo(false);
    }, 2500);
  };

  const abrirSeletorFoto = () => {
    inputFotoRef.current?.click();
  };

  const alterarFoto = (event) => {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = () => {
      setFoto(leitor.result);
    };

    leitor.readAsDataURL(arquivo);
  };

  const removerFoto = () => {
    setFoto(null);

    if (inputFotoRef.current) {
      inputFotoRef.current.value = "";
    }
  };

  const sair = () => {
    navigate("/login");
  };

  return (
    <div className="closet-page profile-page">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="closet-sidebar">

        <Link to="/home" className="closet-brand">
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


      {/* =========================
          CONTEÚDO
      ========================= */}

      <main className="closet-content profile-content">

        {/* VOLTAR */}

        <Link
          to="/home"
          className="profile-back"
        >
          <ChevronRight
            size={14}
            style={{
              transform: "rotate(180deg)",
            }}
          />
          Voltar para início
        </Link>


        {/* HEADER */}

        <header className="profile-header">

          <div>

            <span className="home-eyebrow">
              MINHA CONTA
            </span>

            <h1>
              Perfil
            </h1>

            <p>
              Cuide das suas informações e
              personalize sua experiência no GRWM.
            </p>

          </div>

          {!editando && (
            <button
              type="button"
              className="profile-edit-button"
              onClick={iniciarEdicao}
            >
              Editar perfil
            </button>
          )}

        </header>


        {/* MENSAGEM DE SUCESSO */}

        {salvo && (
          <div className="profile-success">

            <Check
              size={15}
              strokeWidth={1.8}
            />

            <span>
              Alterações salvas com sucesso.
            </span>

          </div>
        )}


        {/* =========================
            PERFIL + PREFERÊNCIAS
        ========================= */}

        <section className="profile-layout">

          {/* CARD PRINCIPAL */}

          <div className="profile-main-card">

            <div className="profile-cover">

              <div className="profile-avatar">

                {foto ? (
                  <img
                    src={foto}
                    alt="Foto de perfil"
                  />
                ) : (
                  <span>
                    {nome.charAt(0).toUpperCase()}
                  </span>
                )}

                <button
                  type="button"
                  className="profile-camera"
                  onClick={abrirSeletorFoto}
                  aria-label="Alterar foto de perfil"
                >
                  <Camera
                    size={13}
                    strokeWidth={1.6}
                  />
                </button>

                <input
                  ref={inputFotoRef}
                  type="file"
                  accept="image/*"
                  onChange={alterarFoto}
                  style={{ display: "none" }}
                />

              </div>

              {foto && (
                <button
                  type="button"
                  className="profile-remove-photo"
                  onClick={removerFoto}
                >
                  <X size={13} />
                  Remover foto
                </button>
              )}

            </div>


            <div className="profile-card-content">

              {editando ? (

                /* =========================
                   FORMULÁRIO DE EDIÇÃO
                ========================= */

                <form
                  className="profile-form"
                  onSubmit={salvarPerfil}
                >

                  <div className="profile-form-title">

                    <span className="profile-card-eyebrow">
                      EDITANDO PERFIL
                    </span>

                    <h2>
                      Suas informações
                    </h2>

                  </div>


                  <div className="profile-field">

                    <label htmlFor="perfil-nome">
                      Nome
                    </label>

                    <div className="profile-input-wrapper">

                      <User
                        size={15}
                        strokeWidth={1.5}
                      />

                      <input
                        id="perfil-nome"
                        type="text"
                        value={nomeTemporario}
                        onChange={(event) =>
                          setNomeTemporario(
                            event.target.value
                          )
                        }
                        placeholder="Seu nome"
                        required
                      />

                    </div>

                  </div>


                  <div className="profile-field">

                    <label htmlFor="perfil-email">
                      E-mail
                    </label>

                    <div className="profile-input-wrapper">

                      <span className="profile-input-at">
                        @
                      </span>

                      <input
                        id="perfil-email"
                        type="email"
                        value={emailTemporario}
                        onChange={(event) =>
                          setEmailTemporario(
                            event.target.value
                          )
                        }
                        placeholder="seuemail@email.com"
                        required
                      />

                    </div>

                  </div>


                  <div className="profile-form-actions">

                    <button
                      type="button"
                      className="profile-cancel-button"
                      onClick={cancelarEdicao}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="profile-save-button"
                    >
                      <Check
                        size={15}
                        strokeWidth={1.8}
                      />
                      Salvar alterações
                    </button>

                  </div>

                </form>

              ) : (

                /* =========================
                   VISUALIZAÇÃO DO PERFIL
                ========================= */

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

                      <strong>
                        24
                      </strong>

                      <span>
                        Peças
                      </span>

                    </div>

                    <div>

                      <strong>
                        08
                      </strong>

                      <span>
                        Looks
                      </span>

                    </div>

                    <div>

                      <strong>
                        05
                      </strong>

                      <span>
                        Favoritos
                      </span>

                    </div>

                  </div>

                </>

              )}

            </div>

          </div>


          {/* =========================
              SEU ESTILO
          ========================= */}

          <div className="profile-preferences-card">

            <div className="profile-section-heading">

              <span>
                PERSONALIZAÇÃO
              </span>

              <h2>
                Seu estilo
              </h2>

              <p>
                Escolha os estilos que mais combinam
                com você.
              </p>

            </div>


            <div className="profile-style-list">

              {estilosDisponiveis.map((estilo) => {

                const selecionado =
                  estilos.includes(estilo);

                return (
                  <button
                    key={estilo}
                    type="button"
                    className={`profile-style-option ${
                      selecionado ? "selected" : ""
                    }`}
                    onClick={() =>
                      alternarItem(
                        estilo,
                        setEstilos
                      )
                    }
                  >

                    <span>
                      {estilo}
                    </span>

                    {selecionado && (
                      <Check
                        size={14}
                        strokeWidth={1.8}
                      />
                    )}

                  </button>
                );

              })}

            </div>

          </div>

        </section>


        {/* =========================
            PREFERÊNCIAS
        ========================= */}

        <section className="profile-extra-preferences">

          {/* CORES */}

          <div className="profile-preference-block">

            <div className="profile-preference-heading">

              <div className="profile-preference-icon">
                <Palette
                  size={17}
                  strokeWidth={1.5}
                />
              </div>

              <div>

                <span>
                  CORES FAVORITAS
                </span>

                <h2>
                  Paleta que combina com você
                </h2>

              </div>

            </div>


            <div className="profile-chip-list">

              {coresDisponiveis.map((cor) => {

                const selecionada =
                  cores.includes(cor);

                return (
                  <button
                    key={cor}
                    type="button"
                    className={`profile-chip ${
                      selecionada
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      alternarItem(
                        cor,
                        setCores
                      )
                    }
                  >

                    {cor}

                    {selecionada && (
                      <Check
                        size={12}
                        strokeWidth={1.8}
                      />
                    )}

                  </button>
                );

              })}

            </div>

          </div>


          {/* OCASIÕES */}

          <div className="profile-preference-block">

            <div className="profile-preference-heading">

              <div className="profile-preference-icon">
                <CalendarDays
                  size={17}
                  strokeWidth={1.5}
                />
              </div>

              <div>

                <span>
                  OCASIÕES
                </span>

                <h2>
                  Onde você mais usa seus looks
                </h2>

              </div>

            </div>


            <div className="profile-chip-list">

              {ocasioesDisponiveis.map((ocasiao) => {

                const selecionada =
                  ocasioes.includes(ocasiao);

                return (
                  <button
                    key={ocasiao}
                    type="button"
                    className={`profile-chip ${
                      selecionada
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      alternarItem(
                        ocasiao,
                        setOcasioes
                      )
                    }
                  >

                    {ocasiao}

                    {selecionada && (
                      <Check
                        size={12}
                        strokeWidth={1.8}
                      />
                    )}

                  </button>
                );

              })}

            </div>

          </div>

        </section>


        {/* =========================
            CONFIGURAÇÕES
        ========================= */}

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
              onClick={() =>
                alert(
                  "A alteração de senha será implementada na próxima etapa."
                )
              }
            >

              <div className="profile-setting-left">

                <div className="profile-setting-icon">
                  <LockKeyhole
                    size={16}
                    strokeWidth={1.5}
                  />
                </div>

                <div>

                  <strong>
                    Alterar senha
                  </strong>

                  <span>
                    Atualize sua senha de acesso
                  </span>

                </div>

              </div>

              <ChevronRight
                size={16}
                strokeWidth={1.5}
              />

            </button>


            <button
              type="button"
              className="profile-setting-item"
              onClick={() =>
                window.scrollTo({
                  top:
                    document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
            >

              <div className="profile-setting-left">

                <div className="profile-setting-icon">
                  <Sparkles
                    size={16}
                    strokeWidth={1.5}
                  />
                </div>

                <div>

                  <strong>
                    Preferências
                  </strong>

                  <span>
                    Personalize sua experiência
                  </span>

                </div>

              </div>

              <ChevronRight
                size={16}
                strokeWidth={1.5}
              />

            </button>


            <button
              type="button"
              className="profile-setting-item logout"
              onClick={sair}
            >

              <div className="profile-setting-left">

                <div className="profile-setting-icon">
                  <LogOut
                    size={16}
                    strokeWidth={1.5}
                  />
                </div>

                <div>

                  <strong>
                    Sair da conta
                  </strong>

                  <span>
                    Voltar para a tela de login
                  </span>

                </div>

              </div>

              <ChevronRight
                size={16}
                strokeWidth={1.5}
              />

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Perfil;
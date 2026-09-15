import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import "../App.css";

function Cadastro() {
  const navigate = useNavigate();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");

  const cadastrar = (event) => {
    event.preventDefault();

    if (senha !== confirmacao) {
      alert("As senhas precisam ser iguais.");
      return;
    }

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Link to="/" className="auth-brand-link">
          <span>SEU CLOSET</span>
          <h1>GRWM</h1>
        </Link>
      </div>

      <main className="auth-main">
        <section className="auth-card auth-card-register">
          <div className="auth-heading">
            <span className="auth-eyebrow">COMECE POR AQUI</span>

            <h2>Seu estilo.<br />Seu espaço.</h2>

            <p>
              Crie sua conta e tenha um lugar para guardar
              suas peças, organizar seu Closet e criar looks.
            </p>
          </div>

          <form className="auth-form" onSubmit={cadastrar}>
            <div className="auth-field">
              <label htmlFor="nome">Nome</label>

              <input
                id="nome"
                type="text"
                placeholder="Como podemos te chamar?"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="email">E-mail</label>

              <input
                id="email"
                type="email"
                placeholder="seuemail@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="auth-form-row">
              <div className="auth-field">
                <label htmlFor="senha">Senha</label>

                <div className="auth-password">
                  <input
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Sua senha"
                    value={senha}
                    onChange={(event) =>
                      setSenha(event.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() =>
                      setMostrarSenha(!mostrarSenha)
                    }
                    aria-label={
                      mostrarSenha
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                  >
                    {mostrarSenha ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="confirmacao">
                  Confirmar senha
                </label>

                <div className="auth-password">
                  <input
                    id="confirmacao"
                    type={
                      mostrarConfirmacao
                        ? "text"
                        : "password"
                    }
                    placeholder="Repita sua senha"
                    value={confirmacao}
                    onChange={(event) =>
                      setConfirmacao(event.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() =>
                      setMostrarConfirmacao(
                        !mostrarConfirmacao
                      )
                    }
                    aria-label={
                      mostrarConfirmacao
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                  >
                    {mostrarConfirmacao ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="auth-submit">
              Criar minha conta
              <ArrowRight size={15} />
            </button>
          </form>

          <div className="auth-footer">
            <span>Já tem uma conta?</span>

            <Link to="/login">
              Entrar
            </Link>
          </div>
        </section>
      </main>

      <div className="auth-bottom">
        <span>GRWM</span>
        <span>sem limites.</span>
      </div>
    </div>
  );
}

export default Cadastro;
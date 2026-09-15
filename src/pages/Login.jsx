import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const entrar = (event) => {
    event.preventDefault();

    // Depois vamos colocar a validação/login real aqui.
    navigate("/home");
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
        <section className="auth-card">
          <div className="auth-heading">
            <span className="auth-eyebrow">
              BEM-VINDA DE VOLTA
            </span>

            <h2>
              Seu closet
              <br />
              estava esperando.
            </h2>

            <p>
              Entre na sua conta para continuar organizando
              suas peças e criando novos looks.
            </p>
          </div>

          <form className="auth-form" onSubmit={entrar}>
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

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="senha">Senha</label>

                <button
                  type="button"
                  className="auth-forgot"
                >
                  Esqueci minha senha
                </button>
              </div>

              <div className="auth-password">
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  required
                />

                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
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

            <button
              type="submit"
              className="auth-submit"
            >
              Entrar
              <ArrowRight size={15} />
            </button>
          </form>

          <div className="auth-footer">
            <span>Ainda não tem uma conta?</span>

            <Link to="/cadastro">
              Criar minha conta
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

export default Login;
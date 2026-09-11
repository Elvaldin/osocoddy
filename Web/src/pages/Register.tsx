import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'
import './Auth.css'

function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await registerUser({
        username,
        email,
        password,
        confirmPassword,
      })

      navigate('/login')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Ocurrió un error inesperado.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <section className="auth-info">
          <Link to="/" className="auth-logo">
            <span className="auth-logo-bear">
              🐻
            </span>

            <span>
              oso<span>Coddy</span>
            </span>
          </Link>

          <h1>
            Empieza tu camino
            <span>como developer.</span>
          </h1>

          <p>
            Aprende programación paso a paso,
            completa retos y desarrolla proyectos
            para tu portafolio.
          </p>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <div className="auth-benefit-icon">
                🧠
              </div>
              Aprende desde los fundamentos.
            </div>

            <div className="auth-benefit">
              <div className="auth-benefit-icon">
                💻
              </div>
              Practica con diferentes lenguajes.
            </div>

            <div className="auth-benefit">
              <div className="auth-benefit-icon">
                🏆
              </div>
              Guarda tu progreso y consigue logros.
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <h2>Crear cuenta</h2>

            <p>
              Crea tu cuenta gratuita en osoCoddy.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="username">
                Nombre de usuario
              </label>

              <input
                id="username"
                type="text"
                placeholder="Tu nombre"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                placeholder="Crea una contraseña"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="new-password"
                required
              />

              <p className="password-help">
                Utiliza mínimo 8 caracteres.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">
                Confirmar contraseña
              </label>

              <input
                id="confirm-password"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <p className="auth-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? 'Creando cuenta...'
                : 'Crear mi cuenta'}
            </button>
          </form>

          <div className="auth-footer">
            ¿Ya tienes una cuenta?{' '}

            <Link to="/login">
              Iniciar sesión
            </Link>
          </div>

          <Link to="/" className="auth-back">
            ← Regresar al inicio
          </Link>
        </section>
      </div>
    </div>
  )
}

export default Register
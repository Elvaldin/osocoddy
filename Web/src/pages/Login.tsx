import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import './Auth.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await loginUser({
        email,
        password,
      })

      localStorage.setItem(
        'osocoddy_token',
        response.token
      )

      localStorage.setItem(
        'osocoddy_user',
        JSON.stringify(response.user)
      )

      navigate('/dashboard')
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
            Continúa
            <span>aprendiendo.</span>
          </h1>

          <p>
            Regresa a tus cursos, continúa tus
            lecciones y sigue construyendo tu
            camino como desarrollador.
          </p>

          <div className="auth-benefits">

            <div className="auth-benefit">
              <div className="auth-benefit-icon">
                📚
              </div>

              Continúa exactamente donde te quedaste.
            </div>

            <div className="auth-benefit">
              <div className="auth-benefit-icon">
                ⭐
              </div>

              Acumula XP mientras completas lecciones.
            </div>

            <div className="auth-benefit">
              <div className="auth-benefit-icon">
                🚀
              </div>

              Convierte lo aprendido en proyectos reales.
            </div>

          </div>
        </section>

        <section className="auth-card">

          <div className="auth-card-header">
            <h2>Iniciar sesión</h2>

            <p>
              Ingresa tus datos para continuar.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

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
                placeholder="Tu contraseña"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
                required
              />
            </div>

            <div className="auth-form-row">

              <label className="remember">
                <input type="checkbox" />

                Recordarme
              </label>

              <a
                href="#"
                className="forgot-password"
              >
                ¿Olvidaste tu contraseña?
              </a>

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
                ? 'Iniciando sesión...'
                : 'Iniciar sesión'}
            </button>

          </form>

          <div className="auth-footer">
            ¿Aún no tienes una cuenta?{' '}

            <Link to="/register">
              Crear cuenta
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

export default Login
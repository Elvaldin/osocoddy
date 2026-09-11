import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="navbar-bear">🐻</span>

        <span>
          oso<span>Coddy</span>
        </span>
      </Link>

      <nav className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/courses">Cursos</Link>
        <a href="#rutas">Rutas</a>
        <a href="#sobre-nosotros">Nosotros</a>
      </nav>

      <div className="navbar-actions">
        <Link to="/login" className="login-link">
          Iniciar sesión
        </Link>

        <Link to="/register" className="register-link">
          Crear cuenta
        </Link>
      </div>
    </header>
  )
}

export default Navbar
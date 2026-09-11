import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Home.css'

const languages = [
  {
    name: 'Python',
    icon: '🐍',
    description: 'Aprende programación desde cero con uno de los lenguajes más populares.',
  },
  {
    name: 'Java',
    icon: '☕',
    description: 'Domina programación orientada a objetos y desarrolla aplicaciones robustas.',
  },
  {
    name: 'C#',
    icon: '🟣',
    description: 'Aprende C# y prepárate para desarrollar aplicaciones con .NET.',
  },
  {
    name: 'JavaScript',
    icon: '🟨',
    description: 'Construye páginas y aplicaciones web interactivas.',
  },
]

function Home() {
  return (
    <div className="home">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              🐻 Aprende · Programa · Construye
            </div>

            <h1>
              Aprende programación
              <span> desde cero.</span>
            </h1>

            <p className="hero-description">
              Aprende lenguajes, desarrolla tus habilidades y construye
              proyectos reales mientras avanzas paso a paso.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="hero-primary">
                Comenzar a aprender
              </Link>

              <Link to="/courses" className="hero-secondary">
                Explorar cursos
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <strong>4+</strong>
                <span>Lenguajes</span>
              </div>

              <div>
                <strong>50+</strong>
                <span>Lecciones</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>Práctico</span>
              </div>
            </div>
          </div>

          <div className="coddy-card">
            <div className="coddy-avatar">
              🐻
            </div>

            <h2>¡Hola! Soy Coddy</h2>

            <p>
              Te acompañaré durante tu camino para convertirte
              en desarrollador.
            </p>

            <div className="code-window">
              <div className="code-window-header">
                <span></span>
                <span></span>
                <span></span>

                <small>main.py</small>
              </div>

              <pre>
                <code>
{`nombre = "osoCoddy"

print(f"Hola, {nombre}! 🐻")`}
                </code>
              </pre>
            </div>

            <div className="xp-badge">
              ⭐ +100 XP
            </div>
          </div>
        </section>

        <section className="languages-section">
          <div className="section-title">
            <span>EMPIEZA TU CAMINO</span>

            <h2>¿Qué quieres aprender?</h2>

            <p>
              Elige un lenguaje y comienza desde los fundamentos.
            </p>
          </div>

          <div className="languages-grid">
            {languages.map((language) => (
              <article
                className="language-card"
                key={language.name}
              >
                <div className="language-icon">
                  {language.icon}
                </div>

                <h3>{language.name}</h3>

                <p>
                  {language.description}
                </p>

                <Link to="/courses">
                  Ver curso
                  <span> →</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="learning-path" id="rutas">
          <div className="section-title">
            <span>APRENDE PASO A PASO</span>

            <h2>Tu ruta en osoCoddy</h2>

            <p>
              Desde tus primeras variables hasta tus propios proyectos.
            </p>
          </div>

          <div className="path-grid">
            <article>
              <span>01</span>
              <div className="path-icon">🧠</div>
              <h3>Fundamentos</h3>
              <p>
                Variables, operadores, condicionales,
                bucles y funciones.
              </p>
            </article>

            <article>
              <span>02</span>
              <div className="path-icon">🧩</div>
              <h3>POO</h3>
              <p>
                Clases, objetos, encapsulación,
                herencia y polimorfismo.
              </p>
            </article>

            <article>
              <span>03</span>
              <div className="path-icon">💻</div>
              <h3>Desarrollo</h3>
              <p>
                Frontend, backend, APIs,
                bases de datos y Git.
              </p>
            </article>

            <article>
              <span>04</span>
              <div className="path-icon">🚀</div>
              <h3>Proyectos</h3>
              <p>
                Construye aplicaciones reales
                para tu portafolio.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
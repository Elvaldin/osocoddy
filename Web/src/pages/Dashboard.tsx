import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { courseContents } from '../data/courseContent'
import {
  getMyProgress,
  type CompletedLesson,
} from '../services/api'
import './Dashboard.css'

interface User {
  id: number
  username: string
  email: string
  xp: number
}

const courses = [
  {
    name: 'Python',
    slug: 'python',
    icon: '🐍',
    description: 'Fundamentos de programación con Python',
  },
  {
    name: 'Java',
    slug: 'java',
    icon: '☕',
    description: 'Programación orientada a objetos',
  },
  {
    name: 'C#',
    slug: 'csharp',
    icon: '🟣',
    description: 'Desarrollo moderno con .NET',
  },
  {
    name: 'JavaScript',
    slug: 'javascript',
    icon: '🟨',
    description: 'Programación para la web',
  },
]

function Dashboard() {
  const navigate = useNavigate()

  const storedUser =
    localStorage.getItem('osocoddy_user')

  const [user, setUser] =
    useState<User | null>(() => {
      if (!storedUser) {
        return null
      }

      try {
        return JSON.parse(storedUser)
      } catch {
        return null
      }
    })

  const [
    completedLessons,
    setCompletedLessons,
  ] = useState<CompletedLesson[]>([])

  const [lastActivityDate, setLastActivityDate] =
    useState<string | null>(null)

  const [totalXp, setTotalXp] =
    useState(0)

  const [currentStreak, setCurrentStreak] =
    useState(0)

  const [longestStreak, setLongestStreak] =
    useState(0)

  const [loadingProgress, setLoadingProgress] =
    useState(true)

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const result =
          await getMyProgress()

        setCompletedLessons(
          result.completedLessons
        )

        setLastActivityDate(
          result.lastActivityDate
        )

        setTotalXp(
          result.totalXp
        )

        setCurrentStreak(
          result.currentStreak
        )

        setLongestStreak(
          result.longestStreak
        )

        /*
         * También actualizamos el XP
         * guardado localmente.
         */
        setUser((currentUser) => {
          if (!currentUser) {
            return currentUser
          }

          const updatedUser = {
            ...currentUser,
            xp: result.totalXp,
          }

          localStorage.setItem(
            'osocoddy_user',
            JSON.stringify(updatedUser)
          )

          return updatedUser
        })
      } catch (error) {
        console.error(
          'Error cargando progreso:',
          error
        )
      } finally {
        setLoadingProgress(false)
      }
    }

    loadProgress()
  }, [])


  /*
   * Datos reales de cada curso.
   */
  const coursesWithProgress =
    courses.map((course) => {
      const content =
        courseContents.find(
          (item) =>
            item.slug === course.slug
        )

      const allLessons =
        content?.modules.flatMap(
          (module) => module.lessons
        ) ?? []

      const totalLessons =
        allLessons.length

      const courseCompleted =
        completedLessons.filter(
          (lesson) =>
            lesson.courseSlug ===
            course.slug
        )

      const completedCount =
        courseCompleted.length

      const progress =
        totalLessons === 0
          ? 0
          : Math.round(
              (
                completedCount /
                totalLessons
              ) * 100
            )

      const completedIds =
        new Set(
          courseCompleted.map(
            (lesson) =>
              lesson.lessonId
          )
        )

      const nextLesson =
        allLessons.find(
          (lesson) =>
            !completedIds.has(
              lesson.id
            )
        )

      const xp =
        courseCompleted.reduce(
          (total, lesson) =>
            total + lesson.xpEarned,
          0
        )

      return {
        ...course,

        totalLessons,
        completedCount,
        progress,
        nextLesson,
        xp,
      }
    })

  /*
   * Curso que mostraremos en
   * "Tu siguiente lección".
   *
   * Primero buscamos uno iniciado.
   * Si no existe, usamos Python.
   */
  const currentCourse =
    coursesWithProgress.find(
      (course) =>
        course.completedCount > 0 &&
        course.progress < 100 &&
        course.nextLesson
    ) ??
    coursesWithProgress.find(
      (course) =>
        course.slug === 'python'
    )


  const totalCompletedLessons =
    completedLessons.length

    const getMexicoDateKey = (date: Date) => {
      const parts =
        new Intl.DateTimeFormat(
          'en-US',
          {
            timeZone: 'America/Mexico_City',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }
        ).formatToParts(date)

      const year =
        parts.find(
          (part) => part.type === 'year'
        )?.value

      const month =
        parts.find(
          (part) => part.type === 'month'
        )?.value

      const day =
        parts.find(
          (part) => part.type === 'day'
        )?.value

      return `${year}-${month}-${day}`
    }

    const todayKey =
      getMexicoDateKey(new Date())

    const lastActivityKey =
      lastActivityDate
        ? getMexicoDateKey(
            new Date(lastActivityDate)
          )
        : null

    const studiedToday =
      lastActivityKey === todayKey

  const handleLogout = () => {
    localStorage.removeItem(
      'osocoddy_token'
    )

    localStorage.removeItem(
      'osocoddy_user'
    )

    navigate('/login')
  }


  return (
    <div className="dashboard-page">

      <aside className="dashboard-sidebar">

        <Link
          to="/"
          className="dashboard-logo"
        >
          <span>🐻</span>

          <strong>
            oso<span>Coddy</span>
          </strong>
        </Link>

        <nav className="dashboard-nav">

          <Link
            to="/dashboard"
            className="dashboard-nav-active"
          >
            🏠 Inicio
          </Link>

          <Link to="/courses">
            📚 Cursos
          </Link>

          <Link to="/profile">
            👤 Mi perfil
          </Link>

        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          ↪ Cerrar sesión
        </button>

      </aside>


      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>
            <p>Dashboard</p>

            <h1>
              ¡Hola,{' '}
              {user?.username ||
                'Programador'}! 👋
            </h1>
          </div>

          <Link
            to="/profile"
            className="dashboard-user"
          >
            <div className="dashboard-avatar">
              {user?.username
                ?.charAt(0)
                .toUpperCase() ||
                'C'}
            </div>

            <div>
              <strong>
                {user?.username ||
                  'Usuario'}
              </strong>

              <span>
                {user?.email || ''}
              </span>
            </div>
          </Link>

        </header>


        <section className="dashboard-welcome">

          <div>
            <span className="welcome-badge">
              🐻 TU CAMINO CONTINÚA
            </span>

            <h2>
              Sigue aprendiendo.
              <span>
                {' '}
                Sigue construyendo.
              </span>
            </h2>

            <p>
              Completa lecciones, gana
              experiencia y avanza en tu
              camino como desarrollador.
            </p>
          </div>

          <div className="welcome-bear">
            🐻
          </div>

        </section>


        <section className="dashboard-stats">

          <article>
            <div className="stat-icon">
              ⭐
            </div>

            <div>
              <span>
                Experiencia total
              </span>

              <strong>
                {loadingProgress
                  ? '...'
                  : `${totalXp} XP`}
              </strong>
            </div>
          </article>


          <article>
            <div className="stat-icon">
              🔥
            </div>

            <div>
              <span>
                Racha actual
              </span>

              <strong>
                {loadingProgress
                  ? '...'
                  : `${currentStreak} ${
                      currentStreak === 1
                        ? 'día'
                        : 'días'
                    }`}
              </strong>
            </div>
          </article>


          <article>
            <div className="stat-icon">
              🏆
            </div>

            <div>
              <span>
                Mejor racha
              </span>

              <strong>
                {loadingProgress
                  ? '...'
                  : `${longestStreak} ${
                      longestStreak === 1
                        ? 'día'
                        : 'días'
                    }`}
              </strong>
            </div>
          </article>


          <article>
            <div className="stat-icon">
              ✅
            </div>

            <div>
              <span>
                Lecciones completadas
              </span>

              <strong>
                {loadingProgress
                  ? '...'
                  : totalCompletedLessons}
              </strong>
            </div>
          </article>

        </section>

        {!loadingProgress && (
          <section
            className={
              studiedToday
                ? 'streak-banner streak-banner-safe'
                : 'streak-banner streak-banner-warning'
            }
          >
            <div className="streak-banner-icon">
              {studiedToday ? '🔥' : '⚠️'}
            </div>

            <div>
              {studiedToday ? (
                <>
                  <strong>
                    ¡Racha protegida hoy!
                  </strong>

                  <p>
                    Ya completaste una lección hoy.
                    Vuelve mañana para seguir aumentando
                    tu racha de {currentStreak}{' '}
                    {currentStreak === 1
                      ? 'día'
                      : 'días'}.
                  </p>
                </>
              ) : currentStreak > 0 ? (
                <>
                  <strong>
                    ¡Tu racha está en riesgo!
                  </strong>

                  <p>
                    Completa una lección hoy para mantener
                    tu racha de {currentStreak}{' '}
                    {currentStreak === 1
                      ? 'día'
                      : 'días'}.
                  </p>
                </>
              ) : (
                <>
                  <strong>
                    Empieza una nueva racha 🔥
                  </strong>

                  <p>
                    Completa una lección hoy para comenzar
                    tu racha de aprendizaje.
                  </p>
                </>
              )}
            </div>
          </section>
        )}

        <section className="continue-section">

          <div className="dashboard-section-header">

            <div>
              <span>
                CONTINÚA APRENDIENDO
              </span>

              <h2>
                Tu siguiente lección
              </h2>
            </div>

            <Link to="/courses">
              Ver todos los cursos →
            </Link>

          </div>


          {currentCourse && (
            <article className="continue-card">

              <div className="continue-language">
                {currentCourse.icon}
              </div>

              <div className="continue-content">

                <span className="course-category">
                  {currentCourse.name
                    .toUpperCase()}
                </span>

                <h3>
                  {currentCourse.nextLesson
                    ? currentCourse
                        .nextLesson.title
                    : `${currentCourse.name} completado`}
                </h3>

                <p>
                  {currentCourse.description}
                </p>


                <div className="progress-info">

                  <span>
                    {currentCourse.completedCount}/
                    {currentCourse.totalLessons}{' '}
                    lecciones
                  </span>

                  <strong>
                    {loadingProgress
                      ? '...'
                      : `${currentCourse.progress}%`}
                  </strong>

                </div>


                <div className="progress-bar">

                  <div
                    className="progress-value"
                    style={{
                      width:
                        `${currentCourse.progress}%`,
                    }}
                  />

                </div>

              </div>


              {currentCourse.nextLesson ? (

                <Link
                  to={
                    `/courses/${currentCourse.slug}` +
                    `/lessons/${currentCourse.nextLesson.id}`
                  }
                  className="continue-button"
                >
                  {currentCourse.completedCount >
                  0
                    ? 'Continuar'
                    : 'Comenzar'}
                </Link>

              ) : (

                <Link
                  to={
                    `/courses/${currentCourse.slug}`
                  }
                  className="continue-button"
                >
                  Ver curso
                </Link>

              )}

            </article>
          )}

        </section>


        <section className="my-courses">

          <div className="dashboard-section-header">

            <div>
              <span>
                TUS CURSOS
              </span>

              <h2>
                Lenguajes
              </h2>
            </div>

          </div>


          <div className="dashboard-course-grid">

            {coursesWithProgress.map(
              (course) => (

                <article
                  className="dashboard-course-card"
                  key={course.slug}
                >

                  <div className="course-icon">
                    {course.icon}
                  </div>

                  <h3>
                    {course.name}
                  </h3>

                  <p>
                    {course.description}
                  </p>


                  <div className="course-progress-info">

                    <span>
                      {course.completedCount}/
                      {course.totalLessons}{' '}
                      lecciones
                    </span>

                    <strong>
                      {loadingProgress
                        ? '...'
                        : `${course.progress}%`}
                    </strong>

                  </div>


                  <div className="course-progress-bar">

                    <div
                      style={{
                        width:
                          `${course.progress}%`,
                      }}
                    />

                  </div>


                  <div className="dashboard-course-xp">
                    ⭐️ {course.xp} XP
                  </div>


                  <Link
                    to={
                      `/courses/${course.slug}`
                    }
                  >
                    {course.progress > 0
                      ? 'Continuar curso →'
                      : 'Comenzar curso →'}
                  </Link>

                </article>

              )
            )}

          </div>

        </section>

      </main>

    </div>
  )
}

export default Dashboard
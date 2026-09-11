import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { courses } from '../data/courses'
import { courseContents } from '../data/courseContent'

import {
  getMyProgress,
  type CompletedLesson,
} from '../services/api'

import './Courses.css'

function Courses() {

  const [completedLessons, setCompletedLessons] =
    useState<CompletedLesson[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
  const loadProgress = async () => {
    try {
      const result = await getMyProgress()

      setCompletedLessons(
        result.completedLessons
      )
    } catch (error) {
      console.error(
        'Error cargando progreso:',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  loadProgress()
}, [])

  return (
    <div className="courses-page">

      <header className="courses-navbar">

        <Link
          to="/dashboard"
          className="courses-logo"
        >
          <span>🐻</span>

          <strong>
            oso<span>Coddy</span>
          </strong>
        </Link>

        <nav>
          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link
            to="/courses"
            className="active"
          >
            Cursos
          </Link>

          <Link to="/profile">
            Perfil
          </Link>
        </nav>

      </header>

      <main className="courses-container">

        <section className="courses-hero">

          <span>
            🐻 EXPLORA Y APRENDE
          </span>

          <h1>
            ¿Qué quieres
            <strong> aprender hoy?</strong>
          </h1>

          <p>
            Elige una tecnología y comienza desde
            los fundamentos hasta construir proyectos reales.
          </p>

        </section>

        <section className="courses-content">

          <div className="courses-title">

            <div>
              <span>CATÁLOGO</span>

              <h2>
                Lenguajes disponibles
              </h2>
            </div>

            <p>
              {courses.length} cursos disponibles
            </p>

          </div>

          <div className="courses-grid">

            {courses.map((course) => {
              const content = courseContents.find(
                (item) => item.slug === course.slug
              )

              const totalLessons =
                content?.modules.reduce(
                  (total, module) =>
                    total + module.lessons.length,
                  0
                ) ?? 0

              const completedCount =
                completedLessons.filter(
                  (lesson) =>
                    lesson.courseSlug === course.slug
                ).length

              const progressPercentage =
                totalLessons === 0
                  ? 0
                  : Math.round(
                    (completedCount / totalLessons) * 100
                  )

            return (
              <article
                className="course-card"
                key={course.id}
              >

                <div className="course-top">

                  <div className="course-main-icon">
                    {course.icon}
                  </div>

                  <span className="course-level">
                    {course.level}
                  </span>

                </div>

                <span className="course-category">
                  {course.category}
                </span>

                <h3>
                  {course.name}
                </h3>

                <p>
                  {course.description}
                </p>

                <div className="course-information">

                  <span>
                    📚 {completedCount}/{totalLessons} lecciones
                  </span>

                  <span>
                    ⭐ 0 XP
                  </span>

                </div>

                <div className="course-progress">

                  <div className="course-progress-header">

                    <span>Progreso</span>

                    <strong>
                      {loading
                        ? '...'
                        : `${progressPercentage}%`}
                    </strong>

                  </div>

                  <div className="course-progress-track">

                    <div
                      className="course-progress-value"
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />

                  </div>

                </div>

                <Link
                  to={`/courses/${course.slug}`}
                  className="course-button"
                >
                  {progressPercentage > 0
                    ? 'Continuar curso'
                    : 'Comenzar curso'}
                  <span>→</span>
                </Link>

                </article>
              )
            })}

          </div>

        </section>

        <section className="coming-soon">

          <div>
            <span>🚀 PRÓXIMAMENTE</span>

            <h2>
              Mucho más está por llegar
            </h2>

            <p>
              Estamos preparando nuevos caminos para
              seguir ampliando tus habilidades.
            </p>
          </div>

          <div className="coming-technologies">

            <span>⚙️ C++</span>
            <span>🎯 Dart</span>
            <span>📱 Flutter</span>
            <span>🟠 Kotlin</span>
            <span>🍎 Swift</span>
            <span>🐹 Go</span>
            <span>🦀 Rust</span>
            <span>🗄️ SQL</span>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Courses